package com.carboncalc.dto;

import lombok.Data;

@Data
public class UserProfileDTO {
    private String fullName;
    private String email;
    private String location;
    private String ageGroup;
    private Boolean weeklyReports;
    private Boolean achievementNotifications;
}
