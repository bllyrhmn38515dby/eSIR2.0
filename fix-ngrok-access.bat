@echo off
echo Fixing Ngrok Access for eSIR 2.0...

echo.
echo Step 1: Stopping existing processes...
taskkill /f /im node.exe 2>nul
taskkill /f /im ngrok.exe 2>nul

echo.
echo Step 2: Starting Backend Server...
cd backend
start "Backend Server" cmd /k "node index.js"

echo.
echo Step 3: Waiting for backend to start...
timeout /t 5 /nobreak >nul

echo.
echo Step 4: Starting Ngrok Tunnel...
start "Ngrok Tunnel" cmd /k "ngrok http 3000 --log=stdout"

echo.
echo Step 5: Waiting for ngrok to start...
timeout /t 5 /nobreak >nul

echo.
echo Step 6: Starting Frontend with Ngrok Configuration...
cd ..\frontend
set DANGEROUSLY_DISABLE_HOST_CHECK=true
set HOST=0.0.0.0
set REACT_APP_API_URL=https://devona-lophodont-unusually.ngrok-free.dev
set REACT_APP_SOCKET_URL=https://devona-lophodont-unusually.ngrok-free.dev

echo.
echo Environment variables set:
echo DANGEROUSLY_DISABLE_HOST_CHECK=%DANGEROUSLY_DISABLE_HOST_CHECK%
echo HOST=%HOST%
echo REACT_APP_API_URL=%REACT_APP_API_URL%

echo.
echo Starting Frontend Server...
npm start

pause
