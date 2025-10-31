@echo off
echo ========================================
echo    eSIR 2.0 - NGROK Dual Tunnel Setup
echo ========================================
echo.

echo Starting NGROK tunnels for eSIR 2.0...
echo.

echo [1/2] Starting Frontend Tunnel (Port 3000)...
start "NGROK Frontend" cmd /k "ngrok http 3000 --log=stdout"

echo [2/2] Starting Backend Tunnel (Port 3001)...
start "NGROK Backend" cmd /k "ngrok http 3001 --log=stdout"

echo.
echo ========================================
echo    NGROK Tunnels Started Successfully!
echo ========================================
echo.
echo Frontend will be available at: https://[random].ngrok.io
echo Backend will be available at: https://[random].ngrok.io
echo.
echo Check the NGROK windows for the actual URLs.
echo.
echo Press any key to continue...
pause >nul
