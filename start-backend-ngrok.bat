@echo off
echo Starting Backend and Ngrok...

echo Starting Backend Server...
start "Backend" cmd /c "cd backend && node index.js"

echo Waiting 5 seconds...
timeout /t 5 /nobreak >nul

echo Starting Ngrok Tunnel...
start "Ngrok" cmd /c "ngrok http 3000"

echo.
echo Backend and Ngrok started!
echo Check the opened windows.
echo.
pause
