import modal
import os
from pathlib import Path
import logging
import sys

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Define the Modal stub with more explicit permissions
stub = modal.Stub(
    name="ocr-processor",
    image=modal.Image.debian_slim().apt_install([
        "poppler-utils",
        "tesseract-ocr",
        "tesseract-ocr-eng",
        "libtesseract-dev",
        "ffmpeg",
        "libsm6",
        "libxext6",
    ]).pip_install([
        "pdf2image==1.16.3",
        "pytesseract==0.3.10",
        "opencv-python==4.8.0.74",
        "Pillow>=9.0.0"
    ]).run_commands(
        # Ensure proper permissions in the container
        "mkdir -p /tmp/pdf_processing && chmod 777 /tmp/pdf_processing",
        "chmod -R 777 /usr/share/tesseract-ocr",
        "chmod -R 777 /usr/bin/tesseract"
    )
)

def check_dependencies():
    """Check if Modal is installed locally"""
    try:
        import modal
        logger.info("Modal package is installed locally.")
        return True
    except ImportError as e:
        logger.error("Modal package is not installed. Please run: pip install modal-client")
        return False

@stub.function(image=stub.image, secret=modal.Secret.from_name("my-secret") if modal.Secret.from_name("my-secret") else None)
def process_pdf(pdf_content: bytes) -> str:
    import cv2
    import pytesseract
    from pdf2image import convert_from_path
    import tempfile
    from PIL import Image
    Image.MAX_IMAGE_PIXELS = None  # Disable image size check
    
    try:
        # Create a temporary directory for processing
        with tempfile.TemporaryDirectory(dir="/tmp/pdf_processing") as temp_dir:
            logger.info(f"Created temporary directory: {temp_dir}")
            os.chmod(temp_dir, 0o777)  # Ensure write permissions
            
            # Save the uploaded PDF
            pdf_path = os.path.join(temp_dir, "input.pdf")
            with open(pdf_path, "wb") as f:
                f.write(pdf_content)
            os.chmod(pdf_path, 0o666)  # Ensure read permissions
            logger.info(f"Saved PDF to: {pdf_path}")
            
            # Convert PDF to images
            logger.info("Converting PDF to images...")
            try:
                images = convert_from_path(
                    pdf_path,
                    dpi=300,
                    fmt='jpeg',
                    thread_count=1,  # Reduce thread count to avoid permission issues
                    grayscale=True,
                    output_folder=temp_dir,  # Specify output folder
                    paths_only=False
                )
            except Exception as e:
                logger.error(f"Error converting PDF: {str(e)}")
                raise
                
            logger.info(f"Successfully converted {len(images)} pages")
            
            # Process each page
            all_text = []
            separator = "\n" + "=" * 50 + "\n"
            
            for i, image in enumerate(images):
                try:
                    logger.info(f"Processing page {i+1}")
                    # Save the image temporarily
                    image_path = os.path.join(temp_dir, f'page_{i}.jpg')
                    image.save(image_path, 'JPEG', quality=95)
                    os.chmod(image_path, 0o666)  # Ensure read permissions
                    
                    # Process with OCR
                    img = cv2.imread(image_path)
                    if img is not None:
                        # Convert to grayscale if not already
                        if len(img.shape) == 3:
                            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
                        else:
                            gray = img
                            
                        # Apply preprocessing for better OCR
                        gray = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]
                        gray = cv2.medianBlur(gray, 3)
                        
                        # Explicitly set tesseract configuration
                        pytesseract.pytesseract.tesseract_cmd = '/usr/bin/tesseract'
                        custom_config = r'--oem 3 --psm 1 -l eng'
                        
                        # Save preprocessed image for OCR
                        cv2.imwrite(os.path.join(temp_dir, f'processed_{i}.jpg'), gray)
                        
                        # Perform OCR
                        text = pytesseract.image_to_string(
                            gray,
                            config=custom_config,
                            lang='eng'
                        )
                        all_text.append(f"Page {i+1}\n{text.strip()}")
                        logger.info(f"Successfully processed page {i+1}")
                    else:
                        logger.error(f"Failed to read image for page {i+1}")
                except Exception as e:
                    logger.error(f"Error processing page {i+1}: {str(e)}")
                    all_text.append(f"Page {i+1}\nError: Failed to process page")
            
            return separator.join(all_text)
    except Exception as e:
        logger.error(f"Fatal error in process_pdf: {str(e)}")
        raise

@stub.local_entrypoint()
def main():
    try:
        # Check dependencies first
        if not check_dependencies():
            sys.exit(1)
            
        # Get the current directory
        current_dir = Path(__file__).parent.resolve()
        logger.info(f"Working directory: {current_dir}")
        
        # Read the PDF file
        pdf_path = current_dir / "print.pdf"
        if not pdf_path.exists():
            logger.error(f"Error: PDF file not found at {pdf_path}")
            logger.error("Please make sure 'print.pdf' exists in the same directory as this script.")
            sys.exit(1)
        
        logger.info(f"Reading PDF from: {pdf_path}")
        with open(pdf_path, "rb") as f:
            pdf_content = f.read()
        
        if len(pdf_content) == 0:
            logger.error("Error: PDF file is empty")
            sys.exit(1)
            
        # Process the PDF and get the text
        logger.info("Sending PDF for processing...")
        try:
            result = process_pdf.remote(pdf_content)
        except modal.exception.Error as e:
            logger.error(f"Modal error: {str(e)}")
            logger.error("Please make sure you're authenticated with Modal (run 'modal token new')")
            sys.exit(1)
        
        # Save the output
        output_path = current_dir / "final_output.txt"
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(result)
        
        logger.info(f"✅ OCR Completed! Extracted text saved in: {output_path}")
        
    except Exception as e:
        logger.error(f"Error in main: {str(e)}")
        raise

if __name__ == "__main__":
    try:
        modal.run(stub)
    except modal.exception.AuthError:
        logger.error("Modal authentication error. Please run 'modal token new' to authenticate.")
        sys.exit(1)
    except Exception as e:
        logger.error(f"Error running Modal: {str(e)}")
        sys.exit(1) 