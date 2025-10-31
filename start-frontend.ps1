# PowerShell script to start frontend with ngrok configuration
Write-Host "Starting Frontend with Ngrok Configuration..."

# Set environment variables
$env:DANGEROUSLY_DISABLE_HOST_CHECK = "true"
$env:HOST = "0.0.0.0"
$env:REACT_APP_API_URL = "https://devona-lophodont-unusually.ngrok-free.dev"
$env:REACT_APP_SOCKET_URL = "https://devona-lophodont-unusually.ngrok-free.dev"

Write-Host "Environment variables set:"
Write-Host "DANGEROUSLY_DISABLE_HOST_CHECK = $env:DANGEROUSLY_DISABLE_HOST_CHECK"
Write-Host "HOST = $env:HOST"
Write-Host "REACT_APP_API_URL = $env:REACT_APP_API_URL"

# Change to frontend directory and start
Set-Location frontend
npm start
