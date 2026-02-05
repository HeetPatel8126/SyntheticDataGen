#!/bin/bash

# Synthetic Data Platform - Quick Start Script

echo "🚀 Starting Synthetic Data Generation Platform..."
echo ""

# Start Backend
echo "🔧 Starting Backend API on port 8000..."
cd "$(dirname "$0")"
gnome-terminal -- bash -c "uvicorn app.main:app --reload --host 0.0.0.0 --port 8000; exec bash" 2>/dev/null || \
xterm -e "uvicorn app.main:app --reload --host 0.0.0.0 --port 8000" 2>/dev/null || \
osascript -e 'tell app "Terminal" to do script "cd '"$(pwd)"' && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"' 2>/dev/null || \
(uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &)

sleep 3

# Start Frontend
echo "🎨 Starting Frontend on port 3000..."
gnome-terminal -- bash -c "cd frontend && npm run dev; exec bash" 2>/dev/null || \
xterm -e "cd frontend && npm run dev" 2>/dev/null || \
osascript -e 'tell app "Terminal" to do script "cd '"$(pwd)/frontend"' && npm run dev"' 2>/dev/null || \
(cd frontend && npm run dev &)

echo ""
echo "✅ Both services are starting..."
echo ""
echo "📱 Access the application:"
echo "   - Frontend:  http://localhost:3000"
echo "   - Backend:   http://localhost:8000"
echo "   - API Docs:  http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop"
echo ""

# Wait
wait
