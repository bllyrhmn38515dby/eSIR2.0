@echo off
echo ========================================
echo    eSIR 2.0 - NGROK Custom Domain Setup
echo ========================================
echo.

echo Starting NGROK tunnels with custom domains...
echo.

echo [1/2] Starting Frontend Tunnel (Port 3000) with custom domain...
start "NGROK Frontend" cmd /k "ngrok http 3000 --domain=esir-frontend.ngrok.io --log=stdout"

echo [2/2] Starting Backend Tunnel (Port 3001) with custom domain...
start "NGROK Backend" cmd /k "ngrok http 3001 --domain=esir-backend.ngrok.io --log=stdout"

echo.
echo ========================================
echo    NGROK Custom Tunnels Started!
echo ========================================
echo.
echo Frontend: https://esir-frontend.ngrok.io
echo Backend:  https://esir-backend.ngrok.io
echo.
echo Note: Custom domains require NGROK paid plan.
echo If you get errors, use start-ngrok-dual.bat instead.
echo.
echo Press any key to continue...
pause >nul
