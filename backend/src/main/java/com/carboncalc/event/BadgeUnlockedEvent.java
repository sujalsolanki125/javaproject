package com.carboncalc.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BadgeUnlockedEvent {
    private Long badgeId;
    private Long userId;
    private String username;
    private String badgeName;
    private String badgeIcon;
    private LocalDateTime unlockedAt;
}
