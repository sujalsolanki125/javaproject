package com.carboncalc.dto;

import lombok.Data;
import java.util.Map;
import java.util.List;

@Data
public class DashboardStatsDTO {
    private Double todayEmissions;
    private String todayChange;
    private String todayTrend;
    
    private Double weeklyEmissions;
    private String weeklyChange;
    private String weeklyTrend;
    
    private Double monthlyEmissions;
    private String goalStatus;
    private String monthlyTrend;
    
    private Map<String, Double> categoryBreakdown;
    private List<GoalDTO> goals;
    private List<BadgeDTO> badges;
}
