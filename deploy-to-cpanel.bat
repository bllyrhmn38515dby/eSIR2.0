@echo off
echo ========================================
echo    DEPLOYMENT eSIR 2.0 KE CPANEL
echo ========================================
echo.

echo [1/5] Mempersiapkan file backend...
echo.

REM Copy environment template
if not exist "backend\.env" (
    copy "backend\env.production.template" "backend\.env"
    echo ✅ File .env berhasil dibuat dari template
) else (
    echo ⚠️  File .env sudah ada, lewati...
)

echo.
echo [2/5] Membuat folder untuk upload...
if not exist "deploy-files" mkdir deploy-files
if not exist "deploy-files\api" mkdir deploy-files\api

echo.
echo [3/5] Copy file backend (kecuali node_modules)...
xcopy "backend\*" "deploy-files\api\" /E /I /Y /EXCLUDE:exclude-files.txt

echo.
echo [4/5] Membuat file exclude untuk node_modules...
echo node_modules\ > exclude-files.txt
echo .env >> exclude-files.txt
echo config.env >> exclude-files.txt
echo config.production.env >> exclude-files.txt

echo.
echo [5/5] Deployment files siap!
echo.
echo 📁 File siap diupload ke CPanel:
echo    - Upload folder 'deploy-files\api\' ke 'public_html\api\'
echo    - Jangan lupa update password database di file .env
echo.
echo 📋 Langkah selanjutnya:
echo    1. Login ke CPanel
echo    2. Upload file ke public_html/api/
echo    3. Setup Node.js application
echo    4. Install dependencies: npm install --production
echo    5. Start application
echo.
echo 🔗 Test endpoint: https://esirv02.my.id/api/test
echo.
pause
