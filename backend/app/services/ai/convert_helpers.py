import os
import cv2
import numpy as np
from PIL import Image

def remove_background(input_path: str, output_path: str):
    """Removes image background locally using GrabCut segmentation and contour masking."""
    img = cv2.imread(input_path)
    if img is None:
        raise ValueError("Failed to load image for background removal.")
        
    h, w = img.shape[:2]
    
    # Define a bounding box around the active object (leaving a 5% margin)
    margin_w = int(w * 0.05)
    margin_h = int(h * 0.05)
    rect = (margin_w, margin_h, w - 2 * margin_w, h - 2 * margin_h)
    
    # Initialize GrabCut structures
    mask = np.zeros(img.shape[:2], np.uint8)
    bgd_model = np.zeros((1, 65), np.float64)
    fgd_model = np.zeros((1, 65), np.float64)
    
    # Run GrabCut (5 iterations)
    try:
        cv2.grabCut(img, mask, rect, bgd_model, fgd_model, 5, cv2.GC_INIT_WITH_RECT)
        # Create a mask where foreground (1) and probable foreground (3) are 1, rest are 0
        bin_mask = np.where((mask == 2) | (mask == 0), 0, 1).astype('uint8')
    except Exception:
        # Fallback to adaptive threshold contour masking if GrabCut errors
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        _, thresh = cv2.threshold(gray, 240, 255, cv2.THRESH_BINARY_INV)
        bin_mask = thresh
        
    # Apply Gaussian Blur to smooth the edges of the mask
    bin_mask = cv2.GaussianBlur(bin_mask, (5, 5), 0)
    
    # Create RGBA channels
    b, g, r = cv2.split(img)
    rgba = [b, g, r, bin_mask * 255]
    result = cv2.merge(rgba, 4)
    
    # Save as transparent PNG
    cv2.imwrite(output_path, result)

def upscale_image(input_path: str, output_path: str, scale_factor: int = 2):
    """Upscales image details locally using bicubic interpolation and unsharp mask enhancement."""
    img = cv2.imread(input_path)
    if img is None:
        raise ValueError("Failed to load image for upscaling.")
        
    h, w = img.shape[:2]
    new_h, new_w = h * scale_factor, w * scale_factor
    
    # 1. Bicubic Resizing
    resized = cv2.resize(img, (new_w, new_h), interpolation=cv2.INTER_CUBIC)
    
    # 2. Unsharp Masking (enhances fine edges)
    gaussian = cv2.GaussianBlur(resized, (0, 0), 3)
    sharpened = cv2.addWeighted(resized, 1.6, gaussian, -0.6, 0)
    
    cv2.imwrite(output_path, sharpened)

def scan_document(input_path: str, output_path: str):
    """Detects sheet borders, performs perspective warp, and enhances black-and-white print contrast."""
    img = cv2.imread(input_path)
    if img is None:
        raise ValueError("Failed to load image for scanner processing.")
        
    orig = img.copy()
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    
    # Edge detection
    edged = cv2.Canny(blurred, 75, 200)
    
    # Find contours
    contours, _ = cv2.findContours(edged.copy(), cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)
    contours = sorted(contours, key=cv2.contourArea, reverse=True)[:5]
    
    doc_contour = None
    for c in contours:
        peri = cv2.arcLength(c, True)
        approx = cv2.approxPolyDP(c, 0.02 * peri, True)
        
        # Quadrilateral sheet borders detected
        if len(approx) == 4:
            doc_contour = approx
            break
            
    if doc_contour is not None:
        # Perspective transform warp
        pts = doc_contour.reshape(4, 2)
        rect = np.zeros((4, 2), dtype="float32")
        
        s = pts.sum(axis=1)
        rect[0] = pts[np.argmin(s)] # top-left
        rect[2] = pts[np.argmax(s)] # bottom-right
        
        diff = np.diff(pts, axis=1)
        rect[1] = pts[np.argmin(diff)] # top-right
        rect[3] = pts[np.argmax(diff)] # bottom-left
        
        (tl, tr, br, bl) = rect
        
        # Compute dimensions of new warped image
        widthA = np.sqrt(((br[0] - bl[0]) ** 2) + ((br[1] - bl[1]) ** 2))
        widthB = np.sqrt(((tr[0] - tl[0]) ** 2) + ((tr[1] - tl[1]) ** 2))
        maxWidth = max(int(widthA), int(widthB))
        
        heightA = np.sqrt(((tr[0] - br[0]) ** 2) + ((tr[1] - br[1]) ** 2))
        heightB = np.sqrt(((tl[0] - bl[0]) ** 2) + ((tl[1] - bl[1]) ** 2))
        maxHeight = max(int(heightA), int(heightB))
        
        dst = np.array([
            [0, 0],
            [maxWidth - 1, 0],
            [maxWidth - 1, maxHeight - 1],
            [0, maxHeight - 1]
        ], dtype="float32")
        
        M = cv2.getPerspectiveTransform(rect, dst)
        warped = cv2.warpPerspective(orig, M, (maxWidth, maxHeight))
        final_gray = cv2.cvtColor(warped, cv2.COLOR_BGR2GRAY)
    else:
        # Fallback to full page grayscale adaptive thresholding if no clear sheet borders
        final_gray = gray
        
    # Apply adaptive thresholding to get clean paper copy print appearance
    scanned = cv2.adaptiveThreshold(final_gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 15, 12)
    
    # Save scanned image
    cv2.imwrite(output_path, scanned)

def generate_qr_code(data: str, output_path: str):
    """Generates standard QR code block inline locally."""
    import qrcode
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(data)
    qr.make(fit=True)
    
    img = qr.make_image(fill_color="black", back_color="white")
    img.save(output_path)

def generate_barcode(data: str, output_path: str):
    """Generates standard Code 128 barcode locally."""
    import barcode
    from barcode.writer import ImageWriter
    
    # Standardize data to alphanumeric for Code 128
    code_cls = barcode.get_barcode_class('code128')
    # Generate barcode png
    writer = ImageWriter()
    bar = code_cls(data, writer=writer)
    # Save without file extension auto-appended, python-barcode appends .png automatically
    # Save barcode
    temp_out = output_path
    if temp_out.endswith('.png'):
        temp_out = temp_out[:-4]
    bar.save(temp_out)
