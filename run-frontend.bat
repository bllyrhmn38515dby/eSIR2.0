@echo off
cd frontend
set DANGEROUSLY_DISABLE_HOST_CHECK=true
set HOST=0.0.0.0
npm start
