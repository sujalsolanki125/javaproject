# 🚀 Deploy to Vercel (Frontend) & Render (Backend)

Complete guide to deploy your Carbon Calculator application with frontend on Vercel and backend on Render.

---

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Backend Deployment (Render)](#backend-deployment-render)
3. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
4. [Environment Variables](#environment-variables)
5. [Custom Domain Setup](#custom-domain-setup)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Accounts
- ✅ **GitHub Account** (to connect repositories)
- ✅ **Render Account** (free tier available) - [render.com](https://render.com)
- ✅ **Vercel Account** (free tier available) - [vercel.com](https://vercel.com)

### Required API Keys
- ✅ Carbon Interface API key
- ✅ Climatiq API key
- ✅ Gmail app password (for emails)

### Repository Setup
```bash
# Make sure your code is pushed to GitHub
git add .
git commit -m "Ready for deployment"
git push origin main
```

---

## 🔧 Backend Deployment (Render)

### Step 1: Create MySQL Database on Render

1. **Log in to Render Dashboard**
   - Go to [dashboard.render.com](https://dashboard.render.com)
   - Click **"New +"** → **"PostgreSQL"** (Render doesn't offer MySQL on free tier)

2. **Alternative: Use External MySQL Database**
   - **Recommended**: Use [PlanetScale](https://planetscale.com/) (free MySQL)
   - **Or**: [Railway](https://railway.app/) (offers MySQL)
   - **Or**: [Aiven](https://aiven.io/) (offers MySQL)

#### Option A: Using PlanetScale (Recommended for MySQL)

1. **Create PlanetScale Account**
   - Visit [planetscale.com](https://planetscale.com)
   - Sign up for free tier

2. **Create Database**
   ```bash
   # Install PlanetScale CLI (optional)
   # Or use web dashboard
   
   # Create database via dashboard:
   # - Name: carbon-calc
   # - Region: Choose closest to your users
   # - Plan: Hobby (free)
   ```

3. **Get Connection Details**
   - Go to database → Settings → Passwords
   - Create new password
   - Save connection details:
     - Host
     - Username
     - Password
     - Database name

#### Option B: Using PostgreSQL (Render Native)

If you prefer PostgreSQL over MySQL, update your backend:

1. **Update `pom.xml`**:
   ```xml
   <!-- Replace MySQL dependency with PostgreSQL -->
   <dependency>
       <groupId>org.postgresql</groupId>
       <artifactId>postgresql</artifactId>
       <scope>runtime</scope>
   </dependency>
   ```

2. **Update `application-prod.yml`**:
   ```yaml
   spring:
     datasource:
       url: jdbc:postgresql://${DB_HOST}:${DB_PORT}/${DB_NAME}
       driver-class-name: org.postgresql.Driver
     jpa:
       properties:
         hibernate:
           dialect: org.hibernate.dialect.PostgreSQLDialect
   ```

### Step 2: Deploy Backend to Render

1. **Create New Web Service**
   - Dashboard → **"New +"** → **"Web Service"**
   - Connect your GitHub repository
   - Select the `carbon-calc` repository

2. **Configure Web Service**
   ```
   Name: carbon-calc-backend
   Region: Choose closest to your users
   Branch: main
   Root Directory: backend
   Runtime: Java
   Build Command: ./mvnw clean package -DskipTests
   Start Command: java -jar -Dserver.port=$PORT -Dspring.profiles.active=prod target/carbon-calculator-1.0.0.jar
   Plan: Free (or choose paid plan)
   ```

3. **Add Environment Variables**
   
   Click **"Advanced"** → **"Add Environment Variable"**:
   
   ```
   SPRING_PROFILES_ACTIVE=prod
   
   # Database (from PlanetScale or your MySQL provider)
   DB_HOST=your-planetscale-host.psdb.cloud
   DB_PORT=3306
   DB_NAME=carboncalc
   DB_USER=your-planetscale-username
   DB_PASSWORD=your-planetscale-password
   
   # JWT (generate with: openssl rand -base64 64)
   JWT_SECRET=your-generated-jwt-secret-here
   JWT_EXPIRATION=3600000
   
   # Email
   MAIL_HOST=smtp.gmail.com
   MAIL_PORT=587
   MAIL_USERNAME=your-email@gmail.com
   MAIL_PASSWORD=your-gmail-app-password
   
   # API Keys
   CARBON_INTERFACE_API_KEY=your-carbon-interface-key
   CLIMATIQ_API_KEY=your-climatiq-key
   
   # Optional
   DEFAULT_COUNTRY=US
   DEFAULT_STATE=CA
   ```

4. **Deploy**
   - Click **"Create Web Service"**
   - Wait for deployment (5-10 minutes first time)
   - Your backend will be at: `https://carbon-calc-backend.onrender.com`

5. **Verify Deployment**
   ```bash
   # Check health endpoint
   curl https://carbon-calc-backend.onrender.com/actuator/health
   
   # Should return: {"status":"UP"}
   ```

### Step 3: Configure Database Connection for PlanetScale

If using PlanetScale, add SSL configuration:

**Update `application-prod.yml`**:
```yaml
spring:
  datasource:
    url: jdbc:mysql://${DB_HOST}:${DB_PORT}/${DB_NAME}?sslMode=VERIFY_IDENTITY&serverTimezone=UTC
```

---

## 🎨 Frontend Deployment (Vercel)

### Step 1: Prepare Frontend

1. **Update Environment Variable**
   
   Create `frontend/.env.production.local` (local only, don't commit):
   ```
   VITE_API_URL=https://carbon-calc-backend.onrender.com
   ```

### Step 2: Deploy to Vercel

#### Option A: Using Vercel CLI (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   cd frontend
   vercel --prod
   ```

4. **Follow Prompts**
   ```
   Set up and deploy "frontend"? Y
   Which scope? Select your account
   Link to existing project? N
   What's your project's name? carbon-calc-frontend
   In which directory is your code located? ./
   Want to override settings? N
   ```

#### Option B: Using Vercel Dashboard

1. **Import Project**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Select `carbon-calc` repository

2. **Configure Project**
   ```
   Framework Preset: Vite
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

3. **Add Environment Variables**
   
   Settings → Environment Variables:
   ```
   VITE_API_URL=https://carbon-calc-backend.onrender.com
   VITE_APP_ENV=production
   ```

4. **Deploy**
   - Click **"Deploy"**
   - Wait for deployment (2-3 minutes)
   - Your frontend will be at: `https://carbon-calc-frontend.vercel.app`

### Step 3: Update CORS in Backend

After deploying frontend, update CORS configuration:

**Create/Update `backend/src/main/java/com/carboncalc/config/SecurityConfig.java`**:

Find the CORS configuration and add your Vercel URL:
```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(Arrays.asList(
        "http://localhost:3000",
        "https://carbon-calc-frontend.vercel.app",  // Add your Vercel URL
        "https://your-custom-domain.com"  // Add custom domain if you have one
    ));
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(Arrays.asList("*"));
    configuration.setAllowCredentials(true);
    
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
}
```

**Commit and push changes**:
```bash
git add .
git commit -m "Update CORS for Vercel deployment"
git push
```

Render will automatically redeploy the backend.

---

## 🔐 Environment Variables

### Backend (Render) Environment Variables

| Variable | Required | Example | How to Get |
|----------|----------|---------|------------|
| `SPRING_PROFILES_ACTIVE` | ✅ | `prod` | Fixed value |
| `DB_HOST` | ✅ | `xxx.psdb.cloud` | PlanetScale dashboard |
| `DB_PORT` | ✅ | `3306` | PlanetScale dashboard |
| `DB_NAME` | ✅ | `carboncalc` | Your database name |
| `DB_USER` | ✅ | `username` | PlanetScale dashboard |
| `DB_PASSWORD` | ✅ | `pscale_pw_xxx` | PlanetScale dashboard |
| `JWT_SECRET` | ✅ | `base64-string` | `openssl rand -base64 64` |
| `JWT_EXPIRATION` | ✅ | `3600000` | 1 hour in ms |
| `MAIL_HOST` | ✅ | `smtp.gmail.com` | Gmail settings |
| `MAIL_PORT` | ✅ | `587` | Gmail settings |
| `MAIL_USERNAME` | ✅ | `your@gmail.com` | Your Gmail |
| `MAIL_PASSWORD` | ✅ | `app-password` | [Gmail App Password](https://myaccount.google.com/apppasswords) |
| `CARBON_INTERFACE_API_KEY` | ✅ | `key` | [Carbon Interface](https://www.carboninterface.com/) |
| `CLIMATIQ_API_KEY` | ✅ | `key` | [Climatiq](https://www.climatiq.io/) |

### Frontend (Vercel) Environment Variables

| Variable | Required | Example |
|----------|----------|---------|
| `VITE_API_URL` | ✅ | `https://carbon-calc-backend.onrender.com` |
| `VITE_APP_ENV` | ❌ | `production` |

---

## 🌐 Custom Domain Setup

### Backend (Render)

1. **Settings** → **Custom Domain**
2. Add your domain: `api.yourdomain.com`
3. Add CNAME record in your DNS:
   ```
   Type: CNAME
   Name: api
   Value: carbon-calc-backend.onrender.com
   ```
4. Wait for SSL certificate (automatic)

### Frontend (Vercel)

1. **Settings** → **Domains**
2. Add your domain: `yourdomain.com`
3. Add DNS records as shown by Vercel:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```
4. SSL is automatic

### Update Environment Variables After Custom Domain

**Vercel** (Frontend):
```
VITE_API_URL=https://api.yourdomain.com
```

**Backend CORS** (update and redeploy):
```java
configuration.setAllowedOrigins(Arrays.asList(
    "https://yourdomain.com"
));
```

---

## 🔍 Troubleshooting

### Backend Issues

#### "Application failed to start"
**Check Logs**: Render Dashboard → Logs tab

**Common Issues**:
1. Database connection failed
   - Verify DB credentials in environment variables
   - Check if database is accessible

2. Port binding error
   - Ensure start command uses `$PORT`: `-Dserver.port=$PORT`

3. Build failed
   - Check Maven build logs
   - Ensure Java 21 is specified

#### "Health check failed"
```bash
# Check if backend is responding
curl https://carbon-calc-backend.onrender.com/actuator/health

# Check logs in Render dashboard
```

**Solution**: Verify health check path is `/actuator/health`

### Frontend Issues

#### "CORS Error"
**Symptoms**: Frontend can't access backend API

**Solution**: Update CORS configuration in backend and redeploy

#### "Environment variable not working"
**Solution**: 
- Vercel: Settings → Environment Variables → Redeploy
- Variable names must start with `VITE_`

#### "Build failed"
**Check**: Vercel Dashboard → Deployments → Build logs

**Common Issues**:
- Missing dependencies: Run `npm install` locally first
- Environment variables missing

### Database Issues

#### "Connection timeout"
**PlanetScale**:
- Check if database is in sleep mode (free tier sleeps after inactivity)
- Verify connection string

#### "Too many connections"
**Solution**: Adjust connection pool in `application-prod.yml`:
```yaml
spring:
  datasource:
    hikari:
      maximum-pool-size: 5  # Lower for free tier
```

---

## 💰 Pricing

### Free Tier Limits

**Render Free Tier**:
- ✅ 750 hours/month
- ✅ Sleeps after 15 min inactivity
- ✅ Slower cold starts
- ❌ No custom domain SSL on free tier
- **Cost**: $0/month

**Vercel Free Tier**:
- ✅ Unlimited sites
- ✅ 100GB bandwidth/month
- ✅ Instant deployments
- ✅ Custom domains with SSL
- **Cost**: $0/month

**PlanetScale Free Tier**:
- ✅ 1 database
- ✅ 5GB storage
- ✅ 1 billion row reads/month
- **Cost**: $0/month

### Upgrade Recommendations

For production with users:
- **Render**: Starter plan ($7/month) - No sleep, better performance
- **Vercel**: Pro plan ($20/month) - More bandwidth, better analytics
- **PlanetScale**: Scaler plan ($29/month) - More storage, backups

---

## 🚀 Quick Deployment Summary

```bash
# 1. Deploy Backend to Render
# - Connect GitHub repo
# - Add environment variables
# - Deploy from dashboard

# 2. Deploy Frontend to Vercel
cd frontend
vercel login
vercel --prod

# 3. Update CORS in backend
# - Add Vercel URL to allowed origins
# - Commit and push

# 4. Test
curl https://carbon-calc-backend.onrender.com/actuator/health
curl https://carbon-calc-frontend.vercel.app
```

---

## 📞 Support

**Render Issues**: [render.com/docs](https://render.com/docs)  
**Vercel Issues**: [vercel.com/docs](https://vercel.com/docs)  
**PlanetScale Issues**: [planetscale.com/docs](https://planetscale.com/docs)

---

## ✅ Deployment Checklist

- [ ] GitHub repository created and pushed
- [ ] PlanetScale (or other MySQL) database created
- [ ] Database credentials obtained
- [ ] JWT secret generated
- [ ] Gmail app password created
- [ ] API keys obtained (Carbon Interface, Climatiq)
- [ ] Backend deployed to Render
- [ ] Backend health check passing
- [ ] Frontend environment variables set
- [ ] Frontend deployed to Vercel
- [ ] CORS updated in backend
- [ ] Test login/registration working
- [ ] Test API calls from frontend
- [ ] Custom domains configured (optional)

---

**Congratulations! Your app is now live!** 🎉

- **Frontend**: https://carbon-calc-frontend.vercel.app
- **Backend**: https://carbon-calc-backend.onrender.com
