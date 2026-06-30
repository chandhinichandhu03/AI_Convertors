#!/bin/bash
# Clean up background servers on exit
trap "kill 0" EXIT

echo "========================================================="
echo "   OmniConvert AI - Universal Launcher (macOS/Linux)     "
echo "========================================================="

# 1. Start Python Backend
echo "Starting Backend API Engine on port 5001..."
cd backend
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi
source venv/bin/activate
pip install -r requirements.txt
python3 -m uvicorn app.main:app --port 5001 --reload &

# 2. Start Frontend Dev Client
echo "Starting Vite Frontend Client on port 3000..."
cd ../frontend
npm install
npm run dev &

# Wait for both background jobs
wait
