package com.carboncalc.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserNotificationEvent {
    private Long userId;
    private String username;
    private String notificationType; // GOAL, BADGE, ALERT, SYSTEM
    private String title;
    private String message;
    private String priority; // LOW, MEDIUM, HIGH, CRITICAL
    private LocalDateTime createdAt;
}
