#!/bin/bash

echo "🚀 ISO Certificate Management System - Deployment Script"
echo "========================================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() { echo -e "${GREEN}✅ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
print_error() { echo -e "${RED}❌ $1${NC}"; }
print_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }

# Check deployment method
if [ "$1" = "docker" ]; then
    DEPLOY_METHOD="docker"
    print_info "Deploying with Docker..."
elif [ "$1" = "manual" ]; then
    DEPLOY_METHOD="manual"
    print_info "Deploying manually..."
else
    echo "Usage: $0 [docker|manual]"
    echo ""
    echo "Deployment methods:"
    echo "  docker  - Deploy using Docker Compose (recommended)"
    echo "  manual  - Deploy using Node.js directly"
    exit 1
fi

# Docker deployment
deploy_docker() {
    print_info "Starting Docker deployment..."

    # Check if Docker is available
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed"
        exit 1
    fi

    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed"
        exit 1
    fi

    # Navigate to docker directory
    cd docker

    # Stop existing containers
    print_info "Stopping existing containers..."
    docker-compose down

    # Build and start containers
    print_info "Building and starting containers..."
    docker-compose up --build -d

    # Wait for services to be ready
    print_info "Waiting for services to be ready..."
    sleep 15

    # Check service health
    print_info "Checking service health..."
    if docker-compose ps | grep -q "healthy"; then
        print_status "Services are healthy!"
    else
        print_warning "Some services might not be ready yet"
    fi

    # Show status
    echo ""
    print_info "Service Status:"
    docker-compose ps

    echo ""
    print_status "Docker deployment completed!"
    echo ""
    echo "📱 Access the application:"
    echo "  • Web Interface: http://localhost"
    echo "  • API: http://localhost/api"
    echo ""
    echo "📋 Useful commands:"
    echo "  • View logs: docker-compose logs -f"
    echo "  • Stop services: docker-compose down"
    echo "  • Restart: docker-compose restart"
}

# Manual deployment
deploy_manual() {
    print_info "Starting manual deployment..."

    # Check if Node.js is available
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed"
        exit 1
    fi

    # Install dependencies
    print_info "Installing dependencies..."
    npm run install-all

    # Build frontend
    print_info "Building frontend..."
    cd frontend
    npm run build
    cd ..

    # Setup environment
    if [ ! -f "backend/.env" ]; then
        print_info "Setting up environment..."
        cp backend/.env.example backend/.env
    fi

    # Create directories
    mkdir -p backend/data logs

    # Start backend
    print_info "Starting backend server..."
    cd backend
    npm start &
    BACKEND_PID=$!
    cd ..

    # Wait for backend to start
    sleep 5

    # Check if backend is running
    if curl -s http://localhost:5000/api/health > /dev/null; then
        print_status "Backend is running!"
    else
        print_error "Backend failed to start"
        kill $BACKEND_PID 2>/dev/null
        exit 1
    fi

    # Serve frontend (using a simple HTTP server)
    if command -v python3 &> /dev/null; then
        print_info "Starting frontend server with Python..."
        cd frontend/dist
        python3 -m http.server 3000 &
        FRONTEND_PID=$!
        cd ../..
    elif command -v python &> /dev/null; then
        print_info "Starting frontend server with Python 2..."
        cd frontend/dist
        python -m SimpleHTTPServer 3000 &
        FRONTEND_PID=$!
        cd ../..
    else
        print_warning "Python not found. Please serve frontend/dist manually."
        FRONTEND_PID=""
    fi

    echo ""
    print_status "Manual deployment completed!"
    echo ""
    echo "📱 Access the application:"
    echo "  • Frontend: http://localhost:3000"
    echo "  • Backend API: http://localhost:5000"
    echo ""
    echo "🛑 To stop the services:"
    echo "  kill $BACKEND_PID"
    if [ -n "$FRONTEND_PID" ]; then
        echo "  kill $FRONTEND_PID"
    fi
}

# Main deployment logic
case $DEPLOY_METHOD in
    "docker")
        deploy_docker
        ;;
    "manual")
        deploy_manual
        ;;
esac

echo ""
print_status "Deployment completed! 🎉"