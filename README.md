# Carbon Calculator Application

A full-stack application for tracking and managing carbon footprint with marketplace features.

## Tech Stack

- **Backend**: Spring Boot 3.2.0 (Java 21 LTS)
- **Frontend**: React 18 + Vite + Tailwind CSS
- **Database**: MySQL 9.0.1
- **Authentication**: JWT

## Getting Started

### Prerequisites
- Java 21 (LTS)
- Maven 3.9+
- Node.js 18+
- MySQL 9.0+

### Recent Updates
- ✅ **December 2025**: Upgraded to Java 21 LTS using OpenRewrite migration tool
- ✅ Migrated from PostgreSQL to MySQL 9.0.1
- ✅ Marketplace feature with shopping cart implemented
- ✅ All dependencies updated and tested with Java 21
- ✅ Build and tests passing successfully

### Setup Instructions

#### 1. Database Setup
```bash
# MySQL should be running on port 3307
# Create database: carboncalc
# Username: root
# Password: @Sujal5412
```

#### 2. Backend
```bash
cd backend
mvn spring-boot:run
```
Backend will run on: http://localhost:8080

#### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend will run on: http://localhost:3000

## Features

- User Authentication & Authorization
- Carbon Footprint Surveys
- Carbon Logging & Tracking
- Goals & Achievements
- Marketplace for Carbon Credits
- Leaderboard & Badges
- Analytics Dashboard

## 🚀 Production Deployment

**Ready for production?** This project is fully configured for production deployment!

### Quick Deploy Options

#### Option 1: Vercel + Render (Recommended - Free Tier Available) ⭐
**Best for**: Quick deployment, free hosting, automatic scaling
```bash
# 15 minutes to deploy!
# Frontend → Vercel
# Backend → Render
# Database → PlanetScale (MySQL)
```
📖 **Guides**:
- [Quick Start (15 min)](QUICK_DEPLOY_VERCEL_RENDER.md) - Fast deployment guide
- [Complete Guide](DEPLOY_VERCEL_RENDER.md) - Detailed instructions
- [Summary](VERCEL_RENDER_SUMMARY.md) - Overview of setup

#### Option 2: Docker Compose (Self-Hosted)
**Best for**: Full control, on-premise deployment
```bash
# Windows
deploy.bat

# Linux/Mac
chmod +x deploy.sh
./deploy.sh
```

### Documentation
- 📖 [Production Ready Summary](PRODUCTION_READY_SUMMARY.md) - **START HERE** for overview of changes
- 🚀 [Quick Deploy Guide](QUICK_DEPLOY.md) - Quick reference for deployment
- 📚 [Deployment Guide](DEPLOYMENT_GUIDE.md) - Comprehensive deployment instructions
- 🔒 [Security Checklist](SECURITY_CHECKLIST.md) - Security best practices

### Key Features
- ✅ No hardcoded credentials (all environment variables)
- ✅ Docker containerization with multi-stage builds
- ✅ Production-optimized configurations
- ✅ Automated deployment scripts
- ✅ Complete security hardening
- ✅ Monitoring and health checks

## 📚 Additional Documentation

See the `/docs` folder for detailed API and architecture documentation.
