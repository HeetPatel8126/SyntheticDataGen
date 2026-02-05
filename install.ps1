# Synthetic Data Platform - Windows Installation Script

Write-Host "🚀 Setting up Synthetic Data Generation Platform..." -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
$nodeVersion = node --version 2>$null
if (-not $nodeVersion) {
    Write-Host "❌ Node.js is not installed. Please install Node.js 18+ first." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Node.js $nodeVersion detected" -ForegroundColor Green

# Check if Python is installed
$pythonVersion = python --version 2>$null
if (-not $pythonVersion) {
    Write-Host "❌ Python is not installed. Please install Python 3.8+ first." -ForegroundColor Red
    exit 1
}

Write-Host "✅ $pythonVersion detected" -ForegroundColor Green
Write-Host ""

# Setup Backend
Write-Host "📦 Setting up Backend..." -ForegroundColor Yellow
pip install -r requirements.txt

Write-Host ""
Write-Host "🗄️ Setting up Database..." -ForegroundColor Yellow
alembic upgrade head

Write-Host ""
Write-Host "✅ Backend setup complete!" -ForegroundColor Green
Write-Host ""

# Setup Frontend
Write-Host "📦 Setting up Frontend..." -ForegroundColor Yellow
Set-Location frontend

if (-not (Test-Path ".env.local")) {
    Write-Host "📝 Creating .env.local file..." -ForegroundColor Yellow
    Copy-Item .env.local.example .env.local
    Write-Host "✅ .env.local created. Please review and update if needed." -ForegroundColor Green
}

Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Yellow
npm install

Write-Host ""
Write-Host "✅ Frontend setup complete!" -ForegroundColor Green
Write-Host ""

# Instructions
Write-Host "🎉 Setup Complete!" -ForegroundColor Cyan
Write-Host ""
Write-Host "To start the application:" -ForegroundColor White
Write-Host ""
Write-Host "1. Start the Backend (in project root):" -ForegroundColor White
Write-Host "   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Start the Frontend (in frontend directory):" -ForegroundColor White
Write-Host "   cd frontend" -ForegroundColor Gray
Write-Host "   npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Visit:" -ForegroundColor White
Write-Host "   - Frontend: http://localhost:3000" -ForegroundColor Gray
Write-Host "   - Backend API: http://localhost:8000" -ForegroundColor Gray
Write-Host "   - API Docs: http://localhost:8000/docs" -ForegroundColor Gray
Write-Host ""
Write-Host "Happy data generating! 🚀" -ForegroundColor Cyan
