# Image Processing & Graphic Formulations

A comprehensive reference for image file formats, compression strategies, upscaling, document scanning, and background removal techniques.

## 1. Image File Formulations
* **JPEG / JPG**: Lossy compression raster format. Best for photography and complex digital paintings. Does not support transparency.
* **PNG**: Lossless compression raster format. Supports alpha channel transparency. Best for logos, screenshots, and graphics with sharp text details.
* **WebP**: Modern image format developed by Google. Supports both lossy and lossless compression, alpha transparency, and animations. Yields 26% smaller files than PNG and 25-34% smaller than JPEG at comparable quality.
* **SVG**: Vector graphics format based on XML. Scales infinitely without loss of resolution. Best for icons, line art, and typography.
* **TIFF**: Lossless, high-quality, large format. Used in commercial printing and archiving.
* **BMP**: Raw, uncompressed raster format. Very large file sizes.
* **HEIC**: High-Efficiency Image File format used by Apple devices. Superior compression but restricted web browser support.
* **AVIF**: Next-generation image format. Higher compression ratio than WebP, but slower encoding times.

## 2. Background Removal Algorithms
* **GrabCut Algorithm**: An interactive foreground extraction algorithm using bounding boxes and iterative Gaussian Mixture Models to partition images into foreground/background segments.
* **Contour & Threshold Detection**:
  * Convert color images to grayscale.
  * Apply Gaussian Blur to reduce high-frequency noise.
  * Apply thresholding (Otsu or Adaptive) or Canny edge detection.
  * Find contours and generate a mask containing the largest outer boundary contour. Apply the mask to separate the object from its background.

## 3. Image Upscaling & Super-Resolution
* **Bilinear Interpolation**: A basic scaling technique that averages the nearest 2x2 grid of pixel intensities. Fast but causes blurring.
* **Bicubic Interpolation**: A scaling technique using a 4x4 pixel neighborhood. Creates smoother curves and sharper details than bilinear scaling.
* **Super-Resolution / Deep Learning**: Utilizing neural networks to predict high-frequency details (e.g., ESPCN, FSRCNN). In offline setups without massive weights, bicubic scaling combined with Unsharp Mask filtering (high-pass filtering to enhance edge contrast) provides a fast, robust fallback.

## 4. Document Scanning & Warp Processing
* **Perspective Wrap Pipeline**:
  * Apply edge detection (Canny) and dilation to extract page borders.
  * Find the largest quadrilateral contour with four corners.
  * Compute the homography transformation matrix mapping these corners to standard document aspects (A4 or Letter).
  * Apply perspective warping (`cv2.warpPerspective`) to isolate and flatten the document, then apply adaptive thresholding to output clear black-and-white text.
