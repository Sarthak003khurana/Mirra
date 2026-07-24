@echo off
REM Mirra - one-command full stack launcher.
REM Run this once after the one-time setup (venvs + npm install) is done.
REM Opens each service in its own window and takes you straight to the
REM frontend app (not the marketing landing page).

setlocal

set ROOT=%~dp0

if not exist "%ROOT%backend\.venv\Scripts\activate.bat" (
    echo [Mirra] backend\.venv not found - run the one-time setup first:
    echo   cd backend ^&^& python -m venv .venv ^&^& .venv\Scripts\activate ^&^& pip install -r requirements.txt
    pause
    exit /b 1
)

echo [Mirra] Starting backend on http://localhost:8000 ...
start "Mirra Backend" cmd /k "cd /d "%ROOT%backend" && call .venv\Scripts\activate.bat && uvicorn app.main:app --reload --port 8000"

echo [Mirra] Starting frontend on http://localhost:5173 ...
start "Mirra Frontend" cmd /k "cd /d "%ROOT%frontend" && npm run dev"

echo [Mirra] Starting marketing site on http://localhost:5174 ...
start "Mirra Marketing" cmd /k "cd /d "%ROOT%marketing" && npm run dev"

REM The 3D avatar is a component inside frontend/ (not a separate app), so
REM it comes up automatically with the frontend dev server above.

REM voice-bot is NOT auto-started here - it needs a specific session id
REM copied from the frontend URL and a mic, so it's a manual step. See
REM voice-bot/README.md "Run against the backend" for that flow.

echo [Mirra] Waiting for the frontend dev server to come up...
timeout /t 6 /nobreak >nul

start "" http://localhost:5173

echo [Mirra] All services launched. Closing this window is safe -
echo         each service keeps running in its own window.
endlocal
