# Checklist: Universal Offline Platform with Local AI & RAG

- [x] Refactor Python backend folder structure (`backend/app/`)
  - [x] Relocate routers and core settings to `/app` structure
  - [x] Implement robust local conversions (e.g., Image-to-PDF via Pillow)
  - [x] Add system execution safety checks (validate if FFmpeg / LibreOffice binaries are installed)
- [x] Develop Local AI & RAG Pipeline
  - [x] Create Ollama connector router (`ollama_service.py` & `ai_router.py`)
  - [x] Implement text chunker and local cosine vector matcher (`rag_service.py`)
  - [x] Update frontend settings page (remove API Keys, add local model list)
- [x] Refactor frontend converters
  - [x] Add global search input bar inside Sidebar header
  - [x] Reconnect Color HEX/RGB converter state to update output on keystrokes
  - [x] Resolve file format validation exceptions on previews
