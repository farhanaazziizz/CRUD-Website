#!/bin/bash

echo "🚀 Starting ISO Certificate Management System with Docker..."
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose is not installed. Please install docker-compose first."
    exit 1
fi

# Stop existing containers if running
echo "🛑 Stopping existing containers..."
docker-compose down

# Build and start services
echo "🏗️  Building and starting services..."
docker-compose up --build -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check service status
echo ""
echo "📊 Service Status:"
docker-compose ps

echo ""
echo "🎉 ISO Certificate Management System is now running!"
echo ""
echo "📱 Web Interface: http://localhost"
echo "🔗 API Endpoints: http://localhost/api"
echo ""
echo "📋 Useful commands:"
echo "  View logs: docker-compose logs -f"
echo "  Stop services: docker-compose down"
echo "  Restart: docker-compose restart"
echo ""