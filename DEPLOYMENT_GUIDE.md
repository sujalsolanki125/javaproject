# Production Deployment Guide

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Deployment Options](#deployment-options)
4. [Security Checklist](#security-checklist)
5. [Monitoring & Maintenance](#monitoring--maintenance)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### System Requirements
- **Java**: JDK 21 or higher
- **Node.js**: v18 or higher
- **MySQL**: 8.0 or higher
- **Docker**: 20.10+ (for containerized deployment)
- **Docker Compose**: 2.0+ (for containerized deployment)

### Required Accounts & API Keys
- Gmail/SMTP account for email functionality
- Carbon Interface API key
- Climatiq API key

---

## Environment Setup

### 1. Clone and Setup

```bash
git clone <your-repository-url>
cd carbon-calc
```

### 2. Configure Backend Environment

Copy the production environment template:

```bash
cp .env.production.template .env.production
```

Edit `.env.production` and fill in all required values:

```bash
# Generate a strong JWT secret (minimum 256 bits)
openssl rand -base64 64

# Update database credentials
# Update email credentials
# Update API keys
```

**⚠️ CRITICAL**: Never commit `.env.production` to version control!

### 3. Configure Frontend Environment

Copy the frontend production environment template:

```bash
cd frontend
cp .env.production.template .env.production
```

Update `VITE_API_URL` with your production backend URL:

```
VITE_API_URL=https://api.yourdomain.com
```

### 4. Update Security Settings

**Backend Security**:
- Update [application-prod.yml](backend/src/main/resources/application-prod.yml)
- Enable SSL/TLS for database connections
- Configure CORS for your domain
- Review actuator endpoints exposure

**Frontend Security**:
- Update [nginx.conf](frontend/nginx.conf) Content-Security-Policy header with your domain
- Configure SSL certificates

---

## Deployment Options

### Option 1: Docker Compose (Recommended)

**Development/Testing**:
```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

**Production**:
```bash
# Load production environment variables
source .env.production

# Build and start with production config
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop services
docker-compose -f docker-compose.prod.yml down
```

### Option 2: Manual Deployment

#### Backend Deployment

1. **Build the application**:
```bash
cd backend
./mvnw clean package -DskipTests -Pprod
```

2. **Run database migrations** (if Flyway is enabled):
```bash
./mvnw flyway:migrate
```

3. **Start the application**:
```bash
java -jar -Dspring.profiles.active=prod target/carbon-calculator-1.0.0.jar
```

Or as a service (Linux):
```bash
sudo systemctl start carbon-calc-backend
```

#### Frontend Deployment

1. **Build the application**:
```bash
cd frontend
npm install --production
npm run build:prod
```

2. **Deploy to web server**:
```bash
# Copy dist folder to nginx/apache document root
sudo cp -r dist/* /var/www/html/carbon-calc/

# Or use the provided nginx.conf
sudo cp nginx.conf /etc/nginx/sites-available/carbon-calc
sudo ln -s /etc/nginx/sites-available/carbon-calc /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Option 3: Cloud Deployment

#### AWS Deployment
- Use **EC2** for manual deployment
- Use **ECS/Fargate** for Docker containers
- Use **RDS** for MySQL database
- Use **CloudFront** for frontend CDN

#### Azure Deployment
- Use **Azure App Service** for backend
- Use **Azure Static Web Apps** for frontend
- Use **Azure Database for MySQL** for database

#### Google Cloud Deployment
- Use **Cloud Run** for containers
- Use **Cloud SQL** for MySQL
- Use **Cloud CDN** for frontend

---

## Security Checklist

### Before Production Deployment

- [ ] All hardcoded credentials removed
- [ ] `.env.production` configured with strong passwords
- [ ] JWT secret is at least 256 bits (64 characters base64)
- [ ] Database passwords are strong and unique
- [ ] SSL/TLS enabled for all connections
- [ ] CORS configured for your domain only
- [ ] Security headers configured in nginx
- [ ] Actuator endpoints secured (show-details: when-authorized)
- [ ] Production logging configured (no DEBUG in production)
- [ ] Error messages don't expose sensitive information
- [ ] Database backups scheduled
- [ ] Firewall rules configured
- [ ] API keys for external services secured

### Application Security

```bash
# 1. Remove all test/demo credentials
# 2. Enable HTTPS only
# 3. Configure rate limiting
# 4. Enable CSRF protection
# 5. Sanitize user inputs
# 6. Use prepared statements (already implemented with JPA)
```

---

## Monitoring & Maintenance

### Health Checks

**Backend**:
```bash
curl https://api.yourdomain.com/actuator/health
```

**Frontend**:
```bash
curl https://yourdomain.com/
```

### Prometheus Metrics

Access metrics at: `https://api.yourdomain.com/actuator/prometheus`

Configure Prometheus to scrape this endpoint.

### Logging

**Backend Logs Location**:
- Container: `/var/log/carbon-calc/carbon-calc.log`
- Host: `./backend/logs/carbon-calc.log`

**View Logs**:
```bash
# Docker
docker-compose logs -f backend

# Direct
tail -f /var/log/carbon-calc/carbon-calc.log
```

### Database Backup

**Automated Backup Script**:
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
docker exec carbon-calc-db-prod mysqldump -u root -p${DB_ROOT_PASSWORD} carboncalc > backup/carboncalc_$DATE.sql
find backup/ -name "*.sql" -mtime +30 -delete
```

Add to crontab:
```bash
0 2 * * * /path/to/backup-script.sh
```

### Performance Monitoring

1. **Database Performance**:
```sql
SHOW PROCESSLIST;
SHOW STATUS LIKE 'Threads_connected';
SHOW STATUS LIKE 'Slow_queries';
```

2. **Application Metrics**:
- Monitor JVM memory usage via actuator
- Track response times
- Monitor error rates

3. **Resource Usage**:
```bash
docker stats
```

---

## Troubleshooting

### Common Issues

#### 1. Database Connection Failed

**Symptoms**: Backend fails to start with database connection errors

**Solutions**:
```bash
# Check MySQL is running
docker-compose ps mysql

# Check connection from backend container
docker exec -it carbon-calc-backend ping mysql

# Verify credentials
docker exec -it carbon-calc-db mysql -u${DB_USER} -p${DB_PASSWORD}
```

#### 2. JWT Authentication Issues

**Symptoms**: Login fails or tokens expire immediately

**Solutions**:
- Verify JWT_SECRET is set and matches across deployments
- Check JWT_EXPIRATION value (in milliseconds)
- Clear browser localStorage and retry

#### 3. CORS Errors

**Symptoms**: Frontend can't access backend API

**Solutions**:
- Update CORS configuration in Spring Security
- Verify frontend is using correct VITE_API_URL
- Check browser console for exact error

#### 4. Frontend 404 on Refresh

**Symptoms**: Page works initially but 404 on refresh

**Solutions**:
- Verify nginx.conf has `try_files $uri $uri/ /index.html;`
- Restart nginx: `sudo systemctl restart nginx`

#### 5. High Memory Usage

**Symptoms**: Application crashes or becomes slow

**Solutions**:
```bash
# Adjust JVM memory in docker-compose.prod.yml
JAVA_OPTS: "-Xms512m -Xmx2g"

# Monitor memory
docker stats carbon-calc-backend-prod
```

### Getting Help

- Check application logs first
- Review actuator health endpoint
- Verify environment variables are set correctly
- Check Docker container status: `docker-compose ps`

---

## Rollback Procedure

If deployment fails:

1. **Stop new deployment**:
```bash
docker-compose -f docker-compose.prod.yml down
```

2. **Restore database backup**:
```bash
docker exec -i carbon-calc-db-prod mysql -u root -p${DB_ROOT_PASSWORD} carboncalc < backup/latest_backup.sql
```

3. **Redeploy previous version**:
```bash
git checkout <previous-tag>
docker-compose -f docker-compose.prod.yml up -d
```

---

## Performance Optimization

### Database Optimization
- Enable query caching
- Add indexes for frequently queried columns
- Use connection pooling (configured in application-prod.yml)

### Backend Optimization
- Enable JPA batch processing (configured)
- Use caching for static data
- Configure appropriate JVM memory settings

### Frontend Optimization
- Enable gzip compression (configured in nginx)
- Use CDN for static assets
- Enable browser caching (configured)

---

## Post-Deployment Checklist

- [ ] Application is accessible
- [ ] Health checks passing
- [ ] Can create new user account
- [ ] Can login successfully
- [ ] Email functionality working
- [ ] Database connections stable
- [ ] Logs are being written
- [ ] Metrics endpoint accessible
- [ ] SSL certificate valid
- [ ] Backup job scheduled
- [ ] Monitoring alerts configured

---

## Support

For issues or questions:
1. Check this documentation
2. Review application logs
3. Check GitHub issues
4. Contact the development team

---

**Last Updated**: January 2026
**Version**: 1.0.0
