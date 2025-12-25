package com.carboncalc.repository;

import com.carboncalc.entity.AdminUserProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AdminUserProfileRepository extends JpaRepository<AdminUserProfile, Long> {

    Optional<AdminUserProfile> findByUserPrimaryEmailAddress(String userPrimaryEmailAddress);

    List<AdminUserProfile> findByUserAccountRoleType(AdminUserProfile.UserAccountRoleType userAccountRoleType);

    List<AdminUserProfile> findByUserProfileStatus(AdminUserProfile.UserProfileStatus userProfileStatus);

    List<AdminUserProfile> findByUserAccountRoleTypeAndUserProfileStatus(
            AdminUserProfile.UserAccountRoleType userAccountRoleType,
            AdminUserProfile.UserProfileStatus userProfileStatus);

    @Query("SELECT u FROM AdminUserProfile u WHERE " +
            "LOWER(u.userFullDisplayName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(u.userPrimaryEmailAddress) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<AdminUserProfile> searchByNameOrEmail(@Param("searchTerm") String searchTerm);

    @Query("SELECT u FROM AdminUserProfile u WHERE u.lastActivityTimestamp >= :sinceDate")
    List<AdminUserProfile> findActiveUsersSince(@Param("sinceDate") LocalDateTime sinceDate);

    @Query("SELECT u FROM AdminUserProfile u WHERE u.totalOrdersPlacedCount > :minOrders")
    List<AdminUserProfile> findUsersWithMinimumOrders(@Param("minOrders") Integer minOrders);

    @Query("SELECT u FROM AdminUserProfile u WHERE u.lifetimeSpendingAmount >= :minSpending")
    List<AdminUserProfile> findHighValueCustomers(@Param("minSpending") Double minSpending);

    @Query("SELECT COUNT(u) FROM AdminUserProfile u WHERE u.userRegistrationTimestamp >= :sinceDate")
    Long countNewRegistrationsSince(@Param("sinceDate") LocalDateTime sinceDate);

    @Query("SELECT u FROM AdminUserProfile u ORDER BY u.lifetimeSpendingAmount DESC")
    List<AdminUserProfile> findTopCustomersBySpending();

    List<AdminUserProfile> findByAccountVerificationStatus(
            AdminUserProfile.AccountVerificationStatus accountVerificationStatus);
}