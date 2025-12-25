package com.carboncalc.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Async
    public void sendSimpleEmail(String to, String subject, String text) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);

            mailSender.send(message);
            log.info("Email sent successfully to: {}", to);
        } catch (Exception e) {
            log.error("Failed to send email to: {}", to, e);
            throw new RuntimeException("Failed to send email", e);
        }
    }

    @Async
    public void sendHtmlEmail(String to, String subject, String htmlContent) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            log.info("HTML email sent successfully to: {}", to);
        } catch (MessagingException e) {
            log.error("Failed to send HTML email to: {}", to, e);
            throw new RuntimeException("Failed to send HTML email", e);
        }
    }

    public void sendPasswordResetOtp(String to, String otp, String userName) {
        String subject = "Password Reset OTP - Carbon Footprint Tracker";

        String htmlContent = """
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #10b981 0%%, #059669 100%%);
                                  color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
                        .otp-box { background: white; border: 2px solid #10b981; border-radius: 8px;
                                   padding: 20px; text-align: center; margin: 20px 0; }
                        .otp-code { font-size: 32px; font-weight: bold; color: #10b981;
                                    letter-spacing: 8px; font-family: 'Courier New', monospace; }
                        .warning { background: #fef3c7; border-left: 4px solid #f59e0b;
                                  padding: 15px; margin: 20px 0; border-radius: 4px; }
                        .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px; }
                        .button { display: inline-block; background: #10b981; color: white;
                                 padding: 12px 30px; text-decoration: none; border-radius: 6px;
                                 font-weight: bold; margin: 20px 0; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🔐 Password Reset Request</h1>
                        </div>
                        <div class="content">
                            <p>Hello <strong>%s</strong>,</p>

                            <p>We received a request to reset your password for your Carbon Footprint Tracker account.</p>

                            <div class="otp-box">
                                <p style="margin: 0; color: #6b7280; font-size: 14px;">Your OTP Code</p>
                                <div class="otp-code">%s</div>
                                <p style="margin: 10px 0 0 0; color: #6b7280; font-size: 12px;">Valid for 10 minutes</p>
                            </div>

                            <p><strong>To reset your password:</strong></p>
                            <ol>
                                <li>Enter this OTP code on the password reset page</li>
                                <li>Create a new password</li>
                                <li>Confirm your new password</li>
                            </ol>

                            <div class="warning">
                                <strong>⚠️ Security Notice:</strong><br>
                                • This OTP will expire in 10 minutes<br>
                                • You have 5 attempts to enter the correct OTP<br>
                                • Never share this code with anyone<br>
                                • If you didn't request this, please ignore this email
                            </div>

                            <p>If you didn't request a password reset, you can safely ignore this email.
                               Your password will remain unchanged.</p>

                            <div class="footer">
                                <p>Best regards,<br><strong>Carbon Footprint Tracker Team</strong></p>
                                <p style="font-size: 12px;">
                                    This is an automated message. Please do not reply to this email.<br>
                                    &copy; 2025 Carbon Footprint Tracker. All rights reserved.
                                </p>
                            </div>
                        </div>
                    </div>
                </body>
                </html>
                """
                .formatted(userName, otp);

        sendHtmlEmail(to, subject, htmlContent);
    }

    public void sendPasswordChangedNotification(String to, String userName) {
        String subject = "Password Changed Successfully - Carbon Footprint Tracker";

        String htmlContent = """
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #10b981 0%%, #059669 100%%);
                                  color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
                        .success-box { background: #d1fae5; border: 2px solid #10b981; border-radius: 8px;
                                      padding: 20px; text-align: center; margin: 20px 0; }
                        .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>✅ Password Changed Successfully</h1>
                        </div>
                        <div class="content">
                            <p>Hello <strong>%s</strong>,</p>

                            <div class="success-box">
                                <h2 style="color: #059669; margin: 0;">🔒 Your password has been changed</h2>
                            </div>

                            <p>This email confirms that your Carbon Footprint Tracker account password
                               was successfully changed.</p>

                            <p><strong>If you made this change:</strong><br>
                               No further action is required. You can now log in with your new password.</p>

                            <p><strong>If you didn't make this change:</strong><br>
                               Please contact our support team immediately at support@carboncalc.com</p>

                            <div class="footer">
                                <p>Best regards,<br><strong>Carbon Footprint Tracker Team</strong></p>
                                <p style="font-size: 12px;">
                                    &copy; 2025 Carbon Footprint Tracker. All rights reserved.
                                </p>
                            </div>
                        </div>
                    </div>
                </body>
                </html>
                """.formatted(userName);

        sendHtmlEmail(to, subject, htmlContent);
    }
}
