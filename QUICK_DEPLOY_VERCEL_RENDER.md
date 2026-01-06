# 🚀 Quick Deploy: Vercel + Render

## Step-by-Step (15 minutes)

### 1️⃣ Setup Database (5 min)

**Using PlanetScale (Free MySQL)**:
1. Sign up at [planetscale.com](https://planetscale.com)
2. Create database: `carbon-calc`
3. Get credentials from dashboard
4. Save for later: host, username, password, database name

### 2️⃣ Deploy Backend to Render (5 min)

1. **Go to [render.com](https://render.com)** → Sign up/Login
2. **New** → **Web Service**
3. **Connect GitHub** repository
4. **Configure**:
   ```
   Name: carbon-calc-backend
   Root Directory: backend
   Build Command: ./mvnw clean package -DskipTests
   Start Command: java -jar -Dserver.port=$PORT -Dspring.profiles.active=prod target/carbon-calculator-1.0.0.jar
   ```
5. **Environment Variables** (Click Advanced):
   ```
   SPRING_PROFILES_ACTIVE=prod
   DB_HOST=<from-planetscale>
   DB_PORT=3306
   DB_NAME=carboncalc
   DB_USER=<from-planetscale>
   DB_PASSWORD=<from-planetscale>
   JWT_SECRET=<openssl rand -base64 64>
   JWT_EXPIRATION=3600000
   MAIL_HOST=smtp.gmail.com
   MAIL_PORT=587
   MAIL_USERNAME=<your-email@gmail.com>
   MAIL_PASSWORD=<gmail-app-password>
   CARBON_INTERFACE_API_KEY=<your-key>
   CLIMATIQ_API_KEY=<your-key>
   ```
6. **Create Web Service** → Wait 5-10 min
7. **Copy URL**: `https://carbon-calc-backend.onrender.com`

### 3️⃣ Deploy Frontend to Vercel (3 min)

**Option A: Vercel Dashboard**
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import GitHub repository
3. **Configure**:
   ```
   Root Directory: frontend
   Framework: Vite
   Build Command: npm run build
   Output Directory: dist
   ```
4. **Environment Variables**:
   ```
   VITE_API_URL=https://carbon-calc-backend.onrender.com
   ```
5. **Deploy** → Wait 2-3 min

**Option B: Vercel CLI**
```bash
npm install -g vercel
cd frontend
vercel login
vercel --prod
# When asked for VITE_API_URL, paste backend URL
```

### 4️⃣ Update CORS (2 min)

1. **Find** `backend/src/main/java/com/carboncalc/config/SecurityConfig.java`
2. **Update** allowed origins:
   ```java
   configuration.setAllowedOrigins(Arrays.asList(
       "http://localhost:3000",
       "https://your-vercel-url.vercel.app"
   ));
   ```
3. **Commit & Push**:
   ```bash
   git add .
   git commit -m "Update CORS for Vercel"
   git push
   ```
4. Render auto-redeploys in ~5 min

### 5️⃣ Test

```bash
# Backend health
curl https://carbon-calc-backend.onrender.com/actuator/health

# Frontend
# Open: https://your-vercel-url.vercel.app
```

---

## 📋 Quick Checklist

- [ ] PlanetScale database created
- [ ] Backend deployed to Render
- [ ] Backend URL copied
- [ ] Frontend deployed to Vercel
- [ ] CORS updated
- [ ] App tested and working

---

## 🔑 Environment Variables Quick Reference

### Backend (Render)
```
SPRING_PROFILES_ACTIVE=prod
DB_HOST=xxx.psdb.cloud
DB_PORT=3306
DB_NAME=carboncalc
DB_USER=xxx
DB_PASSWORD=pscale_pw_xxx
JWT_SECRET=<openssl rand -base64 64>
JWT_EXPIRATION=3600000
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your@gmail.com
MAIL_PASSWORD=<app-password>
CARBON_INTERFACE_API_KEY=<key>
CLIMATIQ_API_KEY=<key>
```

### Frontend (Vercel)
```
VITE_API_URL=https://carbon-calc-backend.onrender.com
```

---

## 🆘 Common Issues

**Backend won't start?**
- Check logs in Render dashboard
- Verify all environment variables are set
- Check database connection

**CORS errors?**
- Update SecurityConfig.java with Vercel URL
- Commit and push to trigger redeploy

**"Cold start" slow?**
- Render free tier sleeps after 15 min
- First request wakes it up (~30 sec)
- Upgrade to paid plan to prevent sleep

---

## 💡 Pro Tips

1. **Generate JWT Secret**:
   ```bash
   openssl rand -base64 64
   ```

2. **Gmail App Password**:
   - Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
   - Create new app password
   - Use that instead of your regular password

3. **Free Tier Limitations**:
   - Render: Sleeps after 15 min → Use [cron-job.org](https://cron-job.org) to ping every 10 min
   - PlanetScale: 5GB storage → Monitor usage

4. **Speed Up Cold Starts**:
   - Keep backend warm with health check pings
   - Or upgrade to Render Starter ($7/month)

---

**Full Guide**: [DEPLOY_VERCEL_RENDER.md](DEPLOY_VERCEL_RENDER.md)
