# Password Reset with OTP - Email System

## Overview
Implemented a secure password reset system using One-Time Password (OTP) sent via email.

## Features
- ✅ 6-digit OTP generation
- ✅ OTP valid for 10 minutes
- ✅ Maximum 5 verification attempts
- ✅ HTML email templates with professional design
- ✅ Auto-cleanup of expired OTPs (hourly)
- ✅ Password strength validation
- ✅ Email confirmation after password change

## API Endpoints

### 1. Request Password Reset
```http
POST /api/auth/password-reset/request
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP has been sent to your email. Please check your inbox."
}
```

### 2. Verify OTP
```http
POST /api/auth/password-reset/verify-otp
Content-Type: application/json

{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "valid": true,
  "message": "OTP verified successfully. You can now reset your password."
}
```

### 3. Reset Password
```http
POST /api/auth/password-reset/reset
Content-Type: application/json

{
  "email": "user@example.com",
  "otp": "123456",
  "newPassword": "NewSecure123",
  "confirmPassword": "NewSecure123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password has been reset successfully. You can now login with your new password."
}
```

## Email Configuration

### Gmail Setup (Recommended for Development)

1. **Enable 2-Factor Authentication** on your Gmail account

2. **Generate App Password:**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and device
   - Copy the generated 16-character password

3. **Update `application.yml`:**
```yaml
spring:
  mail:
    host: smtp.gmail.com
    port: 587
    username: your-email@gmail.com
    password: your-16-char-app-password
```

4. **Or use environment variables:**
```bash
export MAIL_USERNAME=your-email@gmail.com
export MAIL_PASSWORD=your-app-password
```

### Other Email Providers

#### Outlook/Office365
```yaml
spring:
  mail:
    host: smtp.office365.com
    port: 587
    username: your-email@outlook.com
    password: your-password
```

#### Custom SMTP
```yaml
spring:
  mail:
    host: smtp.yourdomain.com
    port: 587
    username: your-email
    password: your-password
```

## Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

## Security Features

### OTP Security
- Cryptographically secure random number generation
- 10-minute expiration time
- Maximum 5 verification attempts
- Auto-invalidation of old OTPs when requesting new ones
- One-time use only

### Rate Limiting
- Built-in rate limiting via `RateLimitFilter`
- Prevents brute-force attacks

### Email Notifications
- Sends confirmation email after successful password change
- Alerts user if password was changed without their knowledge

## Database Schema

```sql
CREATE TABLE password_reset_otp (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    otp VARCHAR(6) NOT NULL,
    created_at DATETIME NOT NULL,
    expires_at DATETIME NOT NULL,
    used BOOLEAN NOT NULL DEFAULT FALSE,
    attempt_count INT NOT NULL DEFAULT 0,
    INDEX idx_email (email),
    INDEX idx_expires_at (expires_at)
);
```

## Testing the Flow

### Using cURL

1. **Request OTP:**
```bash
curl -X POST http://localhost:8080/api/auth/password-reset/request \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'
```

2. **Check your email** for the 6-digit OTP

3. **Verify OTP:**
```bash
curl -X POST http://localhost:8080/api/auth/password-reset/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","otp":"123456"}'
```

4. **Reset Password:**
```bash
curl -X POST http://localhost:8080/api/auth/password-reset/reset \
  -H "Content-Type: application/json" \
  -d '{
    "email":"user@example.com",
    "otp":"123456",
    "newPassword":"NewSecure123",
    "confirmPassword":"NewSecure123"
  }'
```

### Using PowerShell

1. **Request OTP:**
```powershell
Invoke-RestMethod -Method POST -Uri "http://localhost:8080/api/auth/password-reset/request" `
  -Headers @{"Content-Type"="application/json"} `
  -Body '{"email":"user@example.com"}' | ConvertTo-Json
```

2. **Verify OTP:**
```powershell
Invoke-RestMethod -Method POST -Uri "http://localhost:8080/api/auth/password-reset/verify-otp" `
  -Headers @{"Content-Type"="application/json"} `
  -Body '{"email":"user@example.com","otp":"123456"}' | ConvertTo-Json
```

3. **Reset Password:**
```powershell
Invoke-RestMethod -Method POST -Uri "http://localhost:8080/api/auth/password-reset/reset" `
  -Headers @{"Content-Type"="application/json"} `
  -Body '{"email":"user@example.com","otp":"123456","newPassword":"NewSecure123","confirmPassword":"NewSecure123"}' | ConvertTo-Json
```

## Error Handling

Common error responses:

```json
{
  "success": false,
  "message": "User not found with email: user@example.com"
}
```

```json
{
  "success": false,
  "message": "Invalid OTP. Attempts remaining: 3"
}
```

```json
{
  "success": false,
  "message": "Maximum attempts exceeded. Please request a new OTP"
}
```

```json
{
  "success": false,
  "message": "OTP is expired or invalid"
}
```

```json
{
  "success": false,
  "message": "Passwords do not match"
}
```

## Scheduled Tasks

The system automatically cleans up expired and used OTPs every hour using Spring's `@Scheduled` annotation.

## Frontend Integration

Example frontend flow:

```javascript
// 1. Request OTP
async function requestPasswordReset(email) {
  const response = await fetch('/api/auth/password-reset/request', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  return response.json();
}

// 2. Verify OTP
async function verifyOtp(email, otp) {
  const response = await fetch('/api/auth/password-reset/verify-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp })
  });
  return response.json();
}

// 3. Reset Password
async function resetPassword(email, otp, newPassword, confirmPassword) {
  const response = await fetch('/api/auth/password-reset/reset', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp, newPassword, confirmPassword })
  });
  return response.json();
}
```

## Production Considerations

1. **Use Environment Variables** for email credentials
2. **Enable SSL/TLS** in production
3. **Configure proper email server** (not Gmail for production)
4. **Add rate limiting** on password reset endpoints
5. **Monitor failed attempts** for security
6. **Use professional email service** (SendGrid, AWS SES, etc.)
7. **Customize email templates** with your branding

## Troubleshooting

### Email Not Sending
- Check Gmail App Password is correct
- Verify 2FA is enabled on Gmail
- Check firewall/network allows SMTP traffic
- Review application logs for errors

### OTP Not Received
- Check spam/junk folder
- Verify email address is correct
- Check email service logs
- Ensure email service is running

### OTP Expired
- Request a new OTP
- Check system time is synchronized
- OTP validity is 10 minutes

## Files Created

### Backend
- `entity/PasswordResetOtp.java` - OTP entity
- `repository/PasswordResetOtpRepository.java` - OTP repository
- `service/EmailService.java` - Email sending service
- `service/PasswordResetService.java` - Password reset business logic
- `controller/PasswordResetController.java` - REST endpoints
- `dto/PasswordResetRequest.java` - Request DTO
- `dto/OtpVerificationRequest.java` - Verification DTO
- `dto/NewPasswordRequest.java` - Password reset DTO

### Configuration
- Updated `pom.xml` - Added spring-boot-starter-mail
- Updated `application.yml` - Email configuration
- Updated `CarbonCalcApplication.java` - Added @EnableAsync and @EnableScheduling

## Next Steps

To complete the frontend integration, you'll need to create:

1. **Forgot Password Page** - Form to request OTP
2. **OTP Verification Page** - Input 6-digit code
3. **New Password Page** - Set new password
4. **Success/Error Messages** - User feedback

Would you like me to create the frontend components for this flow?
