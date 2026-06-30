# OmniConvert AI — Universal Conversion Platform

OmniConvert AI is an enterprise-grade conversion platform capable of processing 500+ document formats, raster/vector images, video compression, audio trimming, and optional local AI NLLB translation/OCR tasks completely offline.

---

## Launcher Commands

To launch both the FastAPI backend and Vite React client concurrently, execute the single command corresponding to your operating system below.

### 🍎 macOS / Linux
```bash
chmod +x run.sh && ./run.sh
```

### 🪟 Windows (Command Prompt)
```cmd
run.bat
```

---

## Workspace Architecture

* **`frontend/`**: Vite + React.js + Zustand + React Router + TailwindCSS.
* **`backend/`**: FastAPI + SQLAlchemy + SQLite database model seeding.
* **`database.db`**: Local SQLite database storage generated on start.
