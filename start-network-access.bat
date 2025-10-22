@echo off
echo ========================================
echo    eSIR 2.0 - Network Access Setup
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

REM Copy network environment file to .env
echo Mengatur konfigurasi frontend...
cd frontend
copy network.env .env >nul 2>&1
if exist .env (
    echo ✅ File .env berhasil dibuat
) else (
    echo ❌ Gagal membuat file .env
    pause
    exit /b 1
)

REM Update .env with current IP
powershell -Command "(Get-Content .env) -replace '192.168.1.11', '%CURRENT_IP%' | Set-Content .env"
echo ✅ IP address diperbarui ke: %CURRENT_IP%
cd ..

echo.
echo ========================================
echo    Memulai Server eSIR 2.0
echo ========================================
echo.

echo Memulai Backend Server...
cd backend
start "Backend Server" cmd /k "echo Backend Server - eSIR 2.0 && echo IP: %CURRENT_IP%:3001 && echo. && node index.js"

echo.
echo Menunggu 5 detik...
timeout /t 5 /nobreak > nul

echo.
echo Memulai Frontend Server...
cd ..\frontend
start "Frontend Server" cmd /k "echo Frontend Server - eSIR 2.0 && echo IP: %CURRENT_IP%:3000 && echo. && set DANGEROUSLY_DISABLE_HOST_CHECK=true && set HOST=0.0.0.0 && npm start"

echo.
echo ========================================
echo    Server Berhasil Dimulai!
echo ========================================
echo.
echo 🌐 Akses dari komputer ini:
echo    Frontend: http://localhost:3000
echo    Backend:  http://localhost:3001
echo.
echo 🌐 Akses dari perangkat lain di jaringan:
echo    Frontend: http://%CURRENT_IP%:3000
echo    Backend:  http://%CURRENT_IP%:3001
echo.
echo 📱 Untuk akses dari smartphone/tablet:
echo    1. Pastikan perangkat terhubung ke WiFi yang sama
echo    2. Buka browser dan akses: http://%CURRENT_IP%:3000
echo.
echo ⚠️  Pastikan firewall tidak memblokir port 3000 dan 3001
echo.
echo Tekan tombol apa saja untuk keluar...
pause > nul
