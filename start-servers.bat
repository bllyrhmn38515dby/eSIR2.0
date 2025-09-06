@echo off
echo Starting eSIR 2.0 Servers...

echo.
echo Starting Backend Server...
cd backend
start "Backend Server" cmd /k "node index.js"

echo.
echo Waiting 5 seconds...
timeout /t 5 /nobreak > nul

echo.
echo Starting Frontend Server...
cd ..\frontend
start "Frontend Server" cmd /k "set DANGEROUSLY_DISABLE_HOST_CHECK=true && set HOST=0.0.0.0 && npm start"

echo.
echo Servers are starting...
echo Backend: http://192.168.18.6:3001
echo Frontend: http://192.168.18.6:3000
echo.
echo Press any key to exit...
pause > nul
