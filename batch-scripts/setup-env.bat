@echo off
echo Setting up environment variables for eSIR2.0...

cd frontend

echo Creating .env file...
if not exist .env (
    copy env.example .env
    echo .env file created from env.example
) else (
    echo .env file already exists
)

echo.
echo Please edit frontend/.env file and set your Google Maps API key:
echo 1. Go to https://console.cloud.google.com/
echo 2. Create a new project or select existing one
echo 3. Enable Maps JavaScript API and Directions API
echo 4. Create credentials (API Key)
echo 5. Replace "your_google_maps_api_key_here" in .env file with your actual API key
echo.
echo Example .env content:
echo REACT_APP_GOOGLE_MAPS_API_KEY=AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg
echo REACT_APP_API_URL=http://localhost:3001/api
echo REACT_APP_SOCKET_URL=http://localhost:3001
echo.

pause
