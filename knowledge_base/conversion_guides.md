# File Conversion Command Reference & Guides

This guide covers terminal command instructions and settings for media, office, and document transformations.

## 1. LibreOffice Headless (Office to PDF/Markdown/HTML)
LibreOffice can convert word processing documents, spreadsheets, and presentation files headlessly:
* **Docx to PDF**:
  `soffice --headless --convert-to pdf input.docx --outdir output/`
* **Xlsx to PDF**:
  `soffice --headless --convert-to pdf input.xlsx --outdir output/`
* **Docx to HTML**:
  `soffice --headless --convert-to html input.docx --outdir output/`

## 2. FFmpeg Command Presets (Video & Audio)
FFmpeg processes multimedia containers, codecs, bitrates, and scaling operations:
* **Audio Format Transcoding (WAV ↔ MP3)**:
  `ffmpeg -y -i input.wav -b:a 192k output.mp3`
* **Audio Trimming**:
  `ffmpeg -y -i input.mp3 -ss 00:00:10 -to 00:00:40 -c copy output.mp3`
* **Video Format Transcoding (MKV → MP4)**:
  `ffmpeg -y -i input.mkv -c:v libx264 -preset fast -crf 22 -c:a aac output.mp4`
* **Video Compression (Scale Resolution & Lower Bitrate)**:
  `ffmpeg -y -i input.mp4 -vf scale=1280:720 -b:v 1M -maxrate 1.5M -bufsize 2M output.mp4`
* **GIF Conversion from Video**:
  `ffmpeg -y -i input.mp4 -vf "fps=10,scale=480:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" output.gif`

## 3. Tesseract OCR (Image to Text)
Tesseract extracts textual characters from static image rasters:
* **Extract to Text File**:
  `tesseract input.png output_text -l eng`
* **Extract with HOCR (HTML annotated coordinates)**:
  `tesseract input.png output_text hocr`

## 4. Markdown & CSV conversions
* **CSV to Markdown Table**: Read lines, split by comma, sanitize cells, format column headers, and generate standard Markdown table cells:
  `| Header 1 | Header 2 |`
  `| --- | --- |`
  `| Cell 1 | Cell 2 |`
