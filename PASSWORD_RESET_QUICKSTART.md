# Password Reset System - Quick Start

## 🚀 Quick Setup (5 Minutes)

### Step 1: Run Database Migration
```bash
mysql -u root -p -P 3307 carboncalc < backend/src/main/resources/db/migration/V7__Create_Password_Reset_OTP_Table.sql
```

### Step 2: Restart Backend
```bash
cd backend
mvn spring-boot:run
```

### Step 3: Start Frontend (if not running)
```bash
cd frontend
npm run dev
```

## 🧪 Quick Test

### Using the UI:
1. Go to: http://localhost:5173/auth/login
2. Click "Forgot password?"
3. Enter your email
4. Check email for OTP code
5. Enter OTP on verification page
6. Create new password
7. Login with new password

### Using cURL:
```bash
# 1. Request OTP
curl -X POST http://localhost:8080/api/auth/password-reset/request \
  -H "Content-Type: application/json" \
  -d '{"email": "your-email@example.com"}'

# 2. Check email for OTP, then verify it
curl -X POST http://localhost:8080/api/auth/password-reset/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email": "your-email@example.com", "otp": "123456"}'

# 3. Reset password
curl -X POST http://localhost:8080/api/auth/password-reset/reset \
  -H "Content-Type: application/json" \
  -d '{"email": "your-email@example.com", "otp": "123456", "newPassword": "NewPass123"}'
```

## 📋 Pages Created

1. **ForgotPassword.jsx** (`/auth/forgot-password`)
   - Email input
   - Sends OTP request
   - Navigates to OTP verification

2. **VerifyOtp.jsx** (`/auth/verify-otp`)
   - 6-digit OTP input
   - 10-minute countdown timer
   - Resend OTP option
   - Auto-focus and paste support

3. **ResetPassword.jsx** (`/auth/reset-password`)
   - New password input
   - Password strength indicator
   - Confirmation field with live matching
   - Password requirements checklist

## ⚙️ Configuration

Email is already configured in `application.yml`:
- **Email**: connected.platform1250@gmail.com
- **SMTP**: Gmail (smtp.gmail.com:587)
- **Status**: ✅ Ready to use

## 🔐 Security Features

- ✅ OTP expires in 10 minutes
- ✅ Maximum 5 verification attempts
- ✅ One-time use OTPs
- ✅ Hourly cleanup of expired OTPs
- ✅ Strong password requirements
- ✅ Async email sending

## 🎨 Features

- ✅ Professional email templates
- ✅ Real-time countdown timer
- ✅ Password strength indicator
- ✅ Toast notifications
- ✅ Responsive design
- ✅ Auto-focus inputs
- ✅ Paste OTP support

## 📧 Email Template Preview

**Subject**: Reset Your Password - Carbon Calc

**Content**:
```
Your OTP Code: 123456

This code will expire in 10 minutes.

For security reasons, do not share this code with anyone.
```

## ✅ Checklist

- [ ] Database table created (`password_reset_otp`)
- [ ] Backend restarted
- [ ] Frontend running on port 5173
- [ ] Backend running on port 8080
- [ ] Test user account available
- [ ] Email inbox accessible

## 🚨 Common Issues

**Email not received?**
- Check spam folder
- Verify email in database
- Check backend logs for errors

**OTP not working?**
- Check if expired (10 min)
- Verify attempt count < 5
- Ensure email matches exactly

**Can't reset password?**
- Verify OTP was verified successfully
- Check password meets requirements (8+ chars, uppercase, lowercase, number)

## 📞 Support

Check logs:
```bash
# Backend logs
tail -f backend/logs/application.log

# Check database
mysql -u root -p -P 3307 carboncalc
SELECT * FROM password_reset_otp WHERE email = 'your-email@example.com';
```

---
**Status**: ✅ Ready for Testing
