@echo off
echo ========================================
echo    AMBULANCE DRIVERS SETUP SCRIPT
echo ========================================
echo.

echo 🚑 Setting up Ambulance Drivers System...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed or not in PATH
    echo Please install Node.js first: https://nodejs.org/
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed or not in PATH
    pause
    exit /b 1
)

echo ✅ Node.js and npm are available
echo.

REM Install dependencies if needed
echo 📦 Installing dependencies...
npm install mysql2 bcryptjs dotenv --save
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo ✅ Dependencies installed successfully
echo.

REM Run the complete setup
echo 🚀 Running Ambulance Drivers setup...
node add-ambulance-drivers-complete.js
if %errorlevel% neq 0 (
    echo ❌ Setup failed
    pause
    exit /b 1
)

echo.
echo ========================================
echo    SETUP COMPLETED SUCCESSFULLY!
echo ========================================
echo.
echo 📋 Summary:
echo    ✅ Ambulance drivers table created
echo    ✅ Role sopir_ambulans added
echo    ✅ 10 ambulance drivers added
echo    ✅ All data verified
echo.
echo 🔑 Login Credentials:
echo    Email: [driver_name]@ambulans.com
echo    Password: sopir123
echo.
echo 🧪 To test the setup:
echo    node test-ambulance-drivers.js
echo.
echo 🚀 Next Steps:
echo    1. Test login with new accounts
echo    2. Update backend routes
echo    3. Create driver dashboard
echo    4. Add tracking features
echo.
pause
