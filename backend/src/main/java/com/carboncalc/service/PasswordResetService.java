package com.carboncalc.service;

import com.carboncalc.entity.PasswordResetOtp;
import com.carboncalc.entity.User;
import com.carboncalc.repository.PasswordResetOtpRepository;
import com.carboncalc.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class PasswordResetService {

    private final PasswordResetOtpRepository otpRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    private final SecureRandom secureRandom = new SecureRandom();

    @Transactional
    public void requestPasswordReset(String email) {
        log.info("Password reset requested for email: {}", email);

        // Check if user exists
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        // Invalidate all previous OTPs for this email
        otpRepository.invalidateAllByEmail(email);

        // Generate 6-digit OTP
        String otp = generateOtp();

        // Save OTP
        PasswordResetOtp resetOtp = new PasswordResetOtp();
        resetOtp.setEmail(email);
        resetOtp.setOtp(otp);
        otpRepository.save(resetOtp);

        // Send OTP via email
        String userName = getUserFullName(user);
        emailService.sendPasswordResetOtp(email, otp, userName);

        log.info("OTP sent successfully to: {}", email);
    }

    @Transactional
    public boolean verifyOtp(String email, String otp) {
        log.info("Verifying OTP for email: {}", email);

        PasswordResetOtp resetOtp = otpRepository.findTopByEmailAndUsedFalseOrderByCreatedAtDesc(email)
                .orElseThrow(() -> new RuntimeException("No active OTP found for this email"));

        if (!resetOtp.isValid()) {
            log.warn("Invalid OTP attempt for email: {}", email);
            throw new RuntimeException("OTP is expired or invalid");
        }

        resetOtp.incrementAttempt();
        otpRepository.save(resetOtp);

        if (!resetOtp.getOtp().equals(otp)) {
            if (resetOtp.getAttemptCount() >= 5) {
                resetOtp.markAsUsed();
                otpRepository.save(resetOtp);
                throw new RuntimeException("Maximum attempts exceeded. Please request a new OTP");
            }
            throw new RuntimeException("Invalid OTP. Attempts remaining: " + (5 - resetOtp.getAttemptCount()));
        }

        log.info("OTP verified successfully for email: {}", email);
        return true;
    }

    @Transactional
    public void resetPassword(String email, String otp, String newPassword) {
        log.info("Resetting password for email: {}", email);

        // Verify OTP
        PasswordResetOtp resetOtp = otpRepository.findByEmailAndOtpAndUsedFalse(email, otp)
                .orElseThrow(() -> new RuntimeException("Invalid or expired OTP"));

        if (!resetOtp.isValid()) {
            throw new RuntimeException("OTP is expired or invalid");
        }

        // Get user
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Update password
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // Mark OTP as used
        resetOtp.markAsUsed();
        otpRepository.save(resetOtp);

        // Send confirmation email
        String userName = getUserFullName(user);
        emailService.sendPasswordChangedNotification(email, userName);

        log.info("Password reset successfully for email: {}", email);
    }

    private String generateOtp() {
        // Generate 6-digit OTP
        int otp = 100000 + secureRandom.nextInt(900000);
        return String.valueOf(otp);
    }

    private String getUserFullName(User user) {
        if (user.getFirstName() != null && user.getLastName() != null) {
            return user.getFirstName() + " " + user.getLastName();
        } else if (user.getFirstName() != null) {
            return user.getFirstName();
        } else {
            return user.getUsername();
        }
    }

    @Scheduled(cron = "0 0 * * * *") // Run every hour
    @Transactional
    public void cleanupExpiredOtps() {
        log.info("Cleaning up expired OTPs");
        otpRepository.deleteExpiredAndUsed(LocalDateTime.now());
    }

    public boolean isOtpValid(String email, String otp) {
        try {
            return verifyOtp(email, otp);
        } catch (Exception e) {
            return false;
        }
    }
}
