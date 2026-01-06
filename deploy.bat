@echo off
REM Production Deployment Script for Carbon Calculator (Windows)
REM This script automates the production deployment process

echo ========================================
echo Carbon Calculator - Production Deployment
echo ========================================
echo.

REM Check if .env.production exists
if not exist ".env.production" (
    echo [ERROR] .env.production file not found!
    echo Please create .env.production from .env.production.template
    exit /b 1
)

echo [OK] .env.production file found
echo.

REM Build backend
echo Building backend...
cd backend
call mvnw.cmd clean package -DskipTests -q
if errorlevel 1 (
    echo [ERROR] Backend build failed
    exit /b 1
)
echo [OK] Backend build successful
cd ..
echo.

REM Build frontend
echo Building frontend...
cd frontend

if not exist ".env.production" (
    echo [WARNING] frontend/.env.production not found
    copy .env.production.template .env.production
    echo Please edit frontend/.env.production with your backend URL
)

call npm install --production
call npm run build:prod
if errorlevel 1 (
    echo [ERROR] Frontend build failed
    exit /b 1
)
echo [OK] Frontend build successful
cd ..
echo.

REM Ask for Docker deployment
set /p DOCKER_DEPLOY="Deploy using Docker? (y/n): "

if /i "%DOCKER_DEPLOY%"=="y" (
    echo.
    echo Building Docker images...
    docker-compose -f docker-compose.prod.yml build
    
    if errorlevel 1 (
        echo [ERROR] Docker build failed
        exit /b 1
    )
    
    echo [OK] Docker images built successfully
    echo.
    
    echo Starting containers...
    docker-compose -f docker-compose.prod.yml up -d
    
    if errorlevel 1 (
        echo [ERROR] Failed to start containers
        exit /b 1
    )
    
    echo [OK] Containers started successfully
    echo.
    
    echo Waiting for services to start...
    timeout /t 10 /nobreak >nul
    
    echo.
    echo [SUCCESS] Deployment completed!
    echo.
    echo Service Status:
    docker-compose -f docker-compose.prod.yml ps
    echo.
    echo Access URLs:
    echo   Frontend: http://localhost
    echo   Backend:  http://localhost:8080
    echo   Health:   http://localhost:8080/actuator/health
    echo.
    echo Useful commands:
    echo   View logs:    docker-compose -f docker-compose.prod.yml logs -f
    echo   Stop all:     docker-compose -f docker-compose.prod.yml down
    echo   Restart:      docker-compose -f docker-compose.prod.yml restart
) else (
    echo.
    echo [OK] Build completed. Manual deployment required.
    echo.
    echo Build artifacts:
    echo   Backend:  backend\target\carbon-calculator-1.0.0.jar
    echo   Frontend: frontend\dist\
    echo.
    echo See DEPLOYMENT_GUIDE.md for manual deployment instructions
)

echo.
echo ========================================
echo Deployment script completed!
echo ========================================
