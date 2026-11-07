@echo off
setlocal
cd /d "%~dp0"

echo Starting Contexta. Keep this window open while you use the website.
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is missing. Install Node.js, then run this file again.
  pause
  exit /b 1
)
where npm >nul 2>nul
if errorlevel 1 (
  echo npm is missing. Reinstall Node.js with npm, then run this file again.
  pause
  exit /b 1
)
where python >nul 2>nul
if errorlevel 1 (
  echo Python is missing. Install Python 3.10 or newer, then run this file again.
  pause
  exit /b 1
)

if not exist "node_modules\concurrently" (
  echo Installing project starter...
  call npm install
  if errorlevel 1 goto failed
)
if not exist "server\node_modules\tsx" (
  echo Installing API dependencies...
  call npm --prefix server install
  if errorlevel 1 goto failed
)
if not exist "client\node_modules\vite" (
  echo Installing website dependencies...
  call npm --prefix client install
  if errorlevel 1 goto failed
)
if not exist "nlp-engine\.venv\Scripts\python.exe" (
  echo Preparing the analysis service...
  python -m venv nlp-engine\.venv
  if errorlevel 1 goto failed
)
"nlp-engine\.venv\Scripts\python.exe" -c "import fastapi, uvicorn" >nul 2>nul
if errorlevel 1 (
  echo Installing analysis service dependencies...
  "nlp-engine\.venv\Scripts\python.exe" -m pip install -r nlp-engine\requirements.txt
  if errorlevel 1 goto failed
)

echo.
echo Starting the analysis service, API, and website...
echo When [WEB] shows a local address, open http://localhost:5173
echo Press Ctrl+C in this window to stop the app.
echo.
call npm start
if errorlevel 1 goto failed
goto end

:failed
echo.
echo Setup could not finish. Read the error above, fix it, then run START-CONTEXTA.bat again.
pause
:end
endlocal
