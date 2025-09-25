@echo off
echo Starting eSIR 2.0 Backend Server...
echo.

REM Set environment variables
set PORT=3001
set NODE_ENV=development

REM Start the server
echo Starting server on port 3001...
echo Server will be accessible at:
echo - Local: http://localhost:3001
echo - Network: http://192.168.1.7:3001
echo.
echo Press Ctrl+C to stop the server
echo.

node index.js

pause
