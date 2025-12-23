package com.carboncalc.controller;

import com.carboncalc.dto.*;
import com.carboncalc.entity.User;
import com.carboncalc.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(Principal principal) {
        User user = userService.getUserByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(user);
    }
    
    @GetMapping("/profile")
    public ResponseEntity<UserProfileDTO> getUserProfile(Principal principal) {
        User user = userService.getUserByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        UserProfileDTO profile = new UserProfileDTO();
        profile.setFullName(user.getFirstName() != null ? user.getFirstName() + " " + user.getLastName() : user.getUsername());
        profile.setEmail(user.getEmail());
        profile.setLocation(user.getLocation());
        profile.setAgeGroup(user.getAgeGroup());
        profile.setWeeklyReports(user.getWeeklyReports() != null ? user.getWeeklyReports() : true);
        profile.setAchievementNotifications(user.getAchievementNotifications() != null ? user.getAchievementNotifications() : false);
        
        return ResponseEntity.ok(profile);
    }
    
    @PutMapping("/profile")
    public ResponseEntity<Map<String, Object>> updateProfile(
            @RequestBody UserProfileDTO profileDTO, 
            Principal principal) {
        User user = userService.getUserByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Parse full name
        if (profileDTO.getFullName() != null && !profileDTO.getFullName().isEmpty()) {
            String[] nameParts = profileDTO.getFullName().split(" ", 2);
            user.setFirstName(nameParts[0]);
            if (nameParts.length > 1) {
                user.setLastName(nameParts[1]);
            }
        }
        
        user.setLocation(profileDTO.getLocation());
        user.setAgeGroup(profileDTO.getAgeGroup());
        
        userService.updateUser(user.getId(), user);
        
        return ResponseEntity.ok(Map.of("success", true, "message", "Profile updated successfully"));
    }
    
    @PutMapping("/change-password")
    public ResponseEntity<Map<String, Object>> changePassword(
            @RequestBody PasswordChangeDTO passwordDTO,
            Principal principal) {
        User user = userService.getUserByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Verify current password
        if (!passwordEncoder.matches(passwordDTO.getCurrentPassword(), user.getPassword())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "Current password is incorrect"));
        }
        
        // Update password
        user.setPassword(passwordEncoder.encode(passwordDTO.getNewPassword()));
        userService.updateUser(user.getId(), user);
        
        return ResponseEntity.ok(Map.of("success", true, "message", "Password changed successfully"));
    }
    
    @PutMapping("/notification-preferences")
    public ResponseEntity<Map<String, Object>> updateNotificationPreferences(
            @RequestBody NotificationPreferencesDTO preferencesDTO,
            Principal principal) {
        User user = userService.getUserByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setWeeklyReports(preferencesDTO.getWeeklyReports());
        user.setAchievementNotifications(preferencesDTO.getAchievementNotifications());
        
        userService.updateUser(user.getId(), user);
        
        return ResponseEntity.ok(Map.of("success", true, "message", "Notification preferences updated"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        User user = userService.getUserById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(user);
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User user) {
        return ResponseEntity.ok(userService.updateUser(id, user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok().build();
    }
}

