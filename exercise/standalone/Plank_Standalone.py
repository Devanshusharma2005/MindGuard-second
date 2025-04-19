import mediapipe as mp
import cv2
import time
import numpy as np
import os
import sys
import argparse
import json
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, UploadFile, File
import asyncio
import uvicorn
import shutil
from datetime import datetime

current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
if parent_dir not in sys.path:
    sys.path.append(parent_dir)
    
from src.ThreadedCamera import ThreadedCamera
from src.utils import *

mp_drawing = mp.solutions.drawing_utils
mp_holistic = mp.solutions.holistic
mp_pose = mp.solutions.pose

app = FastAPI()

# Create video directory if it doesn't exist
VIDEO_DIR = r"C:\Users\archi\Downloads\Mind\MindGuard\exercise\standalone\video"
os.makedirs(VIDEO_DIR, exist_ok=True)

class Plank():
    def __init__(self):
        self.clients = set()
        
    async def register(self, websocket: WebSocket):
        await websocket.accept()
        self.clients.add(websocket)
        
    def unregister(self, websocket: WebSocket):
        self.clients.remove(websocket)
        
    async def broadcast(self, message: dict):
        for client in self.clients:
            await client.send_json(message)
        
    def process_frame(self, frame, target_width=640):
        """
        Preprocess the frame to ensure consistent processing regardless of video size/orientation
        """
        if frame is None:
            return None
            
        # Get original dimensions
        h, w = frame.shape[:2]
        
        # Calculate new height while maintaining aspect ratio
        target_height = int(h * (target_width / w))
        
        # Resize frame to target dimensions
        resized_frame = cv2.resize(frame, (target_width, target_height))
        
        return resized_frame

    async def exercise(self, source, show_video=False):
        # Initialize variables
        plankTimer = None
        plankDuration = 0
        empty_frame_count = 0
        isInPlankPosition = False
        
        # Initialize threaded camera
        threaded_camera = ThreadedCamera(source)
        
        # Wait a bit for camera to initialize
        time.sleep(1)
        
        # Initialize pose detection
        pose = mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5)
        
        # Send initial message
        await self.broadcast({
            "type": "status",
            "message": "Analyzing plank exercise... Please wait."
        })
        
        try:
            while True:
                # Get a frame from the video source
                success, image = threaded_camera.show_frame()
                
                # Check if we've reached the end of the video
                if not success or image is None:
                    empty_frame_count += 1
                    if empty_frame_count > 10:  # If 10 consecutive frames are empty, assume video ended
                        break
                    continue
                
                # Reset empty frame counter when we get a valid frame
                empty_frame_count = 0
                
                # Process frame to handle different video sizes/orientations
                processed_image = self.process_frame(image)
                if processed_image is None:
                    continue
                
                # Flip the image horizontally for a mirror effect
                processed_image = cv2.flip(processed_image, 1)
                
                # Convert the BGR image to RGB
                image_rgb = cv2.cvtColor(processed_image, cv2.COLOR_BGR2RGB)
                
                # Process the image and detect poses
                results = pose.process(image_rgb)
                
                if results.pose_landmarks:
                    # Get landmark coordinates
                    idx_to_coordinates = get_idx_to_coordinates(processed_image, results)
                    
                    # Try to analyze plank position
                    try:
                        # Check if body is in plank position by analyzing shoulders, hips, and ankles
                        isInPlankPositionNow = False
                        
                        # Check shoulder-hip-ankle alignment (straight back)
                        if (11 in idx_to_coordinates and 23 in idx_to_coordinates and 27 in idx_to_coordinates):
                            # Get angle between shoulder-hip-ankle
                            angle = ang((idx_to_coordinates[11], idx_to_coordinates[23]),
                                        (idx_to_coordinates[23], idx_to_coordinates[27]))
                            
                            # If angle is close to 180 degrees (straight line), body is in plank position
                            if 160 < angle < 200:
                                isInPlankPositionNow = True
                        
                        # Start/stop plank timer based on position
                        if isInPlankPositionNow and not isInPlankPosition:
                            # Started plank position
                            plankTimer = time.time()
                            isInPlankPosition = True
                            await self.broadcast({
                                "type": "status",
                                "message": "Plank position started"
                            })
                        elif not isInPlankPositionNow and isInPlankPosition:
                            # Ended plank position
                            if plankTimer is not None:
                                duration = time.time() - plankTimer
                                plankDuration += duration
                                await self.broadcast({
                                    "type": "status",
                                    "message": f"Plank position ended. Duration: {duration:.1f}s"
                                })
                                plankTimer = None
                            isInPlankPosition = False
                            
                        # Update ongoing plank timing
                        current_duration = plankDuration
                        if isInPlankPosition and plankTimer is not None:
                            current_duration += time.time() - plankTimer
                            # Send update every second
                            if int(current_duration) != int(plankDuration):
                                await self.broadcast({
                                    "type": "progress",
                                    "duration": round(current_duration, 1),
                                    "isInPosition": isInPlankPosition
                                })
                            
                    except Exception as e:
                        await self.broadcast({
                            "type": "error",
                            "message": f"Error analyzing frame: {str(e)}"
                        })
                
        finally:
            # Clean up resources
            pose.close()
            threaded_camera.release()
            
            # Send final results
            await self.broadcast({
                "type": "complete",
                "totalDuration": round(plankDuration, 1),
                "success": plankDuration >= 3  # Minimum 3 seconds for success
            })
        
        return round(plankDuration, 1)

plank_server = Plank()

@app.websocket("/ws/plank")
async def websocket_endpoint(websocket: WebSocket):
    await plank_server.register(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # Handle any incoming messages if needed
            pass
    except WebSocketDisconnect:
        plank_server.unregister(websocket)

@app.post("/analyze-plank")
async def analyze_plank(video: UploadFile = File(...)):
    try:
        # Generate unique filename with timestamp
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        video_filename = f"plank_{timestamp}.mp4"
        video_path = os.path.join(VIDEO_DIR, video_filename)
        
        # Save the uploaded video
        with open(video_path, "wb") as buffer:
            shutil.copyfileobj(video.file, buffer)
        
        # Start the analysis
        duration = await plank_server.exercise(video_path)
        
        return {
            "success": True,
            "duration": duration,
            "message": f"Plank analysis completed. Total duration: {duration} seconds",
            "video_path": video_path
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8004)
