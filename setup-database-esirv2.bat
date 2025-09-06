@echo off
echo ========================================
echo eSIR 2.0 - Database Setup
echo ========================================
echo.

echo Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js found: 
node --version

echo.
echo Checking MySQL connection...
echo Please ensure MySQL is running and accessible

echo.
echo Setting up database prodsysesirv02...
cd backend
node setup-database-complete.js

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo Database setup completed successfully!
    echo ========================================
    echo.
    echo You can now start the application:
    echo 1. Backend: npm start
    echo 2. Frontend: cd ../frontend ^&^& npm start
    echo.
    echo Login credentials:
    echo Email: admin@esir.com
    echo Password: admin123
    echo.
) else (
    echo.
    echo ========================================
    echo Database setup failed!
    echo ========================================
    echo.
    echo Please check:
    echo 1. MySQL is running
    echo 2. Database credentials in config.env
    echo 3. No existing database conflicts
    echo.
)

pause
