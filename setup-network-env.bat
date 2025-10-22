@echo off
echo ========================================
echo    Setup Environment untuk Network Access
echo ========================================
echo.

REM Get current IP address
echo Mendeteksi IP address komputer...
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address"') do (
    for /f "tokens=1" %%b in ("%%a") do (
        set CURRENT_IP=%%b
        goto :found_ip
    )
)
:found_ip

echo IP Address terdeteksi: %CURRENT_IP%
echo.

REM Create .env file in frontend
echo Membuat file .env di folder frontend...
cd frontend

echo # Konfigurasi untuk akses jaringan > .env
echo # IP komputer server: %CURRENT_IP% >> .env
echo. >> .env
echo # Backend API URL - IP komputer server Anda >> .env
echo REACT_APP_API_URL=http://%CURRENT_IP%:3001/api >> .env
echo. >> .env
echo # Socket.IO URL - IP komputer server Anda >> .env
echo REACT_APP_SOCKET_URL=http://%CURRENT_IP%:3001 >> .env
echo. >> .env
echo # Google Maps API Key (opsional) >> .env
echo REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here >> .env
echo. >> .env
echo # Konfigurasi untuk development >> .env
echo DANGEROUSLY_DISABLE_HOST_CHECK=true >> .env
echo HOST=0.0.0.0 >> .env

if exist .env (
    echo ✅ File .env berhasil dibuat
    echo.
    echo Isi file .env:
    echo ========================================
    type .env
    echo ========================================
) else (
    echo ❌ Gagal membuat file .env
    pause
    exit /b 1
)

cd ..

echo.
echo ========================================
echo    Setup Selesai!
echo ========================================
echo.
echo 📋 Langkah selanjutnya:
echo    1. Jalankan: start-network-access.bat
echo    2. Atau jalankan manual:
echo       - Backend: cd backend && node index.js
echo       - Frontend: cd frontend && npm start
echo.
echo 🌐 URL untuk akses dari perangkat lain:
echo    Frontend: http://%CURRENT_IP%:3000
echo    Backend:  http://%CURRENT_IP%:3001
echo.
echo Tekan tombol apa saja untuk keluar...
pause > nul
