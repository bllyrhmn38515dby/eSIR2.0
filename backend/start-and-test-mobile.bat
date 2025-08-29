@echo off
echo 🚀 Starting Backend Server and Testing Mobile App...
echo.

echo 📡 Starting Backend Server...
start "Backend Server" cmd /k "npm start"

echo ⏳ Waiting for server to start...
timeout /t 10 /nobreak > nul

echo 🧪 Testing Mobile App...
cd eSIRMobile
node test-mobile-app.js

echo.
echo ✅ Test completed!
pause
