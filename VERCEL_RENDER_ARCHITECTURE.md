# 🏗️ Vercel + Render Deployment Architecture

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         USERS                               │
│                    (Web Browsers)                           │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ HTTPS
                     │
┌────────────────────▼────────────────────────────────────────┐
│                    VERCEL CDN                               │
│              (Global Edge Network)                          │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │     FRONTEND (React + Vite)                         │  │
│  │     • Static Assets                                 │  │
│  │     • SPA Routing                                   │  │
│  │     • Automatic HTTPS                               │  │
│  │     • Environment: VITE_API_URL                     │  │
│  └─────────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ API Calls (HTTPS)
                     │ Authorization: Bearer {JWT}
                     │
┌────────────────────▼────────────────────────────────────────┐
│                   RENDER.COM                                │
│             (Cloud Platform)                                │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │     BACKEND (Spring Boot + Java 21)                 │  │
│  │     • REST API                                      │  │
│  │     • JWT Authentication                            │  │
│  │     • Business Logic                                │  │
│  │     • Email Service                                 │  │
│  │     • Auto-scaling                                  │  │
│  │     • Health Checks: /actuator/health               │  │
│  └─────────────────┬───────────────────────────────────┘  │
└────────────────────┼────────────────────────────────────────┘
                     │
                     │ MySQL Connection (SSL)
                     │
┌────────────────────▼────────────────────────────────────────┐
│                 PLANETSCALE                                 │
│            (Managed MySQL Database)                         │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │     DATABASE (MySQL 8.0)                            │  │
│  │     • User Data                                     │  │
│  │     • Carbon Logs                                   │  │
│  │     • Marketplace Data                              │  │
│  │     • Automatic Backups                             │  │
│  │     • Connection Pooling                            │  │
│  └─────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘

                     │
                     │ External API Calls
                     │
┌────────────────────▼────────────────────────────────────────┐
│              EXTERNAL SERVICES                              │
│                                                             │
│  • Carbon Interface API (carbon calculations)               │
│  • Climatiq API (climate data)                              │
│  • Gmail SMTP (email notifications)                         │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Flow

### 1. User Registration/Login
```
User Browser
    │
    ├─→ POST /api/auth/register (Vercel → Render)
    │   └─→ Backend validates & creates user
    │       └─→ Store in PlanetScale
    │           └─→ Return JWT token
    │
    ├─→ Store JWT in localStorage
    │
    └─→ Subsequent requests include: Authorization: Bearer {JWT}
```

### 2. Carbon Logging
```
User Browser
    │
    ├─→ POST /api/carbon/log (with JWT)
    │   └─→ Backend validates JWT
    │       ├─→ Call Carbon Interface API
    │       ├─→ Calculate emissions
    │       ├─→ Store in PlanetScale
    │       └─→ Return results
    │
    └─→ Display in dashboard
```

### 3. Marketplace Purchase
```
User Browser
    │
    ├─→ POST /api/marketplace/orders (with JWT)
    │   └─→ Backend validates JWT
    │       ├─→ Check user balance
    │       ├─→ Create order in PlanetScale
    │       ├─→ Update inventory
    │       ├─→ Send confirmation email (Gmail)
    │       └─→ Return order details
    │
    └─→ Show success message
```

---

## Deployment Flow

### Initial Deployment
```
1. Local Development
   ├─→ git add .
   ├─→ git commit -m "Ready for deployment"
   └─→ git push origin main

2. Backend (Render)
   ├─→ Detects push to main branch
   ├─→ Runs: ./mvnw clean package -DskipTests
   ├─→ Creates JAR file
   ├─→ Starts: java -jar app.jar
   ├─→ Health check: /actuator/health
   └─→ Live at: https://carbon-calc-backend.onrender.com

3. Frontend (Vercel)
   ├─→ Detects push to main branch
   ├─→ Runs: npm run build
   ├─→ Deploys to CDN
   ├─→ Health check: GET /
   └─→ Live at: https://carbon-calc-frontend.vercel.app
```

### Continuous Deployment
```
Code Change
    │
    ├─→ git push
    │
    ├─→ Render Auto-Deploy (Backend)
    │   ├─→ Build (~5 min)
    │   ├─→ Zero-downtime deployment
    │   └─→ Rollback on failure
    │
    └─→ Vercel Auto-Deploy (Frontend)
        ├─→ Build (~2 min)
        ├─→ Atomic deployment
        └─→ Instant preview URLs for PRs
```

---

## Environment Configuration

### Development
```
Frontend (Local)
    ├─→ VITE_API_URL=http://localhost:8080
    └─→ Runs on: http://localhost:3000

Backend (Local)
    ├─→ DB_HOST=localhost
    ├─→ DB_PORT=3307
    └─→ Runs on: http://localhost:8080

Database (Local)
    └─→ MySQL on localhost:3307
```

### Production
```
Frontend (Vercel)
    ├─→ VITE_API_URL=https://carbon-calc-backend.onrender.com
    └─→ Deployed globally on CDN

Backend (Render)
    ├─→ DB_HOST=xxx.psdb.cloud
    ├─→ DB_PORT=3306
    ├─→ All secrets from environment variables
    └─→ Deployed in US/EU region

Database (PlanetScale)
    ├─→ Managed MySQL cluster
    ├─→ Automatic backups
    └─→ Global distribution
```

---

## Security Layers

```
┌─────────────────────────────────────────┐
│  Layer 1: Network Security              │
│  • Vercel: Automatic DDoS protection    │
│  • Render: Firewall + Rate limiting     │
│  • PlanetScale: VPC isolation           │
└─────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│  Layer 2: Transport Security            │
│  • HTTPS/TLS 1.3 everywhere             │
│  • Automatic SSL certificates           │
│  • HSTS enabled                         │
└─────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│  Layer 3: Application Security          │
│  • JWT authentication                   │
│  • CORS configured                      │
│  • Input validation                     │
│  • SQL injection protection (JPA)       │
└─────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│  Layer 4: Data Security                 │
│  • Passwords hashed (BCrypt)            │
│  • Database encrypted at rest           │
│  • Environment variables for secrets    │
│  • No credentials in code               │
└─────────────────────────────────────────┘
```

---

## Monitoring & Health

### Health Checks
```
Vercel Frontend
    └─→ GET / (every 30s)
        └─→ Returns 200 OK

Render Backend
    └─→ GET /actuator/health (every 30s)
        └─→ Returns {"status":"UP"}

PlanetScale Database
    └─→ Automatic monitoring
        └─→ Query performance metrics
```

### Logging
```
Frontend Errors
    └─→ Browser console
        └─→ (Can integrate Sentry)

Backend Logs
    └─→ Render Dashboard
        ├─→ Application logs
        ├─→ Build logs
        └─→ Event logs

Database Logs
    └─→ PlanetScale Dashboard
        ├─→ Query insights
        └─→ Slow query log
```

---

## Scaling Strategy

### Free Tier (Current)
```
Frontend (Vercel)
    ├─→ Global CDN (unlimited locations)
    ├─→ Automatic scaling
    └─→ 100GB bandwidth/month

Backend (Render)
    ├─→ 1 instance (512MB RAM)
    ├─→ Sleeps after 15 min inactive
    └─→ ~30s cold start

Database (PlanetScale)
    ├─→ 5GB storage
    ├─→ 1 billion row reads/month
    └─→ Automatic connection pooling
```

### Production Scale (Upgrade Path)
```
Frontend (Vercel Pro)
    ├─→ $20/month
    ├─→ 1TB bandwidth
    └─→ Advanced analytics

Backend (Render Starter)
    ├─→ $7/month
    ├─→ Always on (no sleep)
    └─→ 512MB-2GB RAM

Database (PlanetScale Scaler)
    ├─→ $29/month
    ├─→ 10GB storage
    └─→ Automatic backups
    
Total: ~$56/month for production
```

---

## Cost Breakdown

### Free Tier (Development)
```
Service          Plan        Cost      Limitations
───────────────────────────────────────────────────
Vercel          Hobby        $0       100GB/month
Render          Free         $0       Sleeps after 15min
PlanetScale     Hobby        $0       5GB storage
───────────────────────────────────────────────────
TOTAL                       $0/month
```

### Production (Paid)
```
Service          Plan        Cost      Benefits
───────────────────────────────────────────────────
Vercel          Pro         $20       1TB, analytics
Render          Starter      $7       Always on, faster
PlanetScale     Scaler      $29       10GB, backups
───────────────────────────────────────────────────
TOTAL                      $56/month
```

---

## Disaster Recovery

### Backup Strategy
```
Database (PlanetScale)
    ├─→ Automatic daily backups
    ├─→ Point-in-time recovery
    └─→ Retained for 7 days (free tier)

Code (GitHub)
    ├─→ Version control
    └─→ All commits preserved

Deployments
    ├─→ Vercel: All builds saved
    └─→ Render: Last 10 builds saved
```

### Rollback Plan
```
If deployment fails:

1. Frontend (Vercel)
   └─→ Dashboard → Deployments → Promote previous

2. Backend (Render)
   └─→ Dashboard → Deploy → Redeploy previous

3. Database (PlanetScale)
   └─→ Restore from backup
```

---

## Performance Optimization

### Frontend
```
✅ Code splitting (Vite)
✅ Lazy loading routes
✅ Asset optimization
✅ CDN caching
✅ Gzip compression
```

### Backend
```
✅ Connection pooling (HikariCP)
✅ JPA batch processing
✅ Efficient queries
✅ JWT caching
✅ HTTP/2 enabled
```

### Database
```
✅ Indexed columns
✅ Query optimization
✅ Connection pooling
✅ Read replicas (paid tier)
```

---

## Next Steps After Deployment

1. **Monitor Performance**
   - Set up uptime monitoring
   - Track response times
   - Monitor error rates

2. **Optimize Costs**
   - Review usage patterns
   - Optimize database queries
   - Consider caching strategy

3. **Enhance Security**
   - Enable 2FA on all accounts
   - Regular security audits
   - Keep dependencies updated

4. **Scale as Needed**
   - Upgrade when hitting limits
   - Add caching layer (Redis)
   - Consider CDN for assets

---

**Ready to deploy?** Start with [QUICK_DEPLOY_VERCEL_RENDER.md](QUICK_DEPLOY_VERCEL_RENDER.md)
