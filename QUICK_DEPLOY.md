# 🚀 Quick Production Deployment Reference

## Pre-Deployment (15 minutes)

### 1. Environment Setup
```bash
# Copy environment templates
cp .env.production.template .env.production
cd frontend && cp .env.production.template .env.production && cd ..

# Generate JWT secret
openssl rand -base64 64

# Edit .env.production with actual values
nano .env.production
```

### 2. Security Review
```bash
# Verify no hardcoded secrets
grep -r "password\|secret\|api.*key" --include="*.yml" --include="*.properties" backend/src/
```

---

## Docker Deployment (Fastest - 5 minutes)

### Start Production Environment
```bash
# Load environment variables
source .env.production

# Build and start
docker-compose -f docker-compose.prod.yml up -d

# Check status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

### Health Checks
```bash
# Backend health
curl http://localhost:8080/actuator/health

# Frontend health
curl http://localhost
```

---

## Manual Deployment (Traditional)

### Backend
```bash
cd backend
./mvnw clean package -DskipTests
java -jar -Dspring.profiles.active=prod target/carbon-calculator-1.0.0.jar
```

### Frontend
```bash
cd frontend
npm install --production
npm run build:prod
# Copy dist/ to your web server
```

---

## Common Commands

### Docker Management
```bash
# Stop all services
docker-compose -f docker-compose.prod.yml down

# Restart a specific service
docker-compose -f docker-compose.prod.yml restart backend

# View logs for specific service
docker-compose -f docker-compose.prod.yml logs -f backend

# Execute command in container
docker exec -it carbon-calc-backend-prod bash
```

### Database Backup
```bash
# Create backup
docker exec carbon-calc-db-prod mysqldump -u root -p${DB_ROOT_PASSWORD} carboncalc > backup_$(date +%Y%m%d).sql

# Restore backup
docker exec -i carbon-calc-db-prod mysql -u root -p${DB_ROOT_PASSWORD} carboncalc < backup.sql
```

### Monitoring
```bash
# Resource usage
docker stats

# Application metrics
curl http://localhost:8080/actuator/prometheus

# Application info
curl http://localhost:8080/actuator/info
```

---

## Troubleshooting Quick Fixes

### Container won't start
```bash
docker-compose -f docker-compose.prod.yml logs backend
docker-compose -f docker-compose.prod.yml restart backend
```

### Database connection issues
```bash
# Test connection
docker exec -it carbon-calc-backend-prod ping mysql

# Check MySQL status
docker-compose -f docker-compose.prod.yml ps mysql
```

### Clear and restart everything
```bash
docker-compose -f docker-compose.prod.yml down -v
docker-compose -f docker-compose.prod.yml up -d
```

---

## Environment Variables Reference

### Required Variables
```bash
# Database
DB_NAME=carboncalc
DB_USER=carboncalc_user
DB_PASSWORD=<strong-password>
DB_ROOT_PASSWORD=<strong-password>

# JWT
JWT_SECRET=<256-bit-secret>
JWT_EXPIRATION=3600000

# Email
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=<email>
MAIL_PASSWORD=<app-password>

# API Keys
CARBON_INTERFACE_API_KEY=<key>
CLIMATIQ_API_KEY=<key>

# Frontend
VITE_API_URL=https://api.yourdomain.com
```

---

## Performance Tuning

### Backend JVM Settings
```bash
# In docker-compose.prod.yml
JAVA_OPTS: "-Xms512m -Xmx2g -XX:+UseG1GC"
```

### Database Optimization
```sql
-- Check connections
SHOW STATUS LIKE 'Threads_connected';

-- Check slow queries
SHOW STATUS LIKE 'Slow_queries';
```

---

## Security Quick Checks

```bash
# Check for exposed secrets
git secrets --scan

# Scan Docker images
docker scan carbon-calc-backend:latest

# Check dependencies
cd backend && ./mvnw versions:display-dependency-updates
cd frontend && npm audit
```

---

## URLs

### Local Development
- Frontend: http://localhost:3000
- Backend: http://localhost:8080
- Actuator: http://localhost:8080/actuator

### Production
- Frontend: https://yourdomain.com
- Backend API: https://api.yourdomain.com
- Health: https://api.yourdomain.com/actuator/health

---

## Support

📖 Full Documentation: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)  
🔒 Security Checklist: [SECURITY_CHECKLIST.md](SECURITY_CHECKLIST.md)  
📝 Main README: [README.md](README.md)
