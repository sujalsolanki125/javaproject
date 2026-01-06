# Vercel + Render Deployment - Summary

## ✅ Files Created

### Configuration Files
1. **frontend/vercel.json** - Vercel deployment configuration
   - SPA routing configured
   - Security headers included
   - Cache settings optimized

2. **backend/render.yaml** - Render deployment configuration (optional, can use dashboard)
   - Service definition
   - Database configuration
   - Environment variables template

3. **backend/Procfile** - Process file for Render
   - Defines how to start the backend application

4. **backend/.buildpacks** - Build pack configuration
   - Specifies Java buildpack

### Documentation
5. **DEPLOY_VERCEL_RENDER.md** - Complete deployment guide
   - Step-by-step instructions for both platforms
   - Environment variable reference
   - Troubleshooting guide
   - Custom domain setup

6. **QUICK_DEPLOY_VERCEL_RENDER.md** - Quick start guide
   - 15-minute deployment walkthrough
   - Quick checklist
   - Common issues and solutions

---

## 🔧 Code Changes

### Backend - CORS Configuration Updated
**File**: `backend/src/main/java/com/carboncalc/config/SecurityConfigEnhanced.java`

**Changed**: CORS now supports environment variable configuration
```java
// Now reads from ALLOWED_ORIGINS environment variable
// Format: "https://yourapp.vercel.app,https://custom-domain.com"
```

This allows you to add Vercel URLs without code changes!

---

## 🚀 Quick Deployment Steps

### 1. Prepare Database (PlanetScale Recommended)
```bash
# Sign up at planetscale.com
# Create database: carbon-calc
# Get connection credentials
```

### 2. Deploy Backend (Render)
```
1. Go to render.com → New Web Service
2. Connect GitHub repo
3. Configure:
   - Root: backend
   - Build: ./mvnw clean package -DskipTests
   - Start: java -jar -Dserver.port=$PORT -Dspring.profiles.active=prod target/carbon-calculator-1.0.0.jar
4. Add environment variables (see guide)
5. Deploy!
```

### 3. Deploy Frontend (Vercel)
```bash
cd frontend
npm install -g vercel
vercel login
vercel --prod
# Enter backend URL when prompted for VITE_API_URL
```

### 4. Configure CORS
```
Add to Render environment variables:
ALLOWED_ORIGINS=https://your-app.vercel.app

Render will auto-redeploy
```

---

## 🔑 Required Environment Variables

### Backend (Render) - 13 variables
```
SPRING_PROFILES_ACTIVE=prod
DB_HOST=<planetscale-host>
DB_PORT=3306
DB_NAME=carboncalc
DB_USER=<username>
DB_PASSWORD=<password>
JWT_SECRET=<openssl rand -base64 64>
JWT_EXPIRATION=3600000
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=<your-email@gmail.com>
MAIL_PASSWORD=<gmail-app-password>
CARBON_INTERFACE_API_KEY=<key>
CLIMATIQ_API_KEY=<key>
ALLOWED_ORIGINS=https://your-app.vercel.app
```

### Frontend (Vercel) - 1 variable
```
VITE_API_URL=https://carbon-calc-backend.onrender.com
```

---

## 💰 Pricing (Free Tier)

| Service | Free Tier | Limitations |
|---------|-----------|-------------|
| **Render** | 750 hours/month | Sleeps after 15 min inactive |
| **Vercel** | 100GB bandwidth | Unlimited sites |
| **PlanetScale** | 5GB storage | 1 database |
| **Total** | **$0/month** | Perfect for development/testing |

---

## 📋 Deployment Checklist

- [ ] GitHub repository pushed
- [ ] PlanetScale database created
- [ ] Database credentials saved
- [ ] JWT secret generated (`openssl rand -base64 64`)
- [ ] Gmail app password created
- [ ] API keys obtained
- [ ] Backend deployed to Render
- [ ] Backend health check passing
- [ ] Frontend deployed to Vercel
- [ ] CORS environment variable set
- [ ] Test registration working
- [ ] Test login working
- [ ] Test API calls working

---

## 🆘 Common Issues & Solutions

### "CORS Error"
**Solution**: Add Vercel URL to `ALLOWED_ORIGINS` in Render environment variables:
```
ALLOWED_ORIGINS=http://localhost:3000,https://your-app.vercel.app
```

### "Backend Slow to Respond"
**Cause**: Render free tier sleeps after 15 minutes

**Solutions**:
1. Keep warm with [cron-job.org](https://cron-job.org) (ping every 10 min)
2. Upgrade to Render Starter ($7/month)

### "Database Connection Failed"
**Check**:
1. Verify all DB_ environment variables in Render
2. Check PlanetScale database is active
3. Verify connection string format

### "Environment Variable Not Working"
**Vercel**: Must start with `VITE_` for frontend access
**Render**: Redeploy after changing environment variables

---

## 🎯 Next Steps After Deployment

1. **Custom Domain** (Optional)
   - Render: Settings → Custom Domain
   - Vercel: Settings → Domains
   - See full guide for DNS setup

2. **Monitoring**
   - Enable Render metrics
   - Set up uptime monitoring (e.g., UptimeRobot)

3. **Performance**
   - Consider CDN for static assets
   - Monitor database query performance

4. **Security**
   - Enable 2FA on all accounts
   - Regularly rotate secrets
   - Monitor for security updates

---

## 📞 Support Resources

- **Full Guide**: [DEPLOY_VERCEL_RENDER.md](DEPLOY_VERCEL_RENDER.md)
- **Quick Guide**: [QUICK_DEPLOY_VERCEL_RENDER.md](QUICK_DEPLOY_VERCEL_RENDER.md)
- **Render Docs**: [render.com/docs](https://render.com/docs)
- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **PlanetScale Docs**: [planetscale.com/docs](https://planetscale.com/docs)

---

## ✨ What You Get

**Frontend (Vercel)**:
- ✅ Global CDN
- ✅ Automatic HTTPS
- ✅ Instant deployments
- ✅ Git integration
- ✅ Preview deployments for PRs

**Backend (Render)**:
- ✅ Automatic deployments from Git
- ✅ Free SSL certificates
- ✅ Environment variable management
- ✅ Automatic health checks
- ✅ Built-in monitoring

**Database (PlanetScale)**:
- ✅ Managed MySQL
- ✅ Automatic backups
- ✅ Branching workflow
- ✅ Connection pooling
- ✅ Global distribution

---

**Estimated Deployment Time**: 15-20 minutes  
**Cost**: $0 (free tier)  
**Difficulty**: ⭐⭐ (Medium)

**Ready to deploy?** Start with [QUICK_DEPLOY_VERCEL_RENDER.md](QUICK_DEPLOY_VERCEL_RENDER.md)!
