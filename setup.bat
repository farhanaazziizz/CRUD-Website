@echo off
echo 🚀 ISO Certificate Management System - Setup Script
echo ==================================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    echo Visit: https://nodejs.org/
    pause
    exit /b 1
) else (
    echo ✅ Node.js is installed:
    node --version
)

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm is not installed
    pause
    exit /b 1
) else (
    echo ✅ npm is installed: v
    npm --version
)

echo.
echo ℹ️ Installing dependencies...

REM Install root dependencies
echo ℹ️ Installing root dependencies...
npm install

REM Install backend dependencies
echo ℹ️ Installing backend dependencies...
cd backend
npm install
cd ..

REM Install frontend dependencies
echo ℹ️ Installing frontend dependencies...
cd frontend
npm install
cd ..

echo ✅ All dependencies installed successfully!
echo.

REM Setup environment files
echo ℹ️ Setting up environment files...

REM Backend environment
if not exist "backend\.env" (
    copy "backend\.env.example" "backend\.env"
    echo ✅ Created backend\.env from example
) else (
    echo ⚠️ backend\.env already exists, skipping...
)

REM Root environment
if not exist ".env" (
    copy ".env.example" ".env"
    echo ✅ Created .env from example
) else (
    echo ⚠️ .env already exists, skipping...
)

echo.

REM Create directories
echo ℹ️ Setting up directories...
if not exist "backend\data" mkdir "backend\data"
if not exist "logs" mkdir "logs"
echo ✅ Directories created successfully!

echo.

REM Check Docker (optional)
echo ℹ️ Checking Docker installation (optional)...
docker --version >nul 2>&1
if errorlevel 1 (
    echo ⚠️ Docker is not installed (optional for Docker deployment)
) else (
    echo ✅ Docker is installed:
    docker --version

    docker-compose --version >nul 2>&1
    if errorlevel 1 (
        echo ⚠️ Docker Compose is not installed (optional for Docker deployment)
    ) else (
        echo ✅ Docker Compose is installed:
        docker-compose --version
    )
)

echo.
echo ✅ Setup completed successfully! 🎉
echo.
echo 📋 Next steps:
echo   1. Review and update .env files if needed
echo   2. Start development: npm run dev
echo   3. Or start with Docker: cd docker ^&^& docker-compose up -d
echo.
echo 📱 Access points:
echo   • Development Frontend: http://localhost:5173
echo   • Development Backend: http://localhost:5000
echo   • Docker Frontend: http://localhost
echo.
pause