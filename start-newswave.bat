@echo off
chcp 65001 >nul
title 🚀 Starting NewsWave - Live Portal
color 0A

echo =====================================================
echo          📰  WELCOME TO NEWSWAVE AUTO STARTER
echo =====================================================
echo.

:: Go to backend folder
cd /d "%~dp0newswave-backend"

:: Check .env exists
if not exist ".env" (
  echo ⚠️  Missing .env file in backend folder!
  echo Please create it and include:
  echo   PORT=4000
  echo   NEWS_API_KEY=your_news_api_key
  echo   YOUTUBE_API_KEY=your_youtube_api_key
  pause
  exit /b
)

:: Read .env lines manually and set variables
for /f "usebackq tokens=1,2 delims==" %%A in (".env") do (
  set "%%A=%%B"
)

echo ✅ Environment loaded successfully:
echo    PORT=%PORT%
echo    NEWS_API_KEY=%NEWS_API_KEY%
echo    YOUTUBE_API_KEY=%YOUTUBE_API_KEY:~0,8%********
echo -----------------------------------------------------

:: Install backend dependencies if missing
if not exist "node_modules" (
  echo 📦 Installing backend dependencies...
  npm install >nul
  echo ✅ Dependencies installed.
) else (
  echo ✅ Dependencies already present.
)
echo -----------------------------------------------------

:: Start backend
echo 🚀 Starting backend on http://localhost:%PORT% ...
start "🖥️ NewsWave Backend" cmd /k "node server.js"
timeout /t 3 >nul

:: Move to frontend (your HTML files are in main newswave folder)
cd /d "%~dp0"

:: Install serve globally if needed
where serve >nul 2>nul
if errorlevel 1 (
  echo 🌐 Installing serve tool...
  npm install -g serve >nul
)

:: Launch frontend
echo 🌍 Launching frontend on http://localhost:3000 ...
start "" http://localhost:3000
npx serve -l 3000 >nul

echo -----------------------------------------------------
echo ✅ NEWSWAVE STARTED SUCCESSFULLY!
echo 🌎 Backend:  http://localhost:%PORT%
echo 🌎 Frontend: http://localhost:3000
echo =====================================================
pause
