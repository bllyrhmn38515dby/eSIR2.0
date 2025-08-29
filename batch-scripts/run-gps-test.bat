@echo off
echo ========================================
echo    GPS TRACKING PERFORMANCE TEST
echo ========================================
echo.

echo Memulai testing GPS tracking...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js tidak ditemukan!
    echo Silakan install Node.js terlebih dahulu.
    pause
    exit /b 1
)

REM Check if axios is installed
echo Checking dependencies...
npm list axios >nul 2>&1
if %errorlevel% neq 0 (
    echo Installing axios...
    npm install axios
)

echo.
echo Pilih jenis testing:
echo 1. Automated Test (Otomatis)
echo 2. Manual Test (Interaktif)
echo 3. Quick Test (Cepat)
echo.

set /p choice="Pilih (1-3): "

if "%choice%"=="1" (
    echo.
    echo Menjalankan Automated Test...
    node test-gps-tracking-performance.js
) else if "%choice%"=="2" (
    echo.
    echo Menjalankan Manual Test...
    node test-gps-manual.js
) else if "%choice%"=="3" (
    echo.
    echo Menjalankan Quick Test...
    node test-gps-quick.js
) else (
    echo Pilihan tidak valid!
    pause
    exit /b 1
)

echo.
echo Testing selesai!
pause
