import cv2
import pytesseract
import glob
import os
import numpy as np

# Set the Tesseract path (Windows users)
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

def preprocess_image(image):
    # Convert to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    # Apply bilateral filter to remove noise while preserving edges
    denoised = cv2.bilateralFilter(gray, 9, 75, 75)
    
    # Apply adaptive thresholding
    thresh = cv2.adaptiveThreshold(
        denoised, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
        cv2.THRESH_BINARY, 11, 2
    )
    
    # Apply dilation to connect text components
    kernel = np.ones((1,1), np.uint8)
    dilated = cv2.dilate(thresh, kernel, iterations=1)
    
    return dilated

def extract_text(image_path):
    try:
        # Read image
        img = cv2.imread(image_path)
        
        if img is None:
            raise ValueError(f"Could not read image: {image_path}")
            
        # Get image dimensions
        height, width = img.shape[:2]
        
        # Check if image is too small
        if width < 100 or height < 100:
            raise ValueError(f"Image is too small: {width}x{height}")
            
        # Preprocess image
        processed = preprocess_image(img)
        
        # Save preprocessed image for debugging
        debug_dir = "debug_images"
        os.makedirs(debug_dir, exist_ok=True)
        debug_path = os.path.join(debug_dir, f"processed_{os.path.basename(image_path)}")
        cv2.imwrite(debug_path, processed)
        
        # OCR Configuration
        custom_config = r'--oem 3 --psm 6 -l eng --dpi 300'
        
        # Perform OCR
        text = pytesseract.image_to_string(processed, config=custom_config)
        
        # Clean up text
        text = text.strip()
        
        if not text:
            print(f"Warning: No text extracted from {image_path}")
            
        return text
        
    except Exception as e:
        print(f"Error processing {image_path}: {str(e)}")
        return ""

def main():
    # Get all image files
    image_files = sorted(glob.glob("page_*.jpg"))

    if not image_files:
        print("No image files found matching pattern 'page_*.jpg'")
        return

    # Define separator
    separator = "\n" + "=" * 50 + "\n"

    # Store extracted text from all images
    all_text = []
    
    print(f"\nFound {len(image_files)} images to process")

    for image_path in image_files:
        try:
            print(f"\nProcessing: {image_path}")
            
            # Check if file exists and is readable
            if not os.path.isfile(image_path):
                print(f"Error: File {image_path} does not exist or is not accessible")
                continue
                
            # Extract text from image
            text = extract_text(image_path)
            
            if text:
                # Append result with file name
                page_text = f"Page: {image_path}\n{text}"
                all_text.append(page_text)
                print(f"Successfully extracted text from {image_path}")
                print(f"Preview of extracted text:\n{text[:200]}...")
            else:
                print(f"Warning: No text could be extracted from {image_path}")

        except Exception as e:
            print(f"Error processing {image_path}: {str(e)}")
            continue

    if not all_text:
        print("\nWarning: No text was extracted from any images")
        return

    # Combine all text with separator
    final_output = separator.join(all_text)

    # Create output directory if it doesn't exist
    output_dir = "ocr_output"
    os.makedirs(output_dir, exist_ok=True)

    # Save output to a file
    output_file = os.path.join(output_dir, "final_output.txt")
    try:
        with open(output_file, "w", encoding="utf-8") as f:
            f.write(final_output)
        print(f"\nOutput saved to: {output_file}")
        
        # Print preview of final output
        print("\nPreview of Final Extracted Text:")
        preview_length = min(500, len(final_output))
        print(final_output[:preview_length] + "..." if len(final_output) > preview_length else final_output)
        
    except Exception as e:
        print(f"Error saving output: {str(e)}")

if __name__ == "__main__":
    main() 