# Password Reset System - Complete Implementation Guide

## Overview
This document provides a comprehensive guide to the OTP-based password reset system implemented for the Carbon Calc application.

## 🏗️ Architecture

### Backend Components
1. **Entity**: `PasswordResetOtp.java`
2. **Repository**: `PasswordResetOtpRepository.java`
3. **Service**: `PasswordResetService.java`
4. **Email Service**: `EmailService.java`
5. **Controller**: `PasswordResetController.java`
6. **DTOs**: `PasswordResetRequest`, `OtpVerificationRequest`, `NewPasswordRequest`

### Frontend Components
1. **ForgotPassword.jsx** - Email input page
2. **VerifyOtp.jsx** - OTP verification page
3. **ResetPassword.jsx** - New password creation page

### Database
- **Migration**: `V7__Create_Password_Reset_OTP_Table.sql`
- **Table**: `password_reset_otp`

## 📋 Features

### Security Features
- ✅ 6-digit secure random OTP generation
- ✅ 10-minute OTP expiration
- ✅ Maximum 5 verification attempts
- ✅ One-time use (OTP marked as used after successful verification)
- ✅ Hourly cleanup of expired OTPs (scheduled task)
- ✅ Password validation (min 8 chars, uppercase, lowercase, number)
- ✅ HTML email templates with professional styling
- ✅ Async email sending (non-blocking)

### User Experience
- ✅ Real-time countdown timer (10 minutes)
- ✅ Resend OTP option (disabled for first minute)
- ✅ Password strength indicator
- ✅ Live password matching feedback
- ✅ Auto-focus on OTP input fields
- ✅ Paste support for OTP codes
- ✅ Responsive design with Tailwind CSS
- ✅ Toast notifications for feedback

## 🔧 Setup Instructions

### 1. Database Setup

The migration file has been created but needs to be run manually since Flyway is disabled:

```sql
-- Run this SQL script in MySQL
CREATE TABLE password_reset_otp (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    otp VARCHAR(6) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN NOT NULL DEFAULT FALSE,
    attempt_count INT NOT NULL DEFAULT 0,
    INDEX idx_email (email),
    INDEX idx_expires_at (expires_at),
    INDEX idx_email_otp (email, otp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**To run the migration:**
```bash
mysql -u root -p -P 3307 carboncalc < backend/src/main/resources/db/migration/V7__Create_Password_Reset_OTP_Table.sql
```

### 2. Email Configuration

The email configuration is already set in `application.yml`:

```yaml
spring:
  mail:
    host: smtp.gmail.com
    port: 587
    username: connected.platform1250@gmail.com
    password: nfqc dmwc rnpi qyju
    properties:
      mail:
        smtp:
          auth: true
          starttls:
            enable: true
            required: true
          ssl:
            trust: smtp.gmail.com
```

**Note**: The password is an App Password, not the actual Gmail password.

### 3. Backend Configuration

Ensure the main application class has these annotations:
```java
@EnableAsync
@EnableScheduling
```

Already configured in `CarbonCalcApplication.java`.

### 4. Restart Backend

After running the migration, restart the Spring Boot backend:

```bash
cd backend
mvn clean package -DskipTests
mvn spring-boot:run
```

Or if using an IDE, stop and restart the application.

## 🔐 API Endpoints

### 1. Request Password Reset
**Endpoint**: `POST /api/auth/password-reset/request`

**Request Body**:
```json
{
  "email": "user@example.com"
}
```

**Response**:
```json
{
  "success": true,
  "message": "OTP sent successfully"
}
```

### 2. Verify OTP
**Endpoint**: `POST /api/auth/password-reset/verify-otp`

**Request Body**:
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Response**:
```json
{
  "success": true,
  "valid": true,
  "message": "OTP verified successfully"
}
```

### 3. Reset Password
**Endpoint**: `POST /api/auth/password-reset/reset`

**Request Body**:
```json
{
  "email": "user@example.com",
  "otp": "123456",
  "newPassword": "NewPass123"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

## 🎨 Frontend Flow

### Page 1: Forgot Password (`/auth/forgot-password`)
1. User enters email address
2. System sends OTP to email
3. Navigates to OTP verification page

### Page 2: Verify OTP (`/auth/verify-otp`)
1. User receives email with OTP
2. Enters 6-digit OTP code
3. Timer shows 10-minute countdown
4. Can resend OTP after 1 minute
5. Maximum 5 attempts allowed
6. On success, navigates to reset password page

### Page 3: Reset Password (`/auth/reset-password`)
1. User enters new password
2. Confirms password
3. Real-time password strength indicator
4. Live validation feedback
5. On success, redirects to login page

## 📧 Email Templates

### Password Reset OTP Email
- **Subject**: Reset Your Password - Carbon Calc
- **Content**: 
  - Professional HTML template
  - Large OTP display
  - 10-minute expiration notice
  - Security warning about not sharing OTP
  - Contact support section

### Password Changed Notification
- **Subject**: Your Password Has Been Changed - Carbon Calc
- **Content**:
  - Confirmation of password change
  - Timestamp of change
  - Security alert if not authorized
  - Support contact information

## 🧪 Testing Guide

### 1. Test Email Sending
```bash
# Check if email service is working
# Trigger password reset for a test account
curl -X POST http://localhost:8080/api/auth/password-reset/request \
  -H "Content-Type: application/json" \
  -d '{"email": "testuser@example.com"}'

# Check email inbox for OTP
```

### 2. Test OTP Verification
```bash
# Verify the OTP received
curl -X POST http://localhost:8080/api/auth/password-reset/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email": "testuser@example.com", "otp": "123456"}'
```

### 3. Test Password Reset
```bash
# Reset password with verified OTP
curl -X POST http://localhost:8080/api/auth/password-reset/reset \
  -H "Content-Type: application/json" \
  -d '{"email": "testuser@example.com", "otp": "123456", "newPassword": "NewPass123"}'
```

### 4. Test Frontend Flow
1. Navigate to `http://localhost:5173/auth/forgot-password`
2. Enter a valid user email
3. Check email for OTP
4. Enter OTP on verification page
5. Set new password
6. Try logging in with new password

## 🚨 Troubleshooting

### Email Not Sending
1. Check Gmail SMTP settings are correct
2. Verify App Password is valid (not regular password)
3. Check if "Less secure app access" is enabled (if using old Gmail account)
4. Check application logs for email errors
5. Verify firewall allows outbound SMTP (port 587)

### OTP Not Working
1. Check if OTP has expired (10 minutes)
2. Verify attempt count hasn't exceeded 5
3. Check if OTP has already been used
4. Verify email matches exactly (case-sensitive)
5. Check database for OTP record

### Frontend Issues
1. Check if backend is running on port 8080
2. Verify CORS is configured correctly
3. Check browser console for errors
4. Verify routing is properly configured
5. Check toast notifications for error messages

## 📱 Routes

All routes are configured in `AppRoutes.jsx`:

```jsx
<Route path="/auth/login" element={<Login />} />
<Route path="/auth/register" element={<Register />} />
<Route path="/auth/forgot-password" element={<ForgotPassword />} />
<Route path="/auth/verify-otp" element={<VerifyOtp />} />
<Route path="/auth/reset-password" element={<ResetPassword />} />
```

## 🔒 Security Considerations

1. **OTP Generation**: Uses `SecureRandom` for cryptographically secure random numbers
2. **Attempt Limiting**: Maximum 5 attempts before new OTP required
3. **Time-based Expiration**: 10-minute window for OTP validity
4. **One-time Use**: OTPs are marked as used after successful verification
5. **Cleanup Task**: Hourly job removes expired OTPs from database
6. **Password Validation**: Enforces strong password requirements
7. **HTTPS**: Should be enabled in production for secure transmission
8. **Rate Limiting**: Consider adding rate limiting for OTP requests

## 📈 Future Enhancements

1. **Rate Limiting**: Add rate limiting to prevent abuse
2. **IP Tracking**: Log IP addresses for security monitoring
3. **Account Lockout**: Lock account after multiple failed attempts
4. **SMS OTP**: Add SMS as alternative to email
5. **2FA Integration**: Integrate with 2FA system
6. **Analytics**: Track password reset metrics
7. **Custom Email Templates**: Allow admin customization
8. **Multi-language Support**: Internationalization for emails

## 📞 Support

For issues or questions:
- Check application logs in `backend/logs/`
- Review email service logs for delivery issues
- Check database for OTP records
- Verify email credentials are correct

## ✅ Checklist

Before testing:
- [ ] Database migration executed
- [ ] Backend restarted with latest code
- [ ] Email credentials configured
- [ ] Frontend development server running
- [ ] Test email account available
- [ ] All routes properly configured
- [ ] Toast notifications library installed

## 🎯 Success Criteria

The password reset system is working correctly if:
1. ✅ Email with OTP is received within 30 seconds
2. ✅ OTP verification succeeds with correct code
3. ✅ OTP verification fails with incorrect code
4. ✅ OTP expires after 10 minutes
5. ✅ Password reset succeeds after OTP verification
6. ✅ User can login with new password
7. ✅ Password change confirmation email is received
8. ✅ Frontend shows appropriate feedback at each step

---

**Last Updated**: December 2024
**Version**: 1.0
**Status**: ✅ Ready for Testing
