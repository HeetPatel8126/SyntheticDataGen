#!/bin/bash

# Synthetic Data Platform - Installation Script

echo "🚀 Setting up Synthetic Data Generation Platform..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8+ first."
    exit 1
fi

echo "✅ Python $(python3 --version) detected"
echo ""

# Setup Backend
echo "📦 Setting up Backend..."
pip3 install -r requirements.txt

echo ""
echo "🗄️ Setting up Database..."
alembic upgrade head

echo ""
echo "✅ Backend setup complete!"
echo ""

# Setup Frontend
echo "📦 Setting up Frontend..."
cd frontend

if [ ! -f ".env.local" ]; then
    echo "📝 Creating .env.local file..."
    cp .env.local.example .env.local
    echo "✅ .env.local created. Please review and update if needed."
fi

echo "📦 Installing frontend dependencies..."
npm install

echo ""
echo "✅ Frontend setup complete!"
echo ""

# Instructions
echo "🎉 Setup Complete!"
echo ""
echo "To start the application:"
echo ""
echo "1. Start the Backend (in project root):"
echo "   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"
echo ""
echo "2. Start the Frontend (in frontend directory):"
echo "   cd frontend && npm run dev"
echo ""
echo "3. Visit:"
echo "   - Frontend: http://localhost:3000"
echo "   - Backend API: http://localhost:8000"
echo "   - API Docs: http://localhost:8000/docs"
echo ""
echo "Happy data generating! 🚀"
