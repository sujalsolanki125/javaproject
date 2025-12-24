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

## Documentation

See the `/docs` folder for detailed documentation.
