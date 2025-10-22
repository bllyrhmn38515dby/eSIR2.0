@echo off
echo ========================================
echo    TEST DEPLOYMENT eSIR 2.0
echo ========================================
echo.

echo [1/4] Testing Backend API...
echo.
curl -s "https://esirv02.my.id/api/test"
if %errorlevel% equ 0 (
    echo ✅ Backend API berhasil diakses
) else (
    echo ❌ Backend API tidak bisa diakses
)

echo.
echo [2/4] Testing Database Connection...
echo.
curl -s "https://esirv02.my.id/api/health"
if %errorlevel% equ 0 (
    echo ✅ Database connection berhasil
) else (
    echo ❌ Database connection gagal
)

echo.
echo [3/4] Testing Frontend...
echo.
curl -s -I "https://esirv02.my.id" | findstr "200 OK"
if %errorlevel% equ 0 (
    echo ✅ Frontend berhasil diakses
) else (
    echo ❌ Frontend tidak bisa diakses
)

echo.
echo [4/4] Testing Login Endpoint...
echo.
curl -s -X POST "https://esirv02.my.id/api/auth/login" -H "Content-Type: application/json" -d "{\"email\":\"admin@esir.com\",\"password\":\"admin123\"}"
if %errorlevel% equ 0 (
    echo ✅ Login endpoint berhasil
) else (
    echo ❌ Login endpoint gagal
)

echo.
echo ========================================
echo    HASIL TEST DEPLOYMENT
echo ========================================
echo.
echo 📋 Manual testing yang perlu dilakukan:
echo    1. Buka https://esirv02.my.id
echo    2. Login dengan kredensial:
echo       - Admin: admin@esir.com / admin123
echo       - RSUD: admin@rsud.com / admin123
echo       - Puskesmas: admin@puskesmas.com / admin123
echo    3. Test fitur CRUD (buat rujukan baru)
echo    4. Pastikan data tersimpan di database CPanel
echo.
echo 🎯 Kriteria sukses:
echo    - Bisa login tanpa backend local
echo    - CRUD operations tersimpan di database CPanel
echo    - Real-time features berfungsi
echo.
pause
