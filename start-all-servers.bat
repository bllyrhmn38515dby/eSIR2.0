@echo off
echo Starting eSIR 2.0 Servers...

echo.
echo Starting Backend Server...
start "Backend" cmd /c "cd backend && node index.js"

echo.
echo Waiting 5 seconds...
timeout /t 5 /nobreak >nul

echo.
echo Starting Ngrok Tunnel...
start "Ngrok" cmd /c "ngrok http 3000"

echo.
echo Waiting 5 seconds...
timeout /t 5 /nobreak >nul

echo.
echo Starting Frontend Server...
start "Frontend" cmd /c "cd frontend && set DANGEROUSLY_DISABLE_HOST_CHECK=true && set HOST=0.0.0.0 && npm start"

echo.
echo All servers started!
echo.
echo Backend: http://localhost:3000
echo Frontend: http://localhost:3001
echo Ngrok Dashboard: http://localhost:4040
echo.
echo Press any key to continue...
pause >nul
