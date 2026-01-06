# 📋 Pre-Deployment Checklist

Use this checklist before deploying to production. Check off each item as you complete it.

---

## Environment Configuration

### Backend Environment (.env.production)
- [ ] File created from `.env.production.template`
- [ ] `DB_HOST` set to production database hostname
- [ ] `DB_PORT` set (default: 3306)
- [ ] `DB_NAME` set (default: carboncalc)
- [ ] `DB_USER` set to dedicated database user (not root)
- [ ] `DB_PASSWORD` set with strong password (20+ characters)
- [ ] `DB_ROOT_PASSWORD` set with strong password (if using Docker MySQL)
- [ ] `JWT_SECRET` generated with `openssl rand -base64 64`
- [ ] `JWT_EXPIRATION` set (default: 3600000 = 1 hour)
- [ ] `MAIL_HOST` configured (e.g., smtp.gmail.com)
- [ ] `MAIL_PORT` set (default: 587)
- [ ] `MAIL_USERNAME` set to production email
- [ ] `MAIL_PASSWORD` set to app-specific password
- [ ] `CARBON_INTERFACE_API_KEY` obtained and set
- [ ] `CLIMATIQ_API_KEY` obtained and set
- [ ] `DEFAULT_COUNTRY` set if different from US
- [ ] `DEFAULT_STATE` set if different from CA
- [ ] `.env.production` added to .gitignore (verify not in git)

### Frontend Environment (frontend/.env.production)
- [ ] File created from `frontend/.env.production.template`
- [ ] `VITE_API_URL` set to production backend URL (e.g., https://api.yourdomain.com)
- [ ] `VITE_APP_ENV` set to "production"
- [ ] Analytics/monitoring IDs configured (if applicable)
- [ ] `.env.production` added to .gitignore (verify not in git)

---

## Security Review

### Code Security
- [ ] No hardcoded passwords in code
- [ ] No hardcoded API keys in code
- [ ] No test/debug credentials in code
- [ ] All sensitive config uses environment variables
- [ ] Git history doesn't contain exposed secrets

### Application Security
- [ ] JWT secret is strong (256+ bits)
- [ ] Database passwords are strong (20+ characters)
- [ ] SSL/TLS configured for production
- [ ] CORS configured for your domain only
- [ ] Security headers configured in nginx.conf
- [ ] Content-Security-Policy updated with your domain
- [ ] Actuator endpoints secured (when-authorized)
- [ ] Error messages don't expose sensitive info
- [ ] Input validation on all endpoints
- [ ] SQL injection protection (JPA parameterized queries)

### Infrastructure Security
- [ ] Firewall rules configured
- [ ] Database not exposed to internet
- [ ] SSH keys configured (if manual deployment)
- [ ] SSL certificates obtained and configured
- [ ] Non-root users for Docker containers
- [ ] Database backups encrypted

---

## Database Setup

### MySQL Configuration
- [ ] Database server running
- [ ] Database created (carboncalc)
- [ ] Dedicated user created (not root)
- [ ] User has appropriate permissions only
- [ ] Connection from backend server verified
- [ ] SSL/TLS enabled if required
- [ ] Backup strategy configured
- [ ] Backup restore tested

### Data Migration (if applicable)
- [ ] Flyway migrations reviewed
- [ ] Test data removed
- [ ] Production data migrated
- [ ] Migration rollback plan created

---

## Build & Test

### Backend
- [ ] Project builds successfully: `./mvnw clean package`
- [ ] All tests pass: `./mvnw test`
- [ ] No compilation errors or warnings
- [ ] Dependencies up to date: `./mvnw versions:display-dependency-updates`
- [ ] Security vulnerabilities checked
- [ ] JAR file created in target/

### Frontend
- [ ] Dependencies installed: `npm install`
- [ ] Project builds successfully: `npm run build:prod`
- [ ] No build errors or warnings
- [ ] Dependencies audited: `npm audit`
- [ ] Security vulnerabilities fixed
- [ ] dist/ folder created with optimized files

---

## Docker Configuration (if using Docker)

### Docker Images
- [ ] Backend Dockerfile reviewed
- [ ] Frontend Dockerfile reviewed
- [ ] nginx.conf updated with your domain
- [ ] docker-compose.prod.yml reviewed
- [ ] Resource limits configured appropriately
- [ ] Images build successfully
- [ ] Images scanned for vulnerabilities: `docker scan <image>`

### Docker Environment
- [ ] Docker installed and running
- [ ] Docker Compose installed
- [ ] Sufficient disk space available
- [ ] Sufficient memory available
- [ ] Volumes configured for data persistence
- [ ] Network configuration verified

---

## Monitoring & Logging

### Health Checks
- [ ] Backend health endpoint working: `/actuator/health`
- [ ] Frontend accessible
- [ ] Database connection verified
- [ ] External API connections verified

### Logging
- [ ] Log directory configured and writable
- [ ] Log rotation configured
- [ ] Log level set appropriately (INFO/WARN)
- [ ] No sensitive data logged
- [ ] Log aggregation configured (if applicable)

### Monitoring
- [ ] Prometheus metrics enabled
- [ ] Health check endpoints configured
- [ ] Alerting configured
- [ ] Resource monitoring setup
- [ ] Error tracking configured (e.g., Sentry)

---

## Backup & Recovery

### Backup Strategy
- [ ] Database backup automated
- [ ] Backup schedule configured (daily minimum)
- [ ] Backup retention policy set
- [ ] Backups stored securely off-site
- [ ] Backup encryption configured

### Recovery Testing
- [ ] Backup restore tested successfully
- [ ] Recovery time objective (RTO) documented
- [ ] Recovery point objective (RPO) documented
- [ ] Disaster recovery plan documented

---

## Documentation

### Required Documentation
- [ ] README.md updated
- [ ] Deployment guide reviewed
- [ ] Security checklist reviewed
- [ ] API documentation current
- [ ] Architecture diagrams current

### Team Knowledge
- [ ] Team trained on deployment process
- [ ] Access credentials documented securely
- [ ] Runbook created for common operations
- [ ] Incident response plan documented
- [ ] On-call rotation established (if applicable)

---

## Performance

### Load Testing
- [ ] Expected load estimated
- [ ] Load testing performed
- [ ] Performance bottlenecks identified
- [ ] Database queries optimized
- [ ] Caching strategy implemented

### Resource Planning
- [ ] CPU requirements estimated
- [ ] Memory requirements estimated
- [ ] Storage requirements estimated
- [ ] Network bandwidth estimated
- [ ] Scaling strategy defined

---

## Legal & Compliance

### Compliance
- [ ] Privacy policy created
- [ ] Terms of service created
- [ ] GDPR compliance reviewed (if applicable)
- [ ] Data retention policy defined
- [ ] Cookie policy created (if applicable)

### Licensing
- [ ] All dependencies licenses reviewed
- [ ] Third-party API terms accepted
- [ ] Software licenses compliant

---

## Deployment

### Pre-Deployment
- [ ] Deployment window scheduled
- [ ] Stakeholders notified
- [ ] Rollback plan prepared
- [ ] Backup created immediately before deployment
- [ ] Maintenance mode enabled (if applicable)

### Deployment Execution
- [ ] Deployment script tested in staging
- [ ] Environment variables loaded
- [ ] Services started in correct order
- [ ] Health checks verified
- [ ] Smoke tests passed

### Post-Deployment
- [ ] All services running
- [ ] Logs checked for errors
- [ ] User acceptance testing performed
- [ ] Performance monitoring active
- [ ] Stakeholders notified of completion

---

## Final Verification

### Functionality Testing
- [ ] User registration works
- [ ] User login works
- [ ] Password reset works
- [ ] Email sending works
- [ ] API endpoints responding
- [ ] Database operations working
- [ ] File uploads working (if applicable)
- [ ] All critical features tested

### Security Testing
- [ ] HTTPS enforced
- [ ] Security headers present
- [ ] CORS working correctly
- [ ] Authentication working
- [ ] Authorization working
- [ ] No sensitive data exposed

### Performance Verification
- [ ] Response times acceptable
- [ ] No memory leaks
- [ ] Database connection pool stable
- [ ] Resource usage within limits

---

## Sign-Off

### Approvals Required
- [ ] Development lead approval
- [ ] Security review approval
- [ ] Operations/DevOps approval
- [ ] Business stakeholder approval

### Documentation
**Deployment Date**: _______________  
**Deployed By**: _______________  
**Version**: _______________  
**Environment**: Production  

**Notes**:
_________________________________
_________________________________
_________________________________

---

## Emergency Contacts

**On-Call Engineer**: _______________  
**Database Admin**: _______________  
**Security Team**: _______________  
**Management**: _______________  

---

## Quick Rollback (If Needed)

If deployment fails:
```bash
# Stop containers
docker-compose -f docker-compose.prod.yml down

# Restore database
docker exec -i carbon-calc-db-prod mysql -u root -p${DB_ROOT_PASSWORD} carboncalc < backup/pre-deployment-backup.sql

# Deploy previous version
git checkout <previous-tag>
docker-compose -f docker-compose.prod.yml up -d
```

---

**Remember**: It's better to delay deployment than to rush and create issues!

When in doubt, consult:
- [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
- [SECURITY_CHECKLIST.md](SECURITY_CHECKLIST.md)
- Your team lead or senior engineer
