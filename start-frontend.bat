@echo off
echo Starting Frontend Server...
cd frontend
set DANGEROUSLY_DISABLE_HOST_CHECK=true
set HOST=0.0.0.0
npm start
pause
