# PowerShell script to start all eSIR 2.0 servers
Write-Host "Starting eSIR 2.0 Servers..." -ForegroundColor Green

# Start Backend Server
Write-Host "Starting Backend Server..." -ForegroundColor Yellow
Start-Process -FilePath "node" -ArgumentList "index.js" -WorkingDirectory "backend" -WindowStyle Normal

# Wait 5 seconds
Start-Sleep -Seconds 5

# Start Ngrok Tunnel
Write-Host "Starting Ngrok Tunnel..." -ForegroundColor Yellow
Start-Process -FilePath "ngrok" -ArgumentList "http 3000" -WindowStyle Normal

# Wait 5 seconds
Start-Sleep -Seconds 5

# Start Frontend Server
Write-Host "Starting Frontend Server..." -ForegroundColor Yellow
$env:DANGEROUSLY_DISABLE_HOST_CHECK = "true"
$env:HOST = "0.0.0.0"
Start-Process -FilePath "npm" -ArgumentList "start" -WorkingDirectory "frontend" -WindowStyle Normal

Write-Host "All servers started!" -ForegroundColor Green
Write-Host "Backend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3001" -ForegroundColor Cyan
Write-Host "Ngrok Dashboard: http://localhost:4040" -ForegroundColor Cyan

Write-Host "Press any key to continue..." -ForegroundColor White
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
