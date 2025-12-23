package com.carboncalc.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CarbonLogCreatedEvent {
    private Long logId;
    private Long userId;
    private String username;
    private Double carbonEmission;
    private String category;
    private LocalDateTime createdAt;
}
