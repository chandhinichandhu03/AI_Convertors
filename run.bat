@echo off
echo =========================================================
echo    OmniConvert AI - Universal Launcher (Windows)        
echo =========================================================

echo Launching FastAPI Backend...
start cmd /k "cd backend && python -m venv venv && call venv\Scripts\activate && pip install -r requirements.txt && python -m uvicorn app.main:app --port 5001 --reload"

echo Launching Vite React Client...
start cmd /k "cd frontend && npm install && npm run dev"
