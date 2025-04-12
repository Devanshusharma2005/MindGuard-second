import pytesseract
from pdf2image import convert_from_path
from PIL import Image, ImageFilter, ImageOps
import os

# Set this if Tesseract is not in PATH (uncomment and edit if needed)
# pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# Update this with your actual Poppler path
POPPLER_PATH = r"C:\poppler-24.08.0\Library\bin"  # <-- Replace with your Poppler bin path

def preprocess_image(image: Image.Image) -> Image.Image:
    image = image.convert("L")
    image = ImageOps.autocontrast(image)
    image = image.filter(ImageFilter.MedianFilter())
    return image

def ocr_pdf_to_text(pdf_path, output_txt_path):
    if not os.path.exists(pdf_path):
        print(f"File not found: {pdf_path}")
        return

    try:
        images = convert_from_path(pdf_path, poppler_path=POPPLER_PATH)
    except Exception as e:
        print(f"Failed to convert PDF: {e}")
        return

    full_text = ""

    for i, image in enumerate(images):
        preprocessed = preprocess_image(image)
        text = pytesseract.image_to_string(preprocessed)
        full_text += f"\n--- Page {i + 1} ---\n{text.strip()}\n"

    try:
        with open(output_txt_path, "w", encoding="utf-8") as f:
            f.write(full_text)
        print(f"Text extracted and saved to {output_txt_path}")
    except Exception as e:
        print(f"Failed to save output: {e}")

# if __name__ == "__main__":
#     pdf_path = r"C:\Users\HARSHIT BHATT\Downloads\mental_health_report.pdf"  # Replace with your PDF path
#     output_txt_path = "new.txt"
#     ocr_pdf_to_text(pdf_path, output_txt_path)