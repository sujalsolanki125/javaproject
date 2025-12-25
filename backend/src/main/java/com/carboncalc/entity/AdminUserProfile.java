package com.carboncalc.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.HashSet;

@Entity
@Table(name = "admin_user_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminUserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "admin_user_profile_id")
    private Long adminUserProfileId;

    @Column(name = "user_full_display_name", nullable = false, length = 200)
    private String userFullDisplayName;

    @Column(name = "user_primary_email_address", unique = true, nullable = false, length = 255)
    private String userPrimaryEmailAddress;

    @Column(name = "user_account_role_type", nullable = false, length = 30)
    @Enumerated(EnumType.STRING)
    private UserAccountRoleType userAccountRoleType = UserAccountRoleType.STANDARD_USER;

    @Column(name = "user_profile_status", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private UserProfileStatus userProfileStatus = UserProfileStatus.ACTIVE;

    @Column(name = "total_orders_placed_count")
    private Integer totalOrdersPlacedCount = 0;

    @Column(name = "lifetime_spending_amount", precision = 12)
    private Double lifetimeSpendingAmount = 0.0;

    @Column(name = "user_registration_timestamp")
    private LocalDateTime userRegistrationTimestamp;

    @Column(name = "last_activity_timestamp")
    private LocalDateTime lastActivityTimestamp;

    @Column(name = "user_geographical_location", length = 100)
    private String userGeographicalLocation;

    @Column(name = "user_phone_number", length = 20)
    private String userPhoneNumber;

    @Column(name = "marketing_emails_consent")
    private Boolean marketingEmailsConsent = true;

    @Column(name = "admin_created_account_flag")
    private Boolean adminCreatedAccountFlag = false;

    @Column(name = "account_verification_status")
    @Enumerated(EnumType.STRING)
    private AccountVerificationStatus accountVerificationStatus = AccountVerificationStatus.PENDING;

    @OneToMany(mappedBy = "customerProfile", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<AdminCustomerOrder> customerOrders = new HashSet<>();

    @CreationTimestamp
    @Column(name = "profile_created_timestamp")
    private LocalDateTime profileCreatedTimestamp;

    @UpdateTimestamp
    @Column(name = "profile_updated_timestamp")
    private LocalDateTime profileUpdatedTimestamp;

    public enum UserAccountRoleType {
        SUPER_ADMIN, ADMIN_USER, STANDARD_USER, PREMIUM_USER
    }

    public enum UserProfileStatus {
        ACTIVE, INACTIVE, SUSPENDED, BANNED, PENDING_VERIFICATION
    }

    public enum AccountVerificationStatus {
        PENDING, VERIFIED, REJECTED, EXPIRED
    }
}