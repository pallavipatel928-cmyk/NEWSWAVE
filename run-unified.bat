@echo off
chcp 65001 >nul
title 🚀 Starting NewsWave Unified Server
color 0A

echo =====================================================
echo          📰  NEWSWAVE UNIFIED SERVER STARTER
echo =====================================================
echo.

:: Go to the project folder
cd /d "%~dp0"

:: Install dependencies if missing
if not exist "node_modules" (
  echo 📦 Installing dependencies...
  npm install express cors rss-parser >nul
  echo ✅ Dependencies installed.
) else (
  echo ✅ Dependencies already present.
)

echo -----------------------------------------------------
echo 🚀 Starting unified server on http://localhost:3000 ...
echo 🌍 Frontend and backend combined in one server
echo -----------------------------------------------------

:: Start the unified server
node unified-server.js

pause