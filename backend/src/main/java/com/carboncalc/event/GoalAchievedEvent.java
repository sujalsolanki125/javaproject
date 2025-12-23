package com.carboncalc.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GoalAchievedEvent {
    private Long goalId;
    private Long userId;
    private String username;
    private String goalTitle;
    private Integer progress;
    private LocalDateTime achievedAt;
}
