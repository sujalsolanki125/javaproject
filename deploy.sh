#!/bin/bash

# Production Deployment Script for Carbon Calculator
# This script automates the production deployment process

set -e  # Exit on error

echo "🚀 Carbon Calculator - Production Deployment Script"
echo "=================================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored messages
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    print_error ".env.production file not found!"
    echo "Please create .env.production from .env.production.template"
    exit 1
fi

print_success ".env.production file found"

# Load environment variables
set -a
source .env.production
set +a

print_success "Environment variables loaded"

# Validate required environment variables
echo ""
echo "📋 Validating required environment variables..."

REQUIRED_VARS=(
    "DB_NAME"
    "DB_USER"
    "DB_PASSWORD"
    "DB_ROOT_PASSWORD"
    "JWT_SECRET"
    "MAIL_USERNAME"
    "MAIL_PASSWORD"
    "CARBON_INTERFACE_API_KEY"
    "CLIMATIQ_API_KEY"
)

MISSING_VARS=()

for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        MISSING_VARS+=("$var")
    fi
done

if [ ${#MISSING_VARS[@]} -ne 0 ]; then
    print_error "Missing required environment variables:"
    for var in "${MISSING_VARS[@]}"; do
        echo "  - $var"
    done
    exit 1
fi

print_success "All required environment variables are set"

# Validate JWT secret length
JWT_LENGTH=${#JWT_SECRET}
if [ $JWT_LENGTH -lt 32 ]; then
    print_warning "JWT_SECRET is too short ($JWT_LENGTH chars). Minimum 32 characters recommended!"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    print_success "JWT_SECRET length is adequate ($JWT_LENGTH chars)"
fi

# Check for hardcoded secrets in code
echo ""
echo "🔍 Checking for hardcoded secrets in code..."

if grep -r -i "password.*=.*\".*\"" backend/src/main/resources/*.yml 2>/dev/null | grep -v "DB_PASSWORD"; then
    print_error "Found hardcoded passwords in configuration files!"
    exit 1
fi

print_success "No hardcoded secrets found"

# Build backend
echo ""
echo "🏗️  Building backend..."

cd backend
./mvnw clean package -DskipTests -q
if [ $? -eq 0 ]; then
    print_success "Backend build successful"
else
    print_error "Backend build failed"
    exit 1
fi
cd ..

# Build frontend
echo ""
echo "🏗️  Building frontend..."

cd frontend
if [ ! -f ".env.production" ]; then
    print_warning "frontend/.env.production not found, creating from template"
    cp .env.production.template .env.production
    print_warning "Please edit frontend/.env.production with your backend URL"
fi

npm install --production --silent
npm run build:prod
if [ $? -eq 0 ]; then
    print_success "Frontend build successful"
else
    print_error "Frontend build failed"
    exit 1
fi
cd ..

# Docker deployment
echo ""
echo "🐳 Docker Deployment"
read -p "Deploy using Docker? (y/n) " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "Building Docker images..."
    
    docker-compose -f docker-compose.prod.yml build
    
    if [ $? -eq 0 ]; then
        print_success "Docker images built successfully"
    else
        print_error "Docker build failed"
        exit 1
    fi
    
    echo ""
    echo "Starting containers..."
    
    docker-compose -f docker-compose.prod.yml up -d
    
    if [ $? -eq 0 ]; then
        print_success "Containers started successfully"
    else
        print_error "Failed to start containers"
        exit 1
    fi
    
    echo ""
    echo "Waiting for services to be healthy..."
    sleep 10
    
    # Check backend health
    echo "Checking backend health..."
    for i in {1..30}; do
        if curl -s http://localhost:8080/actuator/health | grep -q "UP"; then
            print_success "Backend is healthy"
            break
        fi
        if [ $i -eq 30 ]; then
            print_error "Backend health check timeout"
            docker-compose -f docker-compose.prod.yml logs backend
            exit 1
        fi
        sleep 2
    done
    
    # Check frontend health
    echo "Checking frontend health..."
    if curl -s http://localhost/ > /dev/null; then
        print_success "Frontend is accessible"
    else
        print_warning "Frontend may not be ready yet"
    fi
    
    echo ""
    print_success "Deployment completed successfully!"
    echo ""
    echo "📊 Service Status:"
    docker-compose -f docker-compose.prod.yml ps
    
    echo ""
    echo "🌐 Access URLs:"
    echo "  Frontend: http://localhost"
    echo "  Backend:  http://localhost:8080"
    echo "  Health:   http://localhost:8080/actuator/health"
    
    echo ""
    echo "📝 Useful commands:"
    echo "  View logs:    docker-compose -f docker-compose.prod.yml logs -f"
    echo "  Stop all:     docker-compose -f docker-compose.prod.yml down"
    echo "  Restart:      docker-compose -f docker-compose.prod.yml restart"
else
    echo ""
    print_success "Build completed. Manual deployment required."
    echo ""
    echo "📦 Build artifacts:"
    echo "  Backend:  backend/target/carbon-calculator-1.0.0.jar"
    echo "  Frontend: frontend/dist/"
    echo ""
    echo "📖 See DEPLOYMENT_GUIDE.md for manual deployment instructions"
fi

echo ""
echo "=================================================="
echo "🎉 Deployment script completed!"
