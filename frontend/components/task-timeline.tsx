"use client"

import { useState, useEffect } from "react"
import type { Task } from "@/types"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { CheckCircle, Circle, Clock, TrendingUp, Brain, Heart, Droplets, Dumbbell, Trophy, XCircle } from "lucide-react"

interface TaskTimelineProps {
  tasks: Task[]
  currentTaskIndex: number
  onCompleteTask: (taskId: string) => void
}

export function TaskTimeline({ tasks, currentTaskIndex, onCompleteTask }: TaskTimelineProps) {
  const [animatedProgress, setAnimatedProgress] = useState<Record<string, number>>({})
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [activeVideoTask, setActiveVideoTask] = useState<string | null>(null)
  const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [videoError, setVideoError] = useState<string | null>(null)
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null)
  const [isAudioPlaying, setIsAudioPlaying] = useState(false)
  const [showRewardsPopup, setShowRewardsPopup] = useState(false)
  const [currentReward, setCurrentReward] = useState<string | null>(null)
  const [isHydrationVideoPlaying, setIsHydrationVideoPlaying] = useState(false)
  const [activeHydrationTask, setActiveHydrationTask] = useState<string | null>(null)
  const [hydrationVideoRef, setHydrationVideoRef] = useState<HTMLVideoElement | null>(null)
  const [isWalkingVideoPlaying, setIsWalkingVideoPlaying] = useState(false)
  const [activeWalkingTask, setActiveWalkingTask] = useState<string | null>(null)
  const [walkingVideoRef, setWalkingVideoRef] = useState<HTMLVideoElement | null>(null)
  const [showVideoUpload, setShowVideoUpload] = useState<boolean>(false)
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null)
  const [walkingPercentage, setWalkingPercentage] = useState<number | null>(null)
  const [analysisMessage, setAnalysisMessage] = useState<string | null>(null)
  const [analysisHistory, setAnalysisHistory] = useState<any[]>([])
  const [showFailurePopup, setShowFailurePopup] = useState(false)
  const [isPlankVideoPlaying, setIsPlankVideoPlaying] = useState(false)
  const [activePlankTask, setActivePlankTask] = useState<string | null>(null)
  const [plankVideoRef, setPlankVideoRef] = useState<HTMLVideoElement | null>(null)
  const [plankAnalysis, setPlankAnalysis] = useState<any>(null)
  const [showPlankUpload, setShowPlankUpload] = useState<boolean>(false)

  // Initialize animated progress values
  useEffect(() => {
    const initialProgress: Record<string, number> = {}
    tasks.forEach((task) => {
      initialProgress[task.id] = task.progress || 0
    })
    setAnimatedProgress(initialProgress)
  }, [tasks])

  // Add this useEffect to handle both video and audio
  useEffect(() => {
    if (videoRef && audioRef && isVideoPlaying && activeVideoTask) {
      const playMedia = async () => {
        try {
          console.log("Attempting to play video and audio");
          // Reset both media to start
          videoRef.currentTime = 0;
          audioRef.currentTime = 0;
          
          // Try to play both media
          const videoPromise = videoRef.play();
          const audioPromise = audioRef.play();
          
          await Promise.all([videoPromise, audioPromise]);
          console.log("Both video and audio playing successfully");
        } catch (error) {
          console.error("Error playing media:", error);
          setVideoError("Failed to play meditation content");
          setIsVideoPlaying(false);
          setIsAudioPlaying(false);
          setActiveVideoTask(null);
        }
      };
      playMedia();
    }
  }, [videoRef, audioRef, isVideoPlaying, activeVideoTask]);

  // Add debug logging for video events
  useEffect(() => {
    if (videoRef) {
      videoRef.addEventListener('loadstart', () => console.log('Video loading started'));
      videoRef.addEventListener('loadeddata', () => console.log('Video data loaded'));
      videoRef.addEventListener('playing', () => console.log('Video is playing'));
      videoRef.addEventListener('error', (e) => {
        console.error('Video error:', videoRef.error);
        setVideoError(videoRef.error?.message || 'Error loading video');
      });
    }
  }, [videoRef]);

  // Get task icon based on category
  const getTaskIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "walk":
        return <Dumbbell className="h-5 w-5" />
      case "meditation":
        return <Brain className="h-5 w-5" />
      case "exercise":
        return <Dumbbell className="h-5 w-5" />
      case "hydration":
        return <Droplets className="h-5 w-5" />
      case "wellness":
        return <Heart className="h-5 w-5" />
      default:
        return <TrendingUp className="h-5 w-5" />
    }
  }

  // Format time to 12-hour format
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number)
    const period = hours >= 12 ? "PM" : "AM"
    const formattedHours = hours % 12 || 12
    return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${period}`
  }

  const handleVideoEnd = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    setIsVideoPlaying(false);
    setIsAudioPlaying(false);
    setActiveVideoTask(null);
    
    if (audioRef) {
      audioRef.pause();
      audioRef.currentTime = 0;
    }
    
    // Show rewards popup for meditation
    if (task && task.category.toLowerCase() === "meditation") {
      setCurrentReward(task.reward);
      setShowRewardsPopup(true);
      setTimeout(() => {
        onCompleteTask(taskId);
        setShowRewardsPopup(false);
        setCurrentReward(null);
      }, 3000);
    }
  };

  const fetchAnalysisHistory = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8004/analysis-history')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      if (data.history) {
        setAnalysisHistory(data.history)
      }
    } catch (error) {
      console.error('Error fetching analysis history:', error)
      // Don't show error to user as this is not critical functionality
    }
  }

  useEffect(() => {
    fetchAnalysisHistory()
  }, [])

  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      try {
        console.log("Starting video upload...", {
          name: file.name,
          type: file.type,
          size: file.size
        })
        setIsLoading(true)
        setVideoError(null)
        
        const formData = new FormData()
        formData.append('video', file)
        
        console.log("Sending request to server...")
        const response = await fetch('http://127.0.0.1:8004/analyze', {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        })

        console.log("Server response status:", response.status)
        const responseText = await response.text()
        console.log("Raw server response:", responseText)
        
        let data
        try {
          data = JSON.parse(responseText)
        } catch (e) {
          console.error("Error parsing server response:", e)
          throw new Error("Invalid server response: " + responseText)
        }

        if (!response.ok) {
          throw new Error(data.error || 'Failed to upload video')
        }

        if (data.success) {
          // Make API call to update task completion
          try {
            const taskId = tasks[currentTaskIndex].id
            const apiResponse = await fetch('/api/tasks/complete', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                taskId,
                videoPath: data.video_path || '',
                walkingPercentage: data.walking_percentage
              })
            })

            if (!apiResponse.ok) {
              throw new Error('Failed to update task completion status')
            }

            const apiData = await apiResponse.json()
            console.log('Task completion updated:', apiData)

            setWalkingPercentage(data.walking_percentage)
            setIsWalkingVideoPlaying(true)
            setActiveWalkingTask(tasks[currentTaskIndex].id)

            // Check walking percentage and show appropriate popup
            if (data.walking_percentage >= 35) {
              // Show success message and reward
              setCurrentReward(tasks[currentTaskIndex].reward)
              setShowRewardsPopup(true)
              
              // Complete task after showing reward
              setTimeout(() => {
                onCompleteTask(tasks[currentTaskIndex].id)
                setShowRewardsPopup(false)
                setCurrentReward(null)
              }, 3000)
            } else {
              // Show failure popup
              setShowFailurePopup(true)
              // Hide failure popup after 3 seconds
              setTimeout(() => {
                setShowFailurePopup(false)
              }, 3000)
            }
          } catch (apiError) {
            console.error('Error updating task completion:', apiError)
            throw new Error('Failed to update task completion status')
          }
        } else {
          throw new Error(data.error || 'Analysis failed')
        }

      } catch (error) {
        console.error('Error in handleVideoUpload:', error)
        setVideoError(error instanceof Error ? error.message : 'Failed to process video. Please ensure the server is running.')
        setIsWalkingVideoPlaying(false)
        setActiveWalkingTask(null)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handlePlankVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      try {
        console.log("Starting plank video upload...", {
          name: file.name,
          type: file.type,
          size: file.size
        })
        setIsLoading(true)
        setVideoError(null)
        
        const formData = new FormData()
        formData.append('video', file)
        
        console.log("Sending request to server...")
        const response = await fetch('http://127.0.0.1:8004/analyze-plank', {
          method: 'POST',
          body: formData,
          headers: {
            // Don't set Content-Type header, let the browser set it with the boundary
          }
        })

        console.log("Server response status:", response.status)
        const responseText = await response.text()
        console.log("Server response:", responseText)
        
        let data
        try {
          data = JSON.parse(responseText)
        } catch (e) {
          console.error("Error parsing server response:", e)
          throw new Error("Invalid server response")
        }

        if (!response.ok) {
          throw new Error(data.error || 'Failed to upload video')
        }

        if (data.success) {
          // Make API call to update task completion
          try {
            const taskId = tasks[currentTaskIndex].id
            const apiResponse = await fetch('/api/tasks/complete-plank', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                taskId,
                videoPath: data.video_path || '',
                duration: data.duration,
                treasureAwarded: data.treasureAwarded
              })
            })

            if (!apiResponse.ok) {
              throw new Error('Failed to update plank task completion status')
            }

            const apiData = await apiResponse.json()
            console.log('Plank task completion updated:', apiData)

            setPlankAnalysis(data)
            setIsPlankVideoPlaying(true)
            setActivePlankTask(tasks[currentTaskIndex].id)

            // Only show reward popup and complete task if treasure was awarded
            if (data.treasureAwarded) {
              // Show success message and reward
              setCurrentReward(tasks[currentTaskIndex].reward)
              setShowRewardsPopup(true)
              
              // Complete task after showing reward
              setTimeout(() => {
                onCompleteTask(tasks[currentTaskIndex].id)
                setShowRewardsPopup(false)
                setCurrentReward(null)
              }, 3000)
            } else {
              // Show failure message if no treasure was awarded
              setShowFailurePopup(true)
              setTimeout(() => {
                setShowFailurePopup(false)
              }, 3000)
            }
          } catch (apiError) {
            console.error('Error updating plank task completion:', apiError)
            throw new Error('Failed to update plank task completion status')
          }
        } else {
          throw new Error(data.error || 'Analysis failed')
        }

      } catch (error) {
        console.error('Error in handlePlankVideoUpload:', error)
        setVideoError(error instanceof Error ? error.message : 'Failed to process video. Please ensure the plank analysis server is running.')
        setIsPlankVideoPlaying(false)
        setActivePlankTask(null)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleStartTask = async (task: Task) => {
    if (task.category.toLowerCase() === "walk") {
      try {
        setIsLoading(true);
        console.log("Starting walking task...");
        setVideoError(null);
        setShowVideoUpload(true);
      } catch (error) {
        console.error("Task start error:", error);
        setVideoError("Failed to start walking task");
        setShowVideoUpload(false);
      } finally {
        setIsLoading(false);
      }
    } else if (task.category.toLowerCase() === "meditation") {
      try {
        setIsLoading(true);
        console.log("Starting meditation task...");
        setVideoError(null);
        setIsVideoPlaying(true);
        setIsAudioPlaying(true);
        setActiveVideoTask(task.id);
      } catch (error) {
        console.error("Task start error:", error);
        setVideoError("Failed to start meditation");
        setIsVideoPlaying(false);
        setIsAudioPlaying(false);
        setActiveVideoTask(null);
      } finally {
        setIsLoading(false);
      }
    } else if (task.category.toLowerCase() === "hydration") {
      try {
        setIsLoading(true);
        console.log("Starting hydration task...");
        setVideoError(null);
        setIsHydrationVideoPlaying(true);
        setActiveHydrationTask(task.id);
      } catch (error) {
        console.error("Task start error:", error);
        setVideoError("Failed to start hydration task");
        setIsHydrationVideoPlaying(false);
        setActiveHydrationTask(null);
      } finally {
        setIsLoading(false);
      }
    } else if (task.category.toLowerCase() === "exercise" && task.title.toLowerCase() === "plank") {
      try {
        setIsLoading(true);
        console.log("Starting plank exercise...");
        setVideoError(null);
        setShowPlankUpload(true);
      } catch (error) {
        console.error("Task start error:", error);
        setVideoError("Failed to start plank exercise");
        setShowPlankUpload(false);
      } finally {
        setIsLoading(false);
      }
    } else {
      onCompleteTask(task.id);
    }
  };

  const handleHydrationVideoEnd = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    setIsHydrationVideoPlaying(false);
    setActiveHydrationTask(null);
    
    // Show rewards popup for hydration
    if (task && task.category.toLowerCase() === "hydration") {
      setCurrentReward(task.reward);
      setShowRewardsPopup(true);
      setTimeout(() => {
        onCompleteTask(taskId);
        setShowRewardsPopup(false);
        setCurrentReward(null);
      }, 3000);
    }
  };

  const handleWalkingVideoEnd = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    setIsWalkingVideoPlaying(false);
    setActiveWalkingTask(null);
    
    if (task) {
      setCurrentReward(task.reward);
      setShowRewardsPopup(true);
      setTimeout(() => {
        onCompleteTask(taskId);
        setShowRewardsPopup(false);
        setCurrentReward(null);
      }, 3000);
    }
  };

  // Add useEffect for hydration video
  useEffect(() => {
    if (hydrationVideoRef && isHydrationVideoPlaying && activeHydrationTask) {
      const playVideo = async () => {
        try {
          console.log("Attempting to play hydration video");
          hydrationVideoRef.currentTime = 0;
          await hydrationVideoRef.play();
          console.log("Hydration video playing successfully");
        } catch (error) {
          console.error("Error playing hydration video:", error);
          setVideoError("Failed to play hydration video");
          setIsHydrationVideoPlaying(false);
          setActiveHydrationTask(null);
        }
      };
      playVideo();
    }
  }, [hydrationVideoRef, isHydrationVideoPlaying, activeHydrationTask]);

  // Add this useEffect for walking video
  // useEffect(() => {
  //   if (walkingVideoRef && isWalkingVideoPlaying && activeWalkingTask) {
  //     const playVideo = async () => {
  //       try {
  //         console.log("Attempting to play walking video");
  //         walkingVideoRef.currentTime = 0;
  //         await walkingVideoRef.play();
  //         console.log("Walking video playing successfully");
  //       } catch (error) {
  //         console.error("Error playing walking video:", error);
  //         
  //         setIsWalkingVideoPlaying(false);
  //         setActiveWalkingTask(null);
  //       }
  //     };
  //     playVideo();
  //   }
  // }, [walkingVideoRef, isWalkingVideoPlaying, activeWalkingTask]);

  // Add this useEffect for cleanup
  useEffect(() => {
    return () => {
      // Cleanup video URLs when component unmounts
      if (selectedVideo) {
        URL.revokeObjectURL(URL.createObjectURL(selectedVideo))
      }
    }
  }, [selectedVideo])

  return (
    <div className="relative max-w-3xl mx-auto">
      {/* Central track line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500/50 to-pink-500/50 transform -translate-x-1/2 rounded-full" />

      {/* Train marker (current position) */}
      {currentTaskIndex < tasks.length && (
        <div
          className="absolute left-1/2 w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full transform -translate-x-1/2 z-10 shadow-lg shadow-purple-500/20 flex items-center justify-center"
          style={{
            top: `${(currentTaskIndex / tasks.length) * 100}%`,
            transition: "top 0.5s ease-in-out",
          }}
        >
          <div className="w-2 h-2 bg-white rounded-full" />
        </div>
      )}

      {tasks.map((task, index) => {
        const isCompleted = task.completed
        const isCurrent = index === currentTaskIndex
        const isPending = index > currentTaskIndex

        // Determine status color
        const statusColor = isCompleted
          ? "from-green-500 to-emerald-500"
          : isCurrent
            ? "from-purple-500 to-pink-500"
            : "from-slate-400 to-slate-500"

        // Determine card position (left or right)
        const isLeft = index % 2 === 0

        return (
          <div key={task.id} className="relative mb-16">
            {/* Time indicator before task */}
            {index === 0 && (
              <div
                className={cn(
                  "absolute top-0 text-sm font-medium text-muted-foreground",
                  isLeft ? "left-[calc(50%+1.5rem)]" : "right-[calc(50%+1.5rem)]",
                )}
              >
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{formatTime(task.startTime)}</span>
                </div>
              </div>
            )}

            {/* Task card */}
            <div
              className={cn(
                "relative grid gap-2 p-4 rounded-xl transition-all",
                "bg-card border shadow-lg hover:shadow-xl",
                isCurrent && "ring-2 ring-purple-500/50 animate-pulse-slow",
                isLeft ? "mr-[calc(50%+1rem)] rounded-tr-none" : "ml-[calc(50%+1rem)] rounded-tl-none",
              )}
            >
              {/* Task header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={cn("p-1.5 rounded-full bg-gradient-to-br", statusColor)}>
                    {getTaskIcon(task.category)}
                  </div>
                  <h3 className="font-semibold">{task.title}</h3>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-secondary">{task.category}</span>
                </div>
              </div>

              {/* Task description */}
              <p className="text-sm text-muted-foreground">{task.description}</p>

              {/* Add plank image for plank task */}
              {task.category.toLowerCase() === "exercise" && task.title.toLowerCase() === "plank" && (
                <div className="mt-4 relative rounded-lg overflow-hidden">
                  <img
                    src="/plank.gif"
                    alt="Plank exercise demonstration"
                    className="w-full rounded-lg"
                  />
                </div>
              )}

              {/* Video player for walking tasks */}
              {task.category.toLowerCase() === "walk" && !isWalkingVideoPlaying && isCurrent && (
                <div className="mt-4 relative rounded-lg overflow-hidden">
                  {showVideoUpload ? (
                    <div className="flex flex-col gap-2">
                      <Button 
                        onClick={() => document.getElementById('videoUpload')?.click()}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                        disabled={isLoading}
                      >
                        {isLoading ? "Analyzing..." : "Upload Video"}
                      </Button>
                      <input
                        id="videoUpload"
                        type="file"
                        accept="video/*"
                        className="hidden"
                        onChange={handleVideoUpload}
                        disabled={isLoading}
                      />
                      
                      {task.category.toLowerCase() === "walk" && isWalkingVideoPlaying && activeWalkingTask === task.id && (
                        <div className="mt-4 relative rounded-lg overflow-hidden">
                          {videoError && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-2">
                              {videoError}
                            </div>
                          )}
                          {(walkingPercentage ?? 0) < 35 && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-medium text-red-800">Task Failed!</h4>
                                  <p className="text-sm text-red-600">
                                    You failed the morning walk task. Please try again.
                                  </p>
                                </div>
                                <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center">
                                  <XCircle className="h-6 w-6 text-red-500" />
                                </div>
                              </div>
                            </div>
                          )}
                          {( walkingPercentage ?? 0 ) >= 35 && (
                            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-medium text-green-800">Task Completed!</h4>
                                  <p className="text-sm text-green-600">
                                    Great job! You've completed your morning walk.
                                  </p>
                                </div>
                                <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                                  <CheckCircle className="h-6 w-6 text-green-500" />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {videoError && (
                        <div className="text-red-500 text-sm mt-1 bg-red-50 border border-red-200 rounded px-4 py-2">
                          {videoError}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                        <p>Upload a video to analyze your walking progress.</p>
                    </div>
                  )}
                </div>
              )}

               {/* Video player for meditation tasks */}
               {task.category.toLowerCase() === "meditation" && !isVideoPlaying && isCurrent && (
                <div className="mt-4 relative rounded-lg overflow-hidden">
                  <video
                    className="w-full rounded-lg"
                    src="https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4"
                    poster="/meditation.png"
                    playsInline
                  />
                </div>
              )}

              {task.category.toLowerCase() === "meditation" && isVideoPlaying && activeVideoTask === task.id && (
                <div className="mt-4 relative rounded-lg overflow-hidden">
                  {videoError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-2">
                      {videoError}
                    </div>
                  )}
                  <audio
                    ref={setAudioRef}
                    src={`${window.location.origin}/relaxing-music.mp3`}
                    preload="auto"
                    loop={false}
                    onError={(e) => {
                      console.error("Audio error event:", e);
                      setVideoError("Error playing audio");
                    }}
                  />
                  <video
                    ref={setVideoRef}
                    className="w-full rounded-lg"
                    src={`${window.location.origin}/meditation.mp4`}
                    controls={false}
                    playsInline
                    muted={false}
                    autoPlay
                    preload="auto"
                    onLoadStart={() => console.log("Meditation video load started")}
                    onLoadedData={() => console.log("Meditation video data loaded")}
                    onPlay={() => console.log("Meditation video play event")}
                    onPlaying={() => console.log("Meditation video playing event")}
                    onEnded={() => {
                      console.log("Meditation video ended");
                      handleVideoEnd(task.id);
                    }}
                    onError={(e) => {
                      console.error("Meditation video error event:", e);
                      setVideoError("Error playing meditation video");
                    }}
                    style={{ pointerEvents: 'none' }}
                  />
                </div>
              )}

              {/* Video player for hydration tasks */}
              {task.category.toLowerCase() === "hydration" && !isHydrationVideoPlaying && isCurrent && (
                <div className="mt-4 relative rounded-lg overflow-hidden">
                  <video
                    className="w-full rounded-lg"
                    src={`${window.location.origin}/hydration-preview.mp4`}
                    poster="/hydrate.png"
                    playsInline
                  />
                </div>
              )}

              {task.category.toLowerCase() === "hydration" && isHydrationVideoPlaying && activeHydrationTask === task.id && (
                <div className="mt-4 relative rounded-lg overflow-hidden">
                  {videoError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-2">
                      {videoError}
                    </div>
                  )}
                  <video
                    ref={setHydrationVideoRef}
                    className="w-full rounded-lg"
                    src={`${window.location.origin}/hydration.mp4`}
                    controls={false}
                    playsInline
                    muted={false}
                    autoPlay
                    preload="auto"
                    onLoadStart={() => console.log("Hydration video load started")}
                    onLoadedData={() => console.log("Hydration video data loaded")}
                    onPlay={() => console.log("Hydration video play event")}
                    onPlaying={() => console.log("Hydration video playing event")}
                    onEnded={() => {
                      console.log("Hydration video ended");
                      handleHydrationVideoEnd(task.id);
                    }}
                    onError={(e) => {
                      console.error("Hydration video error event:", e);
                      setVideoError("Error playing hydration video");
                    }}
                    style={{ pointerEvents: 'none' }}
                  />
                </div>
              )}

              {/* Video player for plank tasks */}
              {task.category.toLowerCase() === "exercise" && task.title.toLowerCase() === "plank" && !isPlankVideoPlaying && isCurrent && (
                <div className="mt-4 relative rounded-lg overflow-hidden">
                  {showPlankUpload ? (
                    <div className="flex flex-col gap-2">
                      <Button 
                        onClick={() => document.getElementById('plankVideoUpload')?.click()}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                        disabled={isLoading}
                      >
                        {isLoading ? "Analyzing..." : "Upload Plank Video"}
                      </Button>
                      <input
                        id="plankVideoUpload"
                        type="file"
                        accept="video/*"
                        className="hidden"
                        onChange={handlePlankVideoUpload}
                        disabled={isLoading}
                      />
                      
                      {videoError && (
                        <div className="text-red-500 text-sm mt-1 bg-red-50 border border-red-200 rounded px-4 py-2">
                          {videoError}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <p>Upload a video of your plank exercise for analysis.</p>
                    </div>
                  )}
                </div>
              )}

              {task.category.toLowerCase() === "exercise" && task.title.toLowerCase() === "plank" && isPlankVideoPlaying && activePlankTask === task.id && (
                <div className="mt-4 relative rounded-lg overflow-hidden">
                  {plankAnalysis && (
                    <div className={`p-4 ${plankAnalysis.treasureAwarded ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'} rounded-lg`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className={`font-medium ${plankAnalysis.treasureAwarded ? 'text-green-800' : 'text-red-800'}`}>
                            {plankAnalysis.treasureAwarded ? 'Plank Analysis Complete!' : 'Plank Analysis Failed'}
                          </h4>
                          <p className={`text-sm ${plankAnalysis.treasureAwarded ? 'text-green-600' : 'text-red-600'}`}>
                            Duration: {plankAnalysis.duration} seconds
                          </p>
                          <p className={`text-sm ${plankAnalysis.treasureAwarded ? 'text-green-600' : 'text-red-600'}`}>
                            {plankAnalysis.message}
                          </p>
                        </div>
                        <div className={`h-10 w-10 ${plankAnalysis.treasureAwarded ? 'bg-green-100' : 'bg-red-100'} rounded-full flex items-center justify-center`}>
                          {plankAnalysis.treasureAwarded ? (
                            <CheckCircle className="h-6 w-6 text-green-500" />
                          ) : (
                            <XCircle className="h-6 w-6 text-red-500" />
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Task progress */}
              <div className="mt-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium">Progress</span>
                  <span className="text-xs font-medium">{task.progress}%</span>
                </div>
                <Progress
                  value={task.progress}
                  className={cn(
                    "h-2",
                    isCompleted
                      ? "bg-muted [&>div]:bg-gradient-to-r [&>div]:from-green-500 [&>div]:to-emerald-500"
                      : isCurrent
                        ? "bg-muted [&>div]:bg-gradient-to-r [&>div]:from-purple-500 [&>div]:to-pink-500"
                        : "bg-muted [&>div]:bg-slate-400",
                  )}
                />
              </div>

              {/* Reward indicator */}
              <div className="flex items-center gap-2 mt-1">
                <div className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500">
                  Reward: {task.reward}
                </div>
              </div>

              {/* Modified action button */}
              <Button
                className={cn(
                  "mt-2 w-full",
                  isCompleted
                    ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                    : isCurrent
                      ? task.category.toLowerCase() === "walk"
                        ? isLoading
                          ? "Loading..."
                          : isWalkingVideoPlaying && activeWalkingTask === task.id
                            ? "Walking in Progress..."
                            : showVideoUpload
                              ? "bg-gray-400"
                              : "Start Walking"
                        : task.category.toLowerCase() === "meditation"
                          ? isLoading
                            ? "Loading..."
                            : isVideoPlaying && activeVideoTask === task.id
                              ? "Meditation in Progress..."
                              : "Start Meditation"
                          : task.category.toLowerCase() === "hydration"
                            ? isLoading
                              ? "Loading..."
                              : isHydrationVideoPlaying && activeHydrationTask === task.id
                                ? "Hydration in Progress..."
                                : "Start Hydration"
                            : "Upload Video"
                      : "bg-muted text-muted-foreground",
                )}
                disabled={
                  isCompleted || 
                  isPending || 
                  (isVideoPlaying && activeVideoTask === task.id) || 
                  (isHydrationVideoPlaying && activeHydrationTask === task.id) ||
                  (task.category.toLowerCase() === "walk" && showVideoUpload)
                }
                onClick={() => {
                  if (task.category.toLowerCase() !== "walk" && 
                      task.category.toLowerCase() !== "meditation" && 
                      task.category.toLowerCase() !== "hydration") {
                    document.getElementById('videoUpload')?.click();
                  } else {
                    handleStartTask(task);
                  }
                }}
              >
                {isCompleted 
                  ? "Completed" 
                  : isCurrent 
                    ? task.category.toLowerCase() === "walk"
                      ? isLoading
                        ? "Loading..."
                        : isWalkingVideoPlaying && activeWalkingTask === task.id
                          ? "Walking in Progress..."
                          : showVideoUpload
                            ? "Upload Video Active"
                            : "Start Walking"
                    : task.category.toLowerCase() === "meditation"
                      ? isLoading
                        ? "Loading..."
                        : isVideoPlaying && activeVideoTask === task.id
                          ? "Meditation in Progress..."
                          : "Start Meditation"
                    : task.category.toLowerCase() === "hydration"
                      ? isLoading
                        ? "Loading..."
                        : isHydrationVideoPlaying && activeHydrationTask === task.id
                          ? "Hydration in Progress..."
                          : "Start Hydration"
                    : "Upload Video"
                    : "Locked"}
              </Button>

              {/* Hidden file input for video upload */}
              <input
                id="videoUpload"
                type="file"
                accept="video/*"
                className="hidden"
                onChange={handleVideoUpload}
                disabled={isLoading}
              />
            </div>

            {/* Status circle */}
            <div
              className={cn(
                "absolute left-1/2 top-12 w-8 h-8 rounded-full transform -translate-x-1/2 z-10",
                "flex items-center justify-center border-2",
                isCompleted
                  ? "border-green-500 bg-green-500/20"
                  : isCurrent
                    ? "border-purple-500 bg-purple-500/20 animate-pulse"
                    : "border-slate-400 bg-slate-400/20",
              )}
            >
              {isCompleted ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <Circle className={cn("h-5 w-5", isCurrent ? "text-purple-500" : "text-slate-400")} />
              )}
            </div>

            {/* Task number */}
            <div
              className={cn(
                "absolute top-12 text-xs font-bold",
                isLeft ? "left-[calc(50%-3rem)]" : "right-[calc(50%-3rem)]",
              )}
            >
              {index + 1}
            </div>

            {/* Time indicator after task */}
            {index === tasks.length - 1 && (
              <div
                className={cn(
                  "absolute bottom-0 text-sm font-medium text-muted-foreground",
                  isLeft ? "left-[calc(50%+1.5rem)]" : "right-[calc(50%+1.5rem)]",
                )}
              >
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{formatTime(task.endTime)}</span>
                </div>
              </div>
            )}
          </div>
        )
      })}

      {/* Final destination */}
      <div className="relative mt-8 mb-16">
        <div className="absolute left-1/2 transform -translate-x-1/2 -top-4 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center z-10">
          <Trophy className="h-5 w-5 text-white" />
        </div>
        <div className="text-center pt-6 pb-2 px-4 max-w-xs mx-auto rounded-lg bg-card border shadow-md">
          <h3 className="font-semibold">Final Destination</h3>
          <p className="text-sm text-muted-foreground">Complete all tasks to reach your wellness goal!</p>
        </div>
      </div>

      {/* Rewards Popup */}
      {showRewardsPopup && currentReward && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 animate-in fade-in slide-in-from-bottom-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full mx-auto flex items-center justify-center mb-4">
                <Trophy className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Congratulations!</h3>
              <p className="text-sm text-gray-600 mb-4">
                {tasks.find(t => t.id === activeVideoTask)?.category === "meditation" && "You've completed your meditation session and earned:"}
                {tasks.find(t => t.id === activeHydrationTask)?.category === "hydration" && "You've completed your hydration task and earned:"}
                {tasks.find(t => t.id === activeWalkingTask)?.category === "walk" && "You've completed your walking task and earned:"}
              </p>
              <div className="bg-amber-100 text-amber-700 px-4 py-2 rounded-full font-medium">
                {currentReward}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Failure Popup */}
      {showFailurePopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 animate-in fade-in slide-in-from-bottom-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full mx-auto flex items-center justify-center mb-4">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-red-600">Task Failed!</h3>
              <p className="text-sm text-gray-600 mb-4">
                You did not meet the minimum walking requirement.
              </p>
              <div className="bg-red-100 text-red-700 px-4 py-2 rounded-full font-medium">
                Please try again to complete the task
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

