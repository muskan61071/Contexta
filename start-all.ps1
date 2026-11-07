param(
    [switch]$MultiWindow
)

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "Starting Contexta - Communication Intelligence System" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

$root = $PSScriptRoot

if ($MultiWindow) {
    Write-Host "1. Starting NLP Engine (Port 8000)..." -ForegroundColor Yellow
    Start-Process powershell -ArgumentList "-ExecutionPolicy", "Bypass", "-NoExit", "-Command", "Set-Location '$root\nlp-engine'; & '.\.venv\Scripts\python.exe' -m uvicorn app.main:app --port 8000 --reload"

    Write-Host "2. Starting Express API Gateway (Port 5000)..." -ForegroundColor Yellow
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$root\server'; npm run dev"

    Write-Host "3. Starting React Client (Port 5173)..." -ForegroundColor Yellow
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$root\client'; npm run dev"

    Write-Host "`nAll 3 services are launching in separate windows." -ForegroundColor Green
    Write-Host "Web Application: http://localhost:5173" -ForegroundColor Green
    Write-Host "API Gateway:     http://localhost:5000/api/health" -ForegroundColor Green
    Write-Host "NLP Engine:      http://localhost:8000/api/health" -ForegroundColor Green
} else {
    Write-Host "Starting all 3 services in this single terminal..." -ForegroundColor Yellow
    Write-Host "Web Application: http://localhost:5173" -ForegroundColor Green
    Write-Host "API Gateway:     http://localhost:5000/api/health" -ForegroundColor Green
    Write-Host "NLP Engine:      http://localhost:8000/api/health" -ForegroundColor Green
    Write-Host "`nPress Ctrl+C at any time to stop all services simultaneously.`n" -ForegroundColor DarkGray
    npm run dev
}
