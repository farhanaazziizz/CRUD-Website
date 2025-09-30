#!/bin/bash

echo "🚀 ISO Certificate Management System - Setup Script"
echo "=================================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if Node.js is installed
check_node() {
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        print_status "Node.js is installed: $NODE_VERSION"

        # Check if version is >= 18
        NODE_MAJOR=$(node --version | cut -d'.' -f1 | sed 's/v//')
        if [ "$NODE_MAJOR" -ge 18 ]; then
            print_status "Node.js version is compatible"
        else
            print_warning "Node.js version should be >= 18. Current: $NODE_VERSION"
        fi
    else
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        echo "Visit: https://nodejs.org/"
        exit 1
    fi
}

# Check if npm is installed
check_npm() {
    if command -v npm &> /dev/null; then
        NPM_VERSION=$(npm --version)
        print_status "npm is installed: v$NPM_VERSION"
    else
        print_error "npm is not installed"
        exit 1
    fi
}

# Install dependencies
install_dependencies() {
    print_info "Installing dependencies..."

    # Root dependencies
    print_info "Installing root dependencies..."
    npm install

    # Backend dependencies
    print_info "Installing backend dependencies..."
    cd backend
    npm install
    cd ..

    # Frontend dependencies
    print_info "Installing frontend dependencies..."
    cd frontend
    npm install
    cd ..

    print_status "All dependencies installed successfully!"
}

# Setup environment files
setup_env() {
    print_info "Setting up environment files..."

    # Backend environment
    if [ ! -f "backend/.env" ]; then
        cp backend/.env.example backend/.env
        print_status "Created backend/.env from example"
    else
        print_warning "backend/.env already exists, skipping..."
    fi

    # Root environment
    if [ ! -f ".env" ]; then
        cp .env.example .env
        print_status "Created .env from example"
    else
        print_warning ".env already exists, skipping..."
    fi
}

# Create data directory
setup_directories() {
    print_info "Setting up directories..."

    mkdir -p backend/data
    mkdir -p logs

    print_status "Directories created successfully!"
}

# Check Docker (optional)
check_docker() {
    print_info "Checking Docker installation (optional)..."

    if command -v docker &> /dev/null; then
        DOCKER_VERSION=$(docker --version)
        print_status "Docker is installed: $DOCKER_VERSION"

        if command -v docker-compose &> /dev/null; then
            COMPOSE_VERSION=$(docker-compose --version)
            print_status "Docker Compose is installed: $COMPOSE_VERSION"
        else
            print_warning "Docker Compose is not installed (optional for Docker deployment)"
        fi
    else
        print_warning "Docker is not installed (optional for Docker deployment)"
    fi
}

# Test setup
test_setup() {
    print_info "Testing setup..."

    # Test backend
    print_info "Testing backend setup..."
    cd backend
    if npm run dev --dry-run &> /dev/null; then
        print_status "Backend setup is valid"
    else
        print_error "Backend setup has issues"
    fi
    cd ..

    # Test frontend
    print_info "Testing frontend setup..."
    cd frontend
    if npm run dev --dry-run &> /dev/null; then
        print_status "Frontend setup is valid"
    else
        print_error "Frontend setup has issues"
    fi
    cd ..
}

# Main setup function
main() {
    echo "Starting setup process..."
    echo ""

    check_node
    check_npm
    echo ""

    install_dependencies
    echo ""

    setup_env
    echo ""

    setup_directories
    echo ""

    check_docker
    echo ""

    test_setup
    echo ""

    print_status "Setup completed successfully! 🎉"
    echo ""
    echo "📋 Next steps:"
    echo "  1. Review and update .env files if needed"
    echo "  2. Start development: npm run dev"
    echo "  3. Or start with Docker: cd docker && docker-compose up -d"
    echo ""
    echo "📱 Access points:"
    echo "  • Development Frontend: http://localhost:5173"
    echo "  • Development Backend: http://localhost:5000"
    echo "  • Docker Frontend: http://localhost"
    echo ""
}

# Run main function
main