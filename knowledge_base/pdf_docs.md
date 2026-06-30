# PDF Document Architecture & Standards

A reference for PDF file internal structures, conversion tools, document security, and archiving standards.

## 1. The PDF File Format
The Portable Document Format (PDF) represents document layout independently of application software, hardware, and operating systems.
* **Objects**: A PDF consists of catalogs, pages, outlines, annotations, fonts, and content streams (drawings, text instructions).
* **Cross-Reference Table (Xref)**: A index structure containing byte offsets to every object inside the file, enabling random access.

## 2. PDF Standards
* **PDF/A**: ISO standard for long-term archiving. Disallows external links, JS, encrypting, and audio/video objects. Requires all fonts to be embedded natively.
* **PDF/UA**: Standard for Universal Accessibility. Requires structured headings, alternative text descriptions for images, logical reading orders, and semantic tagging.

## 3. PDF Operations
* **Merging**: Combining page streams from separate input PDF documents and rebuilding the xref catalog references.
* **Splitting**: Extracting specific page indexes and generating a subset document with updated object identifiers.
* **Compression**: Compressing stream streams (FlateDecode) and resizing high-resolution raster images embedded within the document pages.
* **Encryption**: Restricting access via User Passwords (read-access) and Owner Passwords (editing/printing restrictions) utilizing AES-256 cipher streams.
* **Unlock**: Removing security permissions by verifying owner passwords and rewriting the PDF catalog header without the /Encrypt key.
