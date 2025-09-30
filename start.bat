@echo off
echo Starting ISO Certificate Management System...
echo.

echo Step 1: Installing dependencies (if needed)...
cd /d "%~dp0"
call npm run install-all

echo.
echo Step 2: Starting Backend Server...
cd backend
start "Backend Server" cmd /k "npm start"

echo.
echo Step 3: Waiting for backend to initialize...
timeout /t 5 /nobreak >nul

echo.
echo Step 4: Starting Frontend...
cd ..\frontend
start "Frontend Server" cmd /k "npm run dev"

echo.
echo ========================================
echo  ISO Certificate Management System
echo ========================================
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Both servers are starting...
echo Check the opened terminal windows for status.
echo.
pause