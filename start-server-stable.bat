@echo off
echo ========================================
echo    eSIR 2.0 Backend Server Starter
echo ========================================
echo.

REM Set environment variables
set PORT=3001
set NODE_ENV=development

echo Starting eSIR 2.0 Backend Server...
echo.
echo Server Configuration:
echo - Port: %PORT%
echo - Environment: %NODE_ENV%
echo - Database: prodsysesirv02
echo.

echo Server will be accessible at:
echo - Local: http://localhost:%PORT%
echo - Network: http://192.168.1.7:%PORT%
echo.
echo Features Available:
echo - Real-time tracking with Socket.IO
echo - Enhanced routing precision
echo - Google Maps-like route generation
echo - Multi-segment road simulation
echo.

echo Starting server...
echo Press Ctrl+C to stop the server
echo.

cd /d "%~dp0"
node index.js

echo.
echo Server stopped.
pause
