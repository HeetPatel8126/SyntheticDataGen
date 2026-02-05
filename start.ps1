# Synthetic Data Platform - Quick Start Script for Windows

Write-Host "Starting Synthetic Data Generation Platform..." -ForegroundColor Cyan
Write-Host ""

# Get the script directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir

# Start Backend
Write-Host "Starting Backend API on port 8000..." -ForegroundColor Yellow
$backend = Start-Process -FilePath "powershell" -ArgumentList @("-NoExit", "-Command", "Set-Location '$scriptDir'; uvicorn app.main:app --reload --host 0.0.0.0 --port 8000") -PassThru

Start-Sleep -Seconds 3

# Start Frontend
Write-Host "Starting Frontend on port 3000..." -ForegroundColor Yellow
$frontend = Start-Process -FilePath "powershell" -ArgumentList @("-NoExit", "-Command", "Set-Location '$scriptDir\frontend'; npm run dev") -PassThru

Write-Host ""
Write-Host "Both services are starting..." -ForegroundColor Green
Write-Host ""
Write-Host "Access the application:" -ForegroundColor White
Write-Host "   - Frontend:  http://localhost:3000" -ForegroundColor Cyan
Write-Host "   - Backend:   http://localhost:8000" -ForegroundColor Cyan
Write-Host "   - API Docs:  http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C in the terminal windows to stop the services" -ForegroundColor Gray
Write-Host ""

# Wait for user input
Write-Host "Press any key to stop all services..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Clean up
Write-Host ""
Write-Host "Stopping services..." -ForegroundColor Red
Stop-Process -Id $backend.Id -ErrorAction SilentlyContinue
Stop-Process -Id $frontend.Id -ErrorAction SilentlyContinue
Write-Host "Services stopped" -ForegroundColor Green
