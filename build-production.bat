@echo off
echo ========================================
echo    eSIR 2.0 Production Build Script
echo ========================================
echo.

echo [1/4] Building Frontend for Production...
cd frontend
call npm run build:production
if %errorlevel% neq 0 (
    echo ERROR: Frontend build failed!
    pause
    exit /b 1
)
echo ✅ Frontend build completed
echo.

echo [2/4] Copying production files...
cd ..
if not exist "production-build" mkdir production-build
if not exist "production-build\frontend" mkdir production-build\frontend
if not exist "production-build\backend" mkdir production-build\backend

echo Copying frontend build files...
xcopy /E /I /Y "frontend\build\*" "production-build\frontend\"

echo Copying backend files...
xcopy /E /I /Y "backend\*" "production-build\backend\"

echo Copying configuration files...
copy /Y ".htaccess" "production-build\"
copy /Y "backend\config.production.env" "production-build\backend\.env.production"
copy /Y "backend\index.production.js" "production-build\backend\index.js"
echo ✅ Files copied to production-build folder
echo.

echo [3/4] Creating upload instructions...
echo # Upload Instructions for cPanel > production-build\upload-instructions.txt
echo. >> production-build\upload-instructions.txt
echo 1. Upload all files from 'frontend' folder to 'public_html/' >> production-build\upload-instructions.txt
echo 2. Upload all files from 'backend' folder to 'public_html/api/' >> production-build\upload-instructions.txt
echo 3. Upload .htaccess file to 'public_html/' >> production-build\upload-instructions.txt
echo 4. Edit 'public_html/api/.env.production' with your database credentials >> production-build\upload-instructions.txt
echo 5. Setup Node.js in cPanel with startup file: index.js >> production-build\upload-instructions.txt
echo 6. Install dependencies: cd public_html/api && npm install --production >> production-build\upload-instructions.txt
echo 7. Start Node.js application in cPanel >> production-build\upload-instructions.txt
echo ✅ Upload instructions created
echo.

echo [4/4] Production build completed!
echo.
echo 📁 Production files are ready in: production-build\
echo 📋 Upload instructions: production-build\upload-instructions.txt
echo.
echo Next steps:
echo 1. Upload files to cPanel
echo 2. Setup database
echo 3. Configure environment variables
echo 4. Start Node.js application
echo.
pause
