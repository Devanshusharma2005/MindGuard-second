import os
import cv2
import pytesseract
from pdf2image import convert_from_path
import glob

# Get the absolute path of the current script
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Automatically find the Poppler and Tesseract paths
POPPLER_DIR = os.path.join(BASE_DIR, "poppler")  # Change to actual folder name if needed
TESSERACT_DIR = os.path.join(BASE_DIR, "tesseract")

# Find the Poppler binary inside the folder
POPPLER_BIN = os.path.join(POPPLER_DIR, "Library", "bin") if os.name == "nt" else POPPLER_DIR

# Find the Tesseract binary inside the folder
TESSERACT_BIN = os.path.join(TESSERACT_DIR, "tesseract.exe") if os.name == "nt" else "tesseract"

# Set environment variables for Windows users
if os.name == "nt":  # Windows
    pytesseract.pytesseract.tesseract_cmd = TESSERACT_BIN
    os.environ["PATH"] += os.pathsep + POPPLER_BIN
else:  # Linux/macOS
    os.environ["PATH"] += os.pathsep + "/usr/bin/"

# Convert PDF to images
pdf_path = os.path.join(BASE_DIR, "print.pdf")
images = convert_from_path(pdf_path, poppler_path=POPPLER_BIN if os.name == "nt" else None)

# Save images
for i, image in enumerate(images):
    image.save(os.path.join(BASE_DIR, f'page_{i}.jpg'), 'JPEG')

# Process images using OCR
separator = "\n" + "=" * 50 + "\n"
all_text = []

for image_path in sorted(glob.glob(os.path.join(BASE_DIR, "page_*.jpg"))):
    img = cv2.imread(image_path)
    if img is None:
        continue
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    text = pytesseract.image_to_string(gray)
    all_text.append(f"Page: {os.path.basename(image_path)}\n{text}")

# Save final output
output_path = os.path.join(BASE_DIR, "final_output.txt")
with open(output_path, "w", encoding="utf-8") as f:
    f.write(separator.join(all_text))

print(f"✅ OCR Completed! Extracted text saved in: {output_path}")
