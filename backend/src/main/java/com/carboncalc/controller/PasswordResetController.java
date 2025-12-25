package com.carboncalc.controller;

import com.carboncalc.dto.NewPasswordRequest;
import com.carboncalc.dto.OtpVerificationRequest;
import com.carboncalc.dto.PasswordResetRequest;
import com.carboncalc.service.PasswordResetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth/password-reset")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:5173" })
public class PasswordResetController {

    private final PasswordResetService passwordResetService;

    @PostMapping("/request")
    public ResponseEntity<?> requestPasswordReset(@Valid @RequestBody PasswordResetRequest request) {
        try {
            passwordResetService.requestPasswordReset(request.getEmail());
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "OTP has been sent to your email. Please check your inbox."));
        } catch (Exception e) {
            log.error("Error requesting password reset", e);
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", e.getMessage()));
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@Valid @RequestBody OtpVerificationRequest request) {
        try {
            boolean isValid = passwordResetService.verifyOtp(request.getEmail(), request.getOtp());
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "valid", isValid,
                    "message", "OTP verified successfully. You can now reset your password."));
        } catch (Exception e) {
            log.error("Error verifying OTP", e);
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", e.getMessage()));
        }
    }

    @PostMapping("/reset")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody NewPasswordRequest request) {
        try {
            if (!request.passwordsMatch()) {
                return ResponseEntity.badRequest().body(Map.of(
                        "success", false,
                        "message", "Passwords do not match"));
            }

            passwordResetService.resetPassword(request.getEmail(), request.getOtp(), request.getNewPassword());
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Password has been reset successfully. You can now login with your new password."));
        } catch (Exception e) {
            log.error("Error resetting password", e);
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", e.getMessage()));
        }
    }
}
