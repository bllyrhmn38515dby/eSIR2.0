@echo off
echo ========================================
echo 🚑 eSIR2.0 Tracking Simulation
echo ========================================
echo.

echo 📋 Starting tracking simulation...
echo.

cd /d "%~dp0"
node simulate-tracking-updates.js

echo.
echo ✅ Simulation completed!
pause
