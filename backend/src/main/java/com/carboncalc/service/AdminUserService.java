package com.carboncalc.service;

import com.carboncalc.entity.AdminUserProfile;
import com.carboncalc.repository.AdminUserProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AdminUserService {

    private final AdminUserProfileRepository userRepository;

    public List<AdminUserProfile> getAllUsers() {
        log.info("Fetching all user profiles");
        return userRepository.findAll();
    }

    public Optional<AdminUserProfile> getUserById(Long adminUserProfileId) {
        log.info("Fetching user profile with ID: {}", adminUserProfileId);
        return userRepository.findById(adminUserProfileId);
    }

    public Optional<AdminUserProfile> getUserByEmail(String userPrimaryEmailAddress) {
        log.info("Fetching user profile with email: {}", userPrimaryEmailAddress);
        return userRepository.findByUserPrimaryEmailAddress(userPrimaryEmailAddress);
    }

    public List<AdminUserProfile> getUsersByRole(AdminUserProfile.UserAccountRoleType roleType) {
        log.info("Fetching users with role: {}", roleType);
        return userRepository.findByUserAccountRoleType(roleType);
    }

    public List<AdminUserProfile> getUsersByStatus(AdminUserProfile.UserProfileStatus status) {
        log.info("Fetching users with status: {}", status);
        return userRepository.findByUserProfileStatus(status);
    }

    public List<AdminUserProfile> searchUsers(String searchTerm) {
        log.info("Searching users with term: {}", searchTerm);
        return userRepository.searchByNameOrEmail(searchTerm);
    }

    public AdminUserProfile createUser(AdminUserProfile user) {
        log.info("Creating new user profile: {}", user.getUserPrimaryEmailAddress());

        // Check if user already exists
        Optional<AdminUserProfile> existingUser = userRepository.findByUserPrimaryEmailAddress(
                user.getUserPrimaryEmailAddress());
        if (existingUser.isPresent()) {
            throw new RuntimeException("User already exists with email: " + user.getUserPrimaryEmailAddress());
        }

        if (user.getUserRegistrationTimestamp() == null) {
            user.setUserRegistrationTimestamp(LocalDateTime.now());
        }
        user.setLastActivityTimestamp(LocalDateTime.now());

        return userRepository.save(user);
    }

    public AdminUserProfile updateUser(Long adminUserProfileId, AdminUserProfile updatedUser) {
        log.info("Updating user profile with ID: {}", adminUserProfileId);

        return userRepository.findById(adminUserProfileId)
                .map(existingUser -> {
                    existingUser.setUserFullDisplayName(updatedUser.getUserFullDisplayName());
                    existingUser.setUserPhoneNumber(updatedUser.getUserPhoneNumber());
                    existingUser.setUserAccountRoleType(updatedUser.getUserAccountRoleType());
                    existingUser.setUserProfileStatus(updatedUser.getUserProfileStatus());
                    existingUser.setAccountVerificationStatus(updatedUser.getAccountVerificationStatus());
                    existingUser.setLastActivityTimestamp(LocalDateTime.now());

                    return userRepository.save(existingUser);
                })
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + adminUserProfileId));
    }

    public void deleteUser(Long adminUserProfileId) {
        log.info("Deleting user profile with ID: {}", adminUserProfileId);

        if (!userRepository.existsById(adminUserProfileId)) {
            throw new RuntimeException("User not found with ID: " + adminUserProfileId);
        }

        userRepository.deleteById(adminUserProfileId);
    }

    public AdminUserProfile updateUserStatus(Long adminUserProfileId,
            AdminUserProfile.UserProfileStatus status) {
        log.info("Updating user status for ID {} to: {}", adminUserProfileId, status);

        return userRepository.findById(adminUserProfileId)
                .map(user -> {
                    user.setUserProfileStatus(status);
                    user.setLastActivityTimestamp(LocalDateTime.now());
                    return userRepository.save(user);
                })
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + adminUserProfileId));
    }

    public AdminUserProfile updateUserRole(Long adminUserProfileId,
            AdminUserProfile.UserAccountRoleType roleType) {
        log.info("Updating user role for ID {} to: {}", adminUserProfileId, roleType);

        return userRepository.findById(adminUserProfileId)
                .map(user -> {
                    user.setUserAccountRoleType(roleType);
                    user.setLastActivityTimestamp(LocalDateTime.now());
                    return userRepository.save(user);
                })
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + adminUserProfileId));
    }

    public List<AdminUserProfile> getActiveUsersSince(LocalDateTime sinceDate) {
        log.info("Fetching active users since: {}", sinceDate);
        return userRepository.findActiveUsersSince(sinceDate);
    }

    public List<AdminUserProfile> getHighValueCustomers(double minSpending) {
        log.info("Fetching high-value customers with minimum spending: {}", minSpending);
        return userRepository.findHighValueCustomers(minSpending);
    }

    public Long getNewRegistrationsCount(LocalDateTime sinceDate) {
        log.info("Counting new registrations since: {}", sinceDate);
        return userRepository.countNewRegistrationsSince(sinceDate);
    }

    public List<AdminUserProfile> getTopCustomers() {
        log.info("Fetching top customers by spending");
        return userRepository.findTopCustomersBySpending();
    }

    public AdminUserProfile updateUserSpending(Long adminUserProfileId, double additionalSpending) {
        log.info("Updating user spending for ID {}, adding: {}", adminUserProfileId, additionalSpending);

        return userRepository.findById(adminUserProfileId)
                .map(user -> {
                    double currentSpending = user.getLifetimeSpendingAmount() != null ? user.getLifetimeSpendingAmount()
                            : 0.0;
                    user.setLifetimeSpendingAmount(currentSpending + additionalSpending);

                    Integer currentOrders = user.getTotalOrdersPlacedCount() != null ? user.getTotalOrdersPlacedCount()
                            : 0;
                    user.setTotalOrdersPlacedCount(currentOrders + 1);

                    user.setLastActivityTimestamp(LocalDateTime.now());
                    return userRepository.save(user);
                })
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + adminUserProfileId));
    }
}