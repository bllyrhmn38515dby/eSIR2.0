@echo off
echo ========================================
echo    FIX USERS ENDPOINT SCRIPT
echo ========================================
echo.

echo 🔧 Fixing Users Endpoint 500 Error...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed or not in PATH
    echo Please install Node.js first: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js is available
echo.

REM Run debug first
echo 🔍 Running debug to identify issues...
node debug-users-endpoint.js
if %errorlevel% neq 0 (
    echo ❌ Debug failed
    pause
    exit /b 1
)

echo.
echo ✅ Debug completed
echo.

REM Run fix
echo 🔧 Running fix for users endpoint...
node fix-users-endpoint.js
if %errorlevel% neq 0 (
    echo ❌ Fix failed
    pause
    exit /b 1
)

echo.
echo ========================================
echo    FIX COMPLETED SUCCESSFULLY!
echo ========================================
echo.
echo 📋 What was fixed:
echo    ✅ Added missing database columns
echo    ✅ Fixed orphaned users
echo    ✅ Improved error handling
echo    ✅ Enhanced query robustness
echo.
echo 🚀 Next Steps:
echo    1. Restart your backend server
echo    2. Test the UserManagement page
echo    3. Check if the 500 error is resolved
echo.
echo 🧪 To test:
echo    - Open UserManagement page
echo    - Check browser console for errors
echo    - Verify users are loading properly
echo.
pause
