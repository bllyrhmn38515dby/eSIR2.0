@echo off
echo Starting Frontend with Ngrok Configuration...

cd frontend

set DANGEROUSLY_DISABLE_HOST_CHECK=true
set HOST=0.0.0.0
set REACT_APP_API_URL=https://devona-lophodont-unusually.ngrok-free.dev
set REACT_APP_SOCKET_URL=https://devona-lophodont-unusually.ngrok-free.dev

echo Environment variables set:
echo DANGEROUSLY_DISABLE_HOST_CHECK=%DANGEROUSLY_DISABLE_HOST_CHECK%
echo HOST=%HOST%
echo REACT_APP_API_URL=%REACT_APP_API_URL%

npm start
