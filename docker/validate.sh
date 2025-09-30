#!/bin/bash

echo "🔍 Validating Docker setup for ISO Certificate Management System..."
echo ""

# Check required files
echo "📁 Checking required files..."
files=(
    "docker-compose.yml"
    "Dockerfile.backend"
    "Dockerfile.frontend"
    "nginx.conf"
    "../backend/package.json"
    "../frontend/package.json"
    "../backend/.dockerignore"
    "../frontend/.dockerignore"
)

all_good=true
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file (missing)"
        all_good=false
    fi
done

echo ""

# Check Docker and docker-compose
echo "🐳 Checking Docker requirements..."
if command -v docker &> /dev/null; then
    echo "✅ Docker is installed: $(docker --version)"
else
    echo "❌ Docker is not installed"
    all_good=false
fi

if command -v docker-compose &> /dev/null; then
    echo "✅ docker-compose is installed: $(docker-compose --version)"
else
    echo "❌ docker-compose is not installed"
    all_good=false
fi

echo ""

# Validate docker-compose.yml syntax
if command -v docker-compose &> /dev/null; then
    echo "📋 Validating docker-compose.yml..."
    if docker-compose config > /dev/null 2>&1; then
        echo "✅ docker-compose.yml syntax is valid"
    else
        echo "❌ docker-compose.yml has syntax errors"
        all_good=false
    fi
fi

echo ""

if $all_good; then
    echo "🎉 All checks passed! You can run 'docker-compose up -d' to start the system."
else
    echo "⚠️  Some issues found. Please fix them before proceeding."
fi