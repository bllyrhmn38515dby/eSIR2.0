@echo off
echo 🚀 Setup eSIR 2.0 System
echo =========================

echo.
echo 📦 Installing Frontend Dependencies...
cd frontend
if not exist "node_modules" (
    npm install
) else (
    echo Frontend dependencies already installed
)

echo.
echo 📦 Installing Backend Dependencies...
cd ..\backend
if not exist "node_modules" (
    npm install
) else (
    echo Backend dependencies already installed
)

echo.
echo ⚙️  Setting up Environment...
if not exist ".env" (
    copy env.example .env
    echo Environment file created from template
) else (
    echo Environment file already exists
)

echo.
echo 🗄️  Database Setup Instructions:
echo ================================
echo 1. Install MySQL Server if not already installed
echo 2. Create database: CREATE DATABASE esirv2;
echo 3. Import schema: mysql -u root -p esirv2 ^< database.sql
echo 4. Update .env file with correct database credentials
echo.

echo 🚀 Starting Application...
echo.
echo To start the application manually:
echo 1. Backend: cd backend ^&^& npm start
echo 2. Frontend: cd frontend ^&^& npm start
echo.
echo 📱 Access URLs:
echo - Frontend: http://localhost:3000
echo - Backend API: http://localhost:3001
echo.
echo 👤 Default Login:
echo - Admin Pusat: admin@pusat.com / admin123
echo - Admin Faskes: admin@rsud.com / admin123
echo.

pause
