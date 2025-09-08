@echo off
echo Starting eSIR 2.0 Backend Development Server...
echo.
echo Please make sure you have:
echo 1. MySQL server running
echo 2. Database 'esir_db' created
echo 3. Tables imported from database.sql
echo.
echo Copy config.env to .env if you haven't already
echo.
pause
npm run dev
