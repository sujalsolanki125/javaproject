package com.carboncalc.repository;

import com.carboncalc.entity.PasswordResetOtp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface PasswordResetOtpRepository extends JpaRepository<PasswordResetOtp, Long> {

    Optional<PasswordResetOtp> findTopByEmailAndUsedFalseOrderByCreatedAtDesc(String email);

    Optional<PasswordResetOtp> findByEmailAndOtpAndUsedFalse(String email, String otp);

    @Modifying
    @Query("DELETE FROM PasswordResetOtp p WHERE p.expiresAt < :now OR p.used = true")
    void deleteExpiredAndUsed(LocalDateTime now);

    @Modifying
    @Query("UPDATE PasswordResetOtp p SET p.used = true WHERE p.email = :email AND p.used = false")
    void invalidateAllByEmail(String email);
}
