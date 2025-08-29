@echo off
echo Starting backend server...
cd backend
start "Backend Server" cmd /k "node index.js"
echo Waiting for server to start...
timeout /t 5 /nobreak > nul
echo Testing rujukan API...
cd ..
node test-rujukan-api.js
pause
