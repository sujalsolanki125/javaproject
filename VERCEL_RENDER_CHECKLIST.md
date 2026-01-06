# ✅ Vercel + Render Deployment Checklist

Use this checklist to ensure smooth deployment to Vercel (Frontend) and Render (Backend).

---

## 📝 Pre-Deployment Setup

### 1. Accounts & Access
- [ ] GitHub account with repository access
- [ ] Render account created ([render.com](https://render.com))
- [ ] Vercel account created ([vercel.com](https://vercel.com))
- [ ] PlanetScale account created ([planetscale.com](https://planetscale.com))
- [ ] All accounts verified via email

### 2. API Keys & Credentials
- [ ] Carbon Interface API key obtained
- [ ] Climatiq API key obtained
- [ ] Gmail account for sending emails
- [ ] Gmail app password created ([Guide](https://myaccount.google.com/apppasswords))
- [ ] JWT secret generated: `openssl rand -base64 64`

### 3. Code Preparation
- [ ] All code committed to GitHub
- [ ] Latest changes pushed to `main` branch
- [ ] No build errors locally
- [ ] All environment-specific values removed from code

---

## 🗄️ Database Setup (PlanetScale)

### Create Database
- [ ] Logged into PlanetScale dashboard
- [ ] Created new database: `carbon-calc`
- [ ] Selected region (choose closest to users)
- [ ] Database status: Active

### Get Connection Details
- [ ] Navigate to: Database → Settings → Passwords
- [ ] Created new password
- [ ] Saved connection details:
  - [ ] Host: `_______________`
  - [ ] Username: `_______________`
  - [ ] Password: `_______________`
  - [ ] Database: `carboncalc`
  - [ ] Port: `3306`

### Test Connection (Optional)
- [ ] Tested connection using MySQL client
- [ ] Verified database is accessible

---

## 🔧 Backend Deployment (Render)

### Create Web Service
- [ ] Logged into Render dashboard
- [ ] Clicked: **New +** → **Web Service**
- [ ] Connected GitHub repository
- [ ] Selected: `carbon-calc` repository
- [ ] Granted repository access to Render

### Configure Service
- [ ] **Name**: `carbon-calc-backend`
- [ ] **Region**: Selected (closest to users)
- [ ] **Branch**: `main`
- [ ] **Root Directory**: `backend`
- [ ] **Runtime**: Java
- [ ] **Build Command**: `./mvnw clean package -DskipTests`
- [ ] **Start Command**: `java -jar -Dserver.port=$PORT -Dspring.profiles.active=prod target/carbon-calculator-1.0.0.jar`
- [ ] **Plan**: Free (or selected paid plan)

### Add Environment Variables
Click **Advanced** → **Add Environment Variable**:

#### Database Variables
- [ ] `DB_HOST` = `<from-planetscale>`
- [ ] `DB_PORT` = `3306`
- [ ] `DB_NAME` = `carboncalc`
- [ ] `DB_USER` = `<from-planetscale>`
- [ ] `DB_PASSWORD` = `<from-planetscale>`

#### Application Variables
- [ ] `SPRING_PROFILES_ACTIVE` = `prod`
- [ ] `JWT_SECRET` = `<generated-secret>`
- [ ] `JWT_EXPIRATION` = `3600000`

#### Email Variables
- [ ] `MAIL_HOST` = `smtp.gmail.com`
- [ ] `MAIL_PORT` = `587`
- [ ] `MAIL_USERNAME` = `<your-email@gmail.com>`
- [ ] `MAIL_PASSWORD` = `<gmail-app-password>`

#### API Keys
- [ ] `CARBON_INTERFACE_API_KEY` = `<your-key>`
- [ ] `CLIMATIQ_API_KEY` = `<your-key>`

#### Optional Variables
- [ ] `DEFAULT_COUNTRY` = `US` (or your preference)
- [ ] `DEFAULT_STATE` = `CA` (or your preference)
- [ ] `ALLOWED_ORIGINS` = `http://localhost:3000` (will update after frontend deploy)

### Deploy Backend
- [ ] Clicked: **Create Web Service**
- [ ] Waited for initial deployment (5-10 minutes)
- [ ] Deployment status: Success ✅
- [ ] Backend URL: `https://_______________onrender.com`

### Verify Backend
- [ ] Opened: `https://your-backend.onrender.com/actuator/health`
- [ ] Response: `{"status":"UP"}` ✅
- [ ] No errors in Render logs

---

## 🎨 Frontend Deployment (Vercel)

### Option A: Vercel Dashboard

#### Import Project
- [ ] Logged into Vercel dashboard
- [ ] Clicked: **Add New** → **Project**
- [ ] Selected: **Import Git Repository**
- [ ] Connected GitHub account (if not already)
- [ ] Selected: `carbon-calc` repository
- [ ] Granted repository access to Vercel

#### Configure Project
- [ ] **Project Name**: `carbon-calc-frontend`
- [ ] **Framework Preset**: Vite
- [ ] **Root Directory**: `frontend`
- [ ] **Build Command**: `npm run build` (default)
- [ ] **Output Directory**: `dist` (default)
- [ ] **Install Command**: `npm install` (default)

#### Add Environment Variables
- [ ] Clicked: **Environment Variables**
- [ ] Added: `VITE_API_URL` = `https://your-backend.onrender.com`
- [ ] Added: `VITE_APP_ENV` = `production` (optional)
- [ ] Applied to: Production, Preview, Development

#### Deploy
- [ ] Clicked: **Deploy**
- [ ] Waited for deployment (2-3 minutes)
- [ ] Deployment status: Success ✅
- [ ] Frontend URL: `https://_______________vercel.app`

### Option B: Vercel CLI

- [ ] Installed Vercel CLI: `npm install -g vercel`
- [ ] Logged in: `vercel login`
- [ ] Navigated to frontend: `cd frontend`
- [ ] Ran: `vercel --prod`
- [ ] Provided backend URL when prompted
- [ ] Deployment complete ✅
- [ ] Frontend URL: `https://_______________vercel.app`

### Verify Frontend
- [ ] Opened frontend URL in browser
- [ ] Page loads without errors ✅
- [ ] No console errors in browser ✅

---

## 🔄 Update CORS Configuration

### Update Backend Environment Variable
- [ ] Opened Render dashboard
- [ ] Navigated to: Backend service → Environment
- [ ] Updated `ALLOWED_ORIGINS`:
  ```
  http://localhost:3000,https://your-app.vercel.app
  ```
- [ ] Clicked: **Save Changes**
- [ ] Waited for automatic redeploy (2-3 minutes)
- [ ] Redeployment complete ✅

### Verify CORS
- [ ] Opened frontend in browser
- [ ] Opened browser DevTools (F12) → Console
- [ ] Tested API call (e.g., login)
- [ ] No CORS errors ✅

---

## 🧪 Testing

### Backend API Tests
- [ ] Health endpoint: `curl https://your-backend.onrender.com/actuator/health`
- [ ] Response: `{"status":"UP"}` ✅

### Frontend Tests
- [ ] Homepage loads ✅
- [ ] Registration form accessible ✅
- [ ] Login form accessible ✅

### Integration Tests
- [ ] Created test account
- [ ] Login successful ✅
- [ ] Dashboard loads ✅
- [ ] Can create carbon log entry ✅
- [ ] Email verification sent (check email) ✅
- [ ] Marketplace accessible ✅
- [ ] Can view products ✅

### Performance Tests
- [ ] Initial page load < 3 seconds ✅
- [ ] API response time < 1 second ✅
- [ ] No browser console errors ✅
- [ ] No network errors ✅

---

## 🌐 Custom Domain (Optional)

### Backend Custom Domain
- [ ] Domain purchased/available: `api.yourdomain.com`
- [ ] Render: Settings → Custom Domain
- [ ] Added domain: `api.yourdomain.com`
- [ ] Added CNAME record to DNS:
  ```
  Type: CNAME
  Name: api
  Value: your-backend.onrender.com
  ```
- [ ] SSL certificate issued (automatic) ✅
- [ ] Domain accessible: `https://api.yourdomain.com` ✅

### Frontend Custom Domain
- [ ] Domain purchased/available: `yourdomain.com`
- [ ] Vercel: Settings → Domains
- [ ] Added domain: `yourdomain.com`
- [ ] Added DNS records as per Vercel instructions
- [ ] DNS propagation complete (can take up to 48 hours)
- [ ] SSL certificate issued (automatic) ✅
- [ ] Domain accessible: `https://yourdomain.com` ✅

### Update After Custom Domain
- [ ] Updated `ALLOWED_ORIGINS` in Render:
  ```
  https://yourdomain.com
  ```
- [ ] Updated `VITE_API_URL` in Vercel:
  ```
  https://api.yourdomain.com
  ```
- [ ] Both services redeployed ✅
- [ ] Custom domains working ✅

---

## 📊 Monitoring Setup

### Uptime Monitoring
- [ ] Set up uptime monitor (e.g., [UptimeRobot](https://uptimerobot.com))
- [ ] Monitor backend: `https://your-backend.onrender.com/actuator/health`
- [ ] Monitor frontend: `https://your-frontend.vercel.app`
- [ ] Alert notifications configured
- [ ] Test alerts working ✅

### Performance Monitoring
- [ ] Enabled Render metrics dashboard
- [ ] Checked Vercel analytics
- [ ] Set up error tracking (optional - Sentry)
- [ ] Baseline metrics documented

### Log Monitoring
- [ ] Checked Render logs for errors
- [ ] No critical errors in logs ✅
- [ ] Set up log aggregation (optional)

---

## 🔒 Security Review

### Credentials
- [ ] No hardcoded credentials in code ✅
- [ ] All secrets in environment variables ✅
- [ ] GitHub doesn't contain `.env` files ✅
- [ ] Strong passwords used (20+ characters) ✅

### API Security
- [ ] HTTPS enforced everywhere ✅
- [ ] CORS properly configured ✅
- [ ] JWT authentication working ✅
- [ ] SQL injection protection (JPA) ✅

### Access Control
- [ ] 2FA enabled on GitHub ✅
- [ ] 2FA enabled on Render ✅
- [ ] 2FA enabled on Vercel ✅
- [ ] 2FA enabled on PlanetScale ✅
- [ ] Team access properly configured

---

## 📝 Documentation

### URLs Documented
- [ ] Backend URL: `_______________`
- [ ] Frontend URL: `_______________`
- [ ] Database host: `_______________`
- [ ] Admin email: `_______________`

### Credentials Stored Securely
- [ ] Database credentials in password manager ✅
- [ ] API keys in password manager ✅
- [ ] JWT secret backed up securely ✅
- [ ] Email credentials in password manager ✅

### Team Access
- [ ] Team members added to GitHub repo
- [ ] Team members added to Render (if needed)
- [ ] Team members added to Vercel (if needed)
- [ ] Deployment guide shared with team

---

## 🚀 Post-Deployment

### Immediate Tasks
- [ ] Announced deployment to team
- [ ] Shared URLs with stakeholders
- [ ] Created backup of current state
- [ ] Documented any issues encountered

### First 24 Hours
- [ ] Monitor logs for errors
- [ ] Check uptime status
- [ ] Verify email delivery
- [ ] Test all critical features
- [ ] Gather initial user feedback

### First Week
- [ ] Review performance metrics
- [ ] Optimize slow queries (if any)
- [ ] Fix any reported bugs
- [ ] Plan improvements based on feedback

---

## 💰 Cost Tracking

### Current Plan
- [ ] Render plan: Free / Starter / Standard
- [ ] Vercel plan: Hobby / Pro / Enterprise
- [ ] PlanetScale plan: Hobby / Scaler / Enterprise
- [ ] Monthly cost: $_______________

### Usage Monitoring
- [ ] Set up billing alerts
- [ ] Monitor bandwidth usage
- [ ] Monitor database storage
- [ ] Monitor compute hours
- [ ] Plan for scaling costs

---

## 🎯 Success Criteria

### All Systems Go ✅
- [ ] Backend deployed and healthy
- [ ] Frontend deployed and accessible
- [ ] Database connected and working
- [ ] CORS properly configured
- [ ] All critical features working
- [ ] No console errors
- [ ] Performance acceptable
- [ ] Monitoring active
- [ ] Documentation complete
- [ ] Team notified

---

## 📞 Emergency Contacts

**Render Support**: [render.com/support](https://render.com/support)  
**Vercel Support**: [vercel.com/support](https://vercel.com/support)  
**PlanetScale Support**: [planetscale.com/support](https://planetscale.com/support)

**Team Lead**: _______________  
**DevOps Contact**: _______________  
**On-Call**: _______________

---

## 🔄 Rollback Plan

### If Deployment Fails

**Frontend (Vercel)**:
1. Dashboard → Deployments
2. Find previous working deployment
3. Click three dots → Promote to Production

**Backend (Render)**:
1. Dashboard → Deploys
2. Find previous working deployment
3. Click → Redeploy

**Database (PlanetScale)**:
1. Dashboard → Backups
2. Select restore point
3. Restore database

---

**Deployment Date**: _______________  
**Deployed By**: _______________  
**Status**: ⬜ Planning | ⬜ In Progress | ⬜ Complete | ⬜ Failed  

---

**Notes**:
_______________________________________
_______________________________________
_______________________________________
