import cv2
import pytesseract
import os
import sys

def process_image(image_path):
    try:
        # Set Tesseract path
        pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
        
        print(f"Processing: {image_path}")
        # Read image using cv2
        img = cv2.imread(image_path)
        
        if img is None:
            print(f"Error: Could not read {image_path}")
            return ""
        
        # Convert to grayscale
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        # Apply adaptive thresholding
        thresh = cv2.adaptiveThreshold(
            gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
            cv2.THRESH_BINARY, 11, 2
        )
        
        # Noise removal using median blur
        processed = cv2.medianBlur(thresh, 3)
        
        # OCR Configuration
        custom_config = r'--oem 3 --psm 6'
        
        # Perform OCR
        text = pytesseract.image_to_string(processed, config=custom_config)
        
        return text.strip()
    
    except Exception as e:
        print(f"Error processing {image_path}: {str(e)}")
        return ""

if __name__ == "__main__":
    if len(sys.argv) > 1:
        image_path = sys.argv[1]
        if os.path.exists(image_path):
            text = process_image(image_path)
            print(f"\nExtracted Text from {image_path}:\n")
            print(text)
            
            # Save output
            output_file = f"output_{os.path.basename(image_path)}.txt"
            with open(output_file, "w", encoding="utf-8") as f:
                f.write(text)
        else:
            print(f"Error: File {image_path} does not exist") 