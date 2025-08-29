@echo off
echo 🚀 Setup Sprint 6: Real-Time Route Tracking
echo ==============================================

REM Setup Backend
echo.
echo 📦 Setting up Backend...
cd backend

REM Install dependencies if needed
if not exist "node_modules" (
    echo Installing backend dependencies...
    npm install
)

REM Setup tracking database
echo Setting up tracking database...
node add-tracking-tables.js

REM Setup search database (if not exists)
if not exist "search_logs_created" (
    echo Setting up search database...
    node add-search-table.js
    type nul > search_logs_created
)

cd ..

REM Setup Frontend
echo.
echo 📦 Setting up Frontend...
cd frontend

REM Install dependencies if needed
if not exist "node_modules" (
    echo Installing frontend dependencies...
    npm install
)

REM Check if .env exists
if not exist ".env" (
    echo.
    echo ⚠️  IMPORTANT: You need to create .env file with Google Maps API key
    echo Copy env.example to .env and add your Google Maps API key:
    echo copy env.example .env
    echo.
    echo Get Google Maps API key from: https://console.cloud.google.com/
    echo Enable Maps JavaScript API and Directions API
    echo.
)

cd ..

echo.
echo ✅ Setup Sprint 6 completed!
echo.
echo 🚀 To start the application:
echo 1. Backend: cd backend ^&^& npm start
echo 2. Frontend: cd frontend ^&^& npm start
echo.
echo 📱 Features available:
echo - Real-time route tracking with Google Maps
echo - GPS position tracking for ambulance
echo - Live monitoring dashboard
echo - Status management (Menunggu → Dijemput → Dalam Perjalanan → Tiba)
echo.
echo 🗺️  Coverage: Kota Bogor, Jawa Barat
echo.

pause
