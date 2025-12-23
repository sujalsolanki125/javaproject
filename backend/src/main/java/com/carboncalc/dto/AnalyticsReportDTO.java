package com.carboncalc.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsReportDTO {
    private String reportType; // WEEKLY, MONTHLY, YEARLY
    private LocalDate startDate;
    private LocalDate endDate;
    private Double totalEmissions;
    private Double averageDailyEmissions;
    private Map<String, Double> categoryBreakdown;
    private Map<String, Double> trendAnalysis; // day/week -> emissions
    private String recommendation;
    private Integer carbonPointsEarned;
    private Integer goalsAchieved;
    private Integer badgesUnlocked;
}
