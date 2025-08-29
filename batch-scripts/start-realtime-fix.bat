@echo off
echo 🚀 Starting eSIR 2.0 with Realtime Fix...
echo.

echo 📡 Starting Backend Server...
start "Backend Server" cmd /k "cd backend && npm start"

echo ⏳ Waiting for backend to start...
timeout /t 5 /nobreak > nul

echo 🌐 Starting Frontend...
start "Frontend" cmd /k "cd frontend && npm start"

echo.
echo ✅ Both servers started!
echo 📡 Backend: http://localhost:3001
echo 🌐 Frontend: http://localhost:3000
echo.
echo 🔌 Realtime Socket.IO should now work properly!
echo.
echo 📋 Instructions:
echo 1. Wait for both servers to fully load
echo 2. Open http://localhost:3000 in your browser
echo 3. Login as super admin
echo 4. Check that realtime status shows "Realtime Aktif"
echo.
pause
