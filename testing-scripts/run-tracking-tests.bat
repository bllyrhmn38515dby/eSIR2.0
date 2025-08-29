@echo off
echo ========================================
echo    eSIR2.0 TRACKING SYSTEM TESTS
echo ========================================
echo.

echo [1/3] Installing dependencies...
cd testing-scripts
npm install axios socket.io-client mysql2 dotenv
echo.

echo [2/3] Running debug and fix...
node debug-tracking-system.js
echo.

echo [3/3] Running comprehensive tests...
node test-tracking-system.js
echo.

echo ========================================
echo    TESTING COMPLETED
echo ========================================
pause
