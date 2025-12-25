package com.carboncalc.controller;

import com.carboncalc.entity.AdminUserProfile;
import com.carboncalc.service.AdminUserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "http://localhost:5173")
public class AdminUserController {

    private final AdminUserService userService;

    @GetMapping
    public ResponseEntity<List<AdminUserProfile>> getAllUsers() {
        log.info("GET /api/admin/users - Fetching all users");
        List<AdminUserProfile> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AdminUserProfile> getUserById(@PathVariable Long id) {
        log.info("GET /api/admin/users/{} - Fetching user by ID", id);
        Optional<AdminUserProfile> user = userService.getUserById(id);
        return user.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<AdminUserProfile> getUserByEmail(@PathVariable String email) {
        log.info("GET /api/admin/users/email/{} - Fetching user by email", email);
        Optional<AdminUserProfile> user = userService.getUserByEmail(email);
        return user.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/role/{roleType}")
    public ResponseEntity<List<AdminUserProfile>> getUsersByRole(
            @PathVariable AdminUserProfile.UserAccountRoleType roleType) {
        log.info("GET /api/admin/users/role/{} - Fetching users by role", roleType);
        List<AdminUserProfile> users = userService.getUsersByRole(roleType);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<AdminUserProfile>> getUsersByStatus(
            @PathVariable AdminUserProfile.UserProfileStatus status) {
        log.info("GET /api/admin/users/status/{} - Fetching users by status", status);
        List<AdminUserProfile> users = userService.getUsersByStatus(status);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/search")
    public ResponseEntity<List<AdminUserProfile>> searchUsers(@RequestParam String term) {
        log.info("GET /api/admin/users/search?term={} - Searching users", term);
        List<AdminUserProfile> users = userService.searchUsers(term);
        return ResponseEntity.ok(users);
    }

    @PostMapping
    public ResponseEntity<AdminUserProfile> createUser(@RequestBody AdminUserProfile user) {
        log.info("POST /api/admin/users - Creating new user: {}", user.getUserPrimaryEmailAddress());
        try {
            AdminUserProfile createdUser = userService.createUser(user);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
        } catch (RuntimeException e) {
            log.error("Error creating user: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<AdminUserProfile> updateUser(
            @PathVariable Long id, @RequestBody AdminUserProfile user) {
        log.info("PUT /api/admin/users/{} - Updating user", id);
        try {
            AdminUserProfile updatedUser = userService.updateUser(id, user);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            log.error("Error updating user: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        log.info("DELETE /api/admin/users/{} - Deleting user", id);
        try {
            userService.deleteUser(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            log.error("Error deleting user: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<AdminUserProfile> updateUserStatus(
            @PathVariable Long id,
            @RequestParam AdminUserProfile.UserProfileStatus status) {
        log.info("PATCH /api/admin/users/{}/status - Updating user status to: {}", id, status);
        try {
            AdminUserProfile updatedUser = userService.updateUserStatus(id, status);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            log.error("Error updating user status: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{id}/role")
    public ResponseEntity<AdminUserProfile> updateUserRole(
            @PathVariable Long id,
            @RequestParam AdminUserProfile.UserAccountRoleType roleType) {
        log.info("PATCH /api/admin/users/{}/role - Updating user role to: {}", id, roleType);
        try {
            AdminUserProfile updatedUser = userService.updateUserRole(id, roleType);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            log.error("Error updating user role: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/active")
    public ResponseEntity<List<AdminUserProfile>> getActiveUsers(@RequestParam(required = false) Integer days) {
        log.info("GET /api/admin/users/active?days={} - Fetching active users", days);
        LocalDateTime sinceDate = days != null ? LocalDateTime.now().minusDays(days)
                : LocalDateTime.now().minusDays(30);

        List<AdminUserProfile> users = userService.getActiveUsersSince(sinceDate);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/high-value")
    public ResponseEntity<List<AdminUserProfile>> getHighValueCustomers(
            @RequestParam(defaultValue = "1000.0") double minSpending) {
        log.info("GET /api/admin/users/high-value?minSpending={} - Fetching high-value customers", minSpending);
        List<AdminUserProfile> users = userService.getHighValueCustomers(minSpending);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/top-customers")
    public ResponseEntity<List<AdminUserProfile>> getTopCustomers() {
        log.info("GET /api/admin/users/top-customers - Fetching top customers");
        List<AdminUserProfile> users = userService.getTopCustomers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getUserStats(@RequestParam(required = false) Integer days) {
        log.info("GET /api/admin/users/stats?days={} - Fetching user statistics", days);

        LocalDateTime sinceDate = days != null ? LocalDateTime.now().minusDays(days)
                : LocalDateTime.now().minusDays(30);

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userService.getAllUsers().size());
        stats.put("activeUsers", userService.getActiveUsersSince(sinceDate).size());
        stats.put("newRegistrations", userService.getNewRegistrationsCount(sinceDate));
        stats.put("highValueCustomers", userService.getHighValueCustomers(1000.0).size());

        return ResponseEntity.ok(stats);
    }

    @PostMapping("/{id}/spending")
    public ResponseEntity<AdminUserProfile> updateUserSpending(
            @PathVariable Long id,
            @RequestParam double amount) {
        log.info("POST /api/admin/users/{}/spending - Adding spending amount: {}", id, amount);
        try {
            AdminUserProfile updatedUser = userService.updateUserSpending(id, amount);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            log.error("Error updating user spending: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }
}