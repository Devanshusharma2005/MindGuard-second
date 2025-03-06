from pdf2image import convert_from_path
import os
import subprocess

def main():
    # Set up paths
    poppler_path = r'D:\mindgurd\MindGuard\MindGuard\Ocr modal\poppler\Library\bin'
    pdf_path = r'D:\mindgurd\MindGuard\MindGuard\Ocr modal\print.pdf'

    try:
        # Convert PDF to images
        print("Converting PDF to images...")
        images = convert_from_path(pdf_path, poppler_path=poppler_path)
        print(f"Successfully converted {len(images)} pages")

        # Save images
        for i, image in enumerate(images):
            image_path = f'page_{i}.jpg'
            image.save(image_path, 'JPEG')
            print(f"Saved {image_path}")

        # Run the improved OCR script
        print("\nRunning OCR processing...")
        subprocess.run(['python', 'improved_ocr.py'], check=True)
        
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    main()
