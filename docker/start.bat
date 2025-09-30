@echo off
echo 🚀 Starting ISO Certificate Management System with Docker...
echo.

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not running. Please start Docker first.
    pause
    exit /b 1
)

REM Check if docker-compose is available
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo ❌ docker-compose is not installed. Please install docker-compose first.
    pause
    exit /b 1
)

REM Stop existing containers if running
echo 🛑 Stopping existing containers...
docker-compose down

REM Build and start services
echo 🏗️  Building and starting services...
docker-compose up --build -d

REM Wait for services to be ready
echo ⏳ Waiting for services to be ready...
timeout /t 10 /nobreak >nul

REM Check service status
echo.
echo 📊 Service Status:
docker-compose ps

echo.
echo 🎉 ISO Certificate Management System is now running!
echo.
echo 📱 Web Interface: http://localhost
echo 🔗 API Endpoints: http://localhost/api
echo.
echo 📋 Useful commands:
echo   View logs: docker-compose logs -f
echo   Stop services: docker-compose down
echo   Restart: docker-compose restart
echo.
pause