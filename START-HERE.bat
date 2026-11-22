@echo off
title Divyansh Kackker portfolio
rem Double-click this file to install (first time only) and start the site.
cd /d "%~dp0"

where node >/dev/null 2>nul
if errorlevel 1 (
  echo.
  echo Node.js is not installed.
  echo Download the LTS version from https://nodejs.org , install it, then double-click this file again.
  echo.
  pause
  exit /b 1
)

if not exist node_modules (
  echo Installing packages, this takes 1-3 minutes the first time...
  call npm install
  if errorlevel 1 (
    echo.
    echo npm install failed. Copy the error text above to get help.
    pause
    exit /b 1
  )
)

echo.
echo Starting the site. Your browser will open at http://localhost:5173
echo Keep this window open while you look at the site. Close it to stop.
echo.
start "" cmd /c "timeout /t 4 >/dev/null & start http://localhost:5173"
call npm run dev
pause
