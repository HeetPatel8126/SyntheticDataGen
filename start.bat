@echo off
title Synthetic Data Generation Platform
color 0B

echo ============================================================
echo    Synthetic Data Generation Platform - Startup Script
echo ============================================================
echo.

:: Get the directory where this batch file lives
set "PROJECT_DIR=%~dp0"
cd /d "%PROJECT_DIR%"

:: ---------------------------------------------------------------
:: 1. Check prerequisites
:: ---------------------------------------------------------------
echo [1/7] Checking prerequisites...

where python >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ERROR: Python is not installed or not in PATH.
    pause
    exit /b 1
)

where node >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH.
    pause
    exit /b 1
)

echo       Python found.
echo       Node.js found.
echo.

:: ---------------------------------------------------------------
:: 2. Activate virtual environment (create if missing)
:: ---------------------------------------------------------------
echo [2/7] Setting up Python virtual environment...

if not exist "venv\Scripts\activate.bat" (
    echo       Creating virtual environment...
    python -m venv venv
)
call venv\Scripts\activate.bat
echo       Virtual environment activated.
echo.

:: ---------------------------------------------------------------
:: 3. Install Python dependencies
:: ---------------------------------------------------------------
echo [3/7] Installing Python dependencies...
pip install -r requirements.txt --quiet >nul 2>&1
echo       Dependencies installed.
echo.

:: ---------------------------------------------------------------
:: 4. Install frontend dependencies
:: ---------------------------------------------------------------
echo [4/7] Installing frontend dependencies...
cd frontend
if not exist "node_modules" (
    call npm install --silent >nul 2>&1
    echo       Frontend dependencies installed.
) else (
    echo       Frontend dependencies already installed.
)
cd ..
echo.

:: ---------------------------------------------------------------
:: 5. Override .env for local development (localhost instead of
::    Docker service names). We write a temporary .env.local that
::    the app picks up automatically via pydantic-settings.
:: ---------------------------------------------------------------
echo [5/7] Preparing local environment configuration...

:: Back up current .env and write local overrides
copy /y .env .env.docker.bak >nul 2>&1

:: Create a local-friendly .env (replace Docker hostnames)
powershell -NoProfile -Command ^
  "(Get-Content '.env') -replace '@postgres:', '@localhost:' -replace '@redis:', '@localhost:' -replace 'redis://:changeme@redis:', 'redis://:changeme@localhost:' | Set-Content '.env.local.tmp'"

:: Only overwrite if the replacement worked
if exist ".env.local.tmp" (
    copy /y .env.local.tmp .env >nul 2>&1
    del .env.local.tmp >nul 2>&1
)

echo       Environment configured for local development.
echo.

:: ---------------------------------------------------------------
:: 6. Run database migrations
:: ---------------------------------------------------------------
echo [6/7] Running database migrations...
python -m alembic upgrade head >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo       WARNING: Migrations failed. Make sure PostgreSQL is running
    echo       on localhost:5432 with the credentials in your .env file.
    echo       You can start PostgreSQL manually or via Docker:
    echo         docker run -d --name pg -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres:16-alpine
) else (
    echo       Migrations applied successfully.
)
echo.

:: ---------------------------------------------------------------
:: 7. Start all services
:: ---------------------------------------------------------------
echo [7/7] Starting services...
echo.
echo    Starting Celery Worker...
start "Celery Worker" cmd /k "cd /d "%PROJECT_DIR%" && call venv\Scripts\activate.bat && celery -A app.workers.celery_app worker --loglevel=info --pool=solo"

timeout /t 2 /nobreak >nul

echo    Starting Celery Beat...
start "Celery Beat" cmd /k "cd /d "%PROJECT_DIR%" && call venv\Scripts\activate.bat && celery -A app.workers.celery_app beat --loglevel=info"

timeout /t 2 /nobreak >nul

echo    Starting Backend API (port 8000)...
start "Backend API" cmd /k "cd /d "%PROJECT_DIR%" && call venv\Scripts\activate.bat && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

timeout /t 3 /nobreak >nul

echo    Starting Frontend (port 3000)...
start "Frontend" cmd /k "cd /d "%PROJECT_DIR%frontend" && npm run dev"

:: ---------------------------------------------------------------
:: Done
:: ---------------------------------------------------------------
echo.
echo ============================================================
echo    All services are starting!
echo ============================================================
echo.
echo    Frontend:       http://localhost:3000
echo    Backend API:    http://localhost:8000
echo    API Docs:       http://localhost:8000/docs
echo.
echo    Each service runs in its own window.
echo    Close this window or press any key to stop all services.
echo ============================================================
echo.
pause

:: ---------------------------------------------------------------
:: Cleanup: kill the spawned windows and restore Docker .env
:: ---------------------------------------------------------------
echo.
echo Stopping all services...

taskkill /FI "WINDOWTITLE eq Celery Worker*" /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq Celery Beat*" /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq Backend API*" /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq Frontend*" /F >nul 2>&1

:: Restore original .env (Docker hostnames)
if exist ".env.docker.bak" (
    copy /y .env.docker.bak .env >nul 2>&1
    del .env.docker.bak >nul 2>&1
)

echo All services stopped.
echo.
pause
