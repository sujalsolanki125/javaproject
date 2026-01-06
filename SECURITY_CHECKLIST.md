# Security Configuration Checklist for Production

## 🔒 Critical Security Items

### 1. Environment Variables & Secrets

#### Backend (.env.production)
```bash
# ✅ Strong JWT Secret (minimum 256 bits)
JWT_SECRET=<generate-with-openssl-rand-base64-64>

# ✅ Strong Database Password
DB_PASSWORD=<use-password-manager-to-generate>

# ✅ Secure Email Credentials
MAIL_PASSWORD=<use-app-specific-password>

# ✅ API Keys from Secure Storage
CARBON_INTERFACE_API_KEY=<from-api-provider>
CLIMATIQ_API_KEY=<from-api-provider>
```

**Action Items**:
- [ ] Generate strong JWT secret using: `openssl rand -base64 64`
- [ ] Use password manager for all passwords (minimum 20 characters)
- [ ] Store API keys in secure vault (e.g., AWS Secrets Manager, Azure Key Vault)
- [ ] Never commit .env.production to version control
- [ ] Rotate secrets every 90 days

### 2. Database Security

**MySQL Configuration**:
- [ ] Use SSL/TLS for database connections
- [ ] Create dedicated database user (not root)
- [ ] Grant minimum required privileges
- [ ] Enable audit logging
- [ ] Configure firewall rules (allow only backend server)
- [ ] Regular backups encrypted at rest

**application-prod.yml Settings**:
```yaml
spring:
  datasource:
    url: jdbc:mysql://${DB_HOST}:3306/${DB_NAME}?useSSL=true&requireSSL=true
```

### 3. Application Security

#### Spring Security Configuration
- [ ] CORS configured for specific domains only
- [ ] CSRF protection enabled
- [ ] Session management secure
- [ ] Password encoding with BCrypt (strength 12+)
- [ ] Rate limiting implemented
- [ ] Input validation on all endpoints

#### Actuator Endpoints
```yaml
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus  # Limited set
  endpoint:
    health:
      show-details: when-authorized  # Hide details from public
```

**Action Items**:
- [ ] Restrict actuator endpoints to internal network
- [ ] Add authentication for sensitive endpoints
- [ ] Disable unused endpoints

### 4. Network Security

#### Frontend (nginx.conf)
```nginx
# Security Headers
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Content-Security-Policy "default-src 'self';" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

**Action Items**:
- [ ] Configure SSL/TLS certificates (Let's Encrypt recommended)
- [ ] Use TLS 1.2 or higher only
- [ ] Disable weak cipher suites
- [ ] Implement HSTS
- [ ] Configure CSP for your domain

#### Firewall Rules
- [ ] Allow port 443 (HTTPS) only for frontend
- [ ] Allow port 8080 only from frontend/load balancer
- [ ] Allow port 3306 only from backend
- [ ] Block all other incoming traffic
- [ ] Configure VPC/Security Groups properly

### 5. Docker Security

**Image Security**:
- [ ] Use official base images only
- [ ] Scan images for vulnerabilities
- [ ] Run containers as non-root user (already configured)
- [ ] Keep base images updated
- [ ] Remove unnecessary packages

**Container Runtime**:
```yaml
deploy:
  resources:
    limits:
      cpus: '2'
      memory: 2G
```

**Action Items**:
- [ ] Set resource limits
- [ ] Use read-only file systems where possible
- [ ] Enable Docker Content Trust
- [ ] Regular security scans: `docker scan carbon-calc-backend`

### 6. Logging & Monitoring

**What to Log**:
- ✅ Authentication attempts (success/failure)
- ✅ Authorization failures
- ✅ Input validation failures
- ✅ API errors and exceptions
- ❌ DO NOT log passwords, tokens, or sensitive data

**Log Configuration**:
```yaml
logging:
  level:
    root: WARN
    com.carboncalc: INFO
    org.springframework.security: WARN  # Not DEBUG in production
```

**Action Items**:
- [ ] Configure centralized logging (ELK, CloudWatch, etc.)
- [ ] Set up security alerts
- [ ] Regular log review
- [ ] Log retention policy (90+ days)
- [ ] Encrypt logs at rest

### 7. Authentication & Authorization

**JWT Security**:
- [ ] Use strong secret (256+ bits)
- [ ] Short token expiration (1 hour recommended)
- [ ] Implement refresh tokens
- [ ] Token blacklist for logout
- [ ] Validate token signature on every request

**Password Policy**:
- [ ] Minimum 8 characters
- [ ] Require complexity (upper, lower, number, special)
- [ ] Password history (prevent reuse)
- [ ] Account lockout after failed attempts
- [ ] Password reset with email verification

### 8. External APIs

**API Key Management**:
- [ ] Store API keys as environment variables
- [ ] Rotate keys regularly
- [ ] Monitor API usage and set alerts
- [ ] Use API key restrictions (IP allowlisting)
- [ ] Implement retry with exponential backoff

**Rate Limiting**:
```java
// Implement rate limiting for external API calls
// Prevent abuse and API quota exhaustion
```

### 9. Dependency Security

**Regular Updates**:
```bash
# Backend
./mvnw versions:display-dependency-updates

# Frontend
npm audit
npm audit fix
```

**Action Items**:
- [ ] Keep all dependencies updated
- [ ] Review security advisories
- [ ] Use Dependabot or Snyk
- [ ] Test updates in staging first
- [ ] Document known vulnerabilities and mitigations

### 10. Backup & Recovery

**Backup Strategy**:
- [ ] Daily automated database backups
- [ ] Backup encryption at rest
- [ ] Off-site backup storage
- [ ] Test restore procedures monthly
- [ ] Document recovery procedures

**Backup Script**:
```bash
#!/bin/bash
# Encrypt backup with GPG
mysqldump carboncalc | gpg --encrypt --recipient backup@yourdomain.com > backup.sql.gpg
```

---

## 🚨 Security Incident Response

### If Security Breach Occurs:

1. **Immediate Actions**:
   - Isolate affected systems
   - Change all credentials
   - Review access logs
   - Notify stakeholders

2. **Investigation**:
   - Determine scope of breach
   - Identify attack vector
   - Document findings

3. **Remediation**:
   - Patch vulnerabilities
   - Update security controls
   - Restore from clean backup if needed

4. **Post-Incident**:
   - Conduct post-mortem
   - Update security procedures
   - Additional training if needed

---

## 📝 Security Audit Checklist

### Monthly
- [ ] Review user access and permissions
- [ ] Check for failed login attempts
- [ ] Review application logs for anomalies
- [ ] Update dependencies with security patches
- [ ] Verify backup integrity

### Quarterly
- [ ] Penetration testing
- [ ] Code security review
- [ ] Dependency audit
- [ ] Certificate renewal check
- [ ] Disaster recovery drill

### Annually
- [ ] Full security audit
- [ ] Update security policies
- [ ] Staff security training
- [ ] Compliance review
- [ ] Update incident response plan

---

## 🛠️ Security Tools

### Recommended Tools
- **Dependency Scanning**: OWASP Dependency-Check, Snyk
- **Code Analysis**: SonarQube, Checkmarx
- **Container Scanning**: Trivy, Clair
- **Secret Scanning**: GitGuardian, TruffleHog
- **Monitoring**: Prometheus, Grafana, ELK Stack

### Quick Security Scan
```bash
# Backend
./mvnw org.owasp:dependency-check-maven:check

# Frontend
npm audit

# Docker
docker scan carbon-calc-backend:latest
```

---

## ✅ Production Deployment Security Sign-Off

Before deploying to production, verify:

- [ ] All items in this checklist reviewed
- [ ] Security testing completed
- [ ] Penetration testing passed
- [ ] All credentials secured
- [ ] Monitoring and alerting configured
- [ ] Backup and recovery tested
- [ ] Incident response plan documented
- [ ] Team trained on security procedures

**Approved by**: ________________  
**Date**: ________________  
**Next Review**: ________________

---

**Remember**: Security is an ongoing process, not a one-time task!
