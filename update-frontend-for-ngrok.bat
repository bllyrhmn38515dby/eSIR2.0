@echo off
echo ========================================
echo    Update Frontend for NGROK Backend
echo ========================================
echo.

echo This script will update frontend config to use NGROK backend URL
echo.
echo Please enter the NGROK backend URL (e.g., https://abc123.ngrok.io):
set /p NGROK_BACKEND_URL=

if "%NGROK_BACKEND_URL%"=="" (
    echo Error: NGROK backend URL is required!
    pause
    exit /b 1
)

echo.
echo Updating frontend configuration...
echo Backend URL: %NGROK_BACKEND_URL%

REM Update config.production.env
powershell -Command "(Get-Content 'frontend\config.production.env') -replace 'REACT_APP_API_URL=.*', 'REACT_APP_API_URL=%NGROK_BACKEND_URL%' | Set-Content 'frontend\config.production.env'"
powershell -Command "(Get-Content 'frontend\config.production.env') -replace 'REACT_APP_SOCKET_URL=.*', 'REACT_APP_SOCKET_URL=%NGROK_BACKEND_URL%' | Set-Content 'frontend\config.production.env'"

echo.
echo ========================================
echo    Frontend Configuration Updated!
echo ========================================
echo.
echo Frontend will now connect to: %NGROK_BACKEND_URL%
echo.
echo Next steps:
echo 1. Restart your frontend (npm start)
echo 2. Access frontend via NGROK URL
echo.
echo Press any key to continue...
pause >nul
