@echo off
echo 🚀 Preparing eSIR 2.0 for Production Deployment...
echo.

echo 📁 Creating production folder...
if not exist "production" mkdir production
if not exist "production\frontend" mkdir production\frontend
if not exist "production\backend" mkdir production\backend

echo 📋 Copying frontend build files...
xcopy "frontend\build\*" "production\frontend\" /E /I /Y

echo 📋 Copying backend files...
xcopy "backend\*" "production\backend\" /E /I /Y

echo 🗑️ Cleaning up unnecessary files...
del "production\backend\*.sql" /Q
del "production\backend\*.js" /Q
del "production\backend\*.bat" /Q
del "production\backend\*.md" /Q
del "production\backend\check-*" /Q
del "production\backend\create-*" /Q
del "production\backend\debug-*" /Q
del "production\backend\fix-*" /Q
del "production\backend\list-*" /Q
del "production\backend\minimal-*" /Q
del "production\backend\reset-*" /Q
del "production\backend\restore-*" /Q
del "production\backend\setup-*" /Q
del "production\backend\simple-*" /Q
del "production\backend\test-*" /Q
del "production\backend\update-*" /Q
del "production\backend\working-*" /Q

echo 📋 Copying deployment guide...
copy "DEPLOYMENT_GUIDE.md" "production\"

echo ✅ Production files ready!
echo.
echo 📂 Production files are in: production\
echo 📁 Frontend files: production\frontend\
echo 📁 Backend files: production\backend\
echo 📖 Deployment guide: production\DEPLOYMENT_GUIDE.md
echo.
echo 🚀 Ready for cPanel upload!
pause
