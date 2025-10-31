@echo off
echo ========================================
echo    eSIR 2.0 - Auto Realtime System
echo ========================================
echo.

echo [1/3] Checking if ports are available...
netstat -an | findstr :3001 >nul
if %errorlevel% == 0 (
    echo Port 3001 is in use. Killing existing processes...
    taskkill /F /IM node.exe >nul 2>&1
    timeout /t 2 /nobreak >nul
)

netstat -an | findstr :3000 >nul
if %errorlevel% == 0 (
    echo Port 3000 is in use. Killing existing processes...
    taskkill /F /IM node.exe >nul 2>&1
    timeout /t 2 /nobreak >nul
)

echo [2/3] Starting Backend Server...
start "Backend Server" cmd /k "cd backend && echo Starting Backend... && node index.js"

echo Waiting for backend to start...
timeout /t 5 /nobreak >nul

echo [3/3] Starting Frontend Server...
start "Frontend Server" cmd /k "cd frontend && echo Starting Frontend... && npm start"

echo.
echo ========================================
echo    Servers are starting...
echo ========================================
echo Backend:  http://localhost:3001
echo Frontend: http://localhost:3000
echo.
echo Features enabled:
echo - Auto-reconnection with exponential backoff
echo - Health check monitoring (every 30s)
echo - Visual connection status indicator
echo - Auto-refresh on connection failure
echo - Persistent connection state
echo.
echo Press any key to stop all servers...
pause >nul

echo Stopping all servers...
taskkill /F /IM node.exe >nul 2>&1
echo All servers stopped.