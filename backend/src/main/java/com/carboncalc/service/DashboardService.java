package com.carboncalc.service;

import com.carboncalc.dto.*;
import com.carboncalc.entity.CarbonLog;
import com.carboncalc.entity.User;
import com.carboncalc.repository.CarbonLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    @Autowired
    private CarbonLogRepository carbonLogRepository;

    public DashboardStatsDTO calculateDashboardStats(User user) {
        DashboardStatsDTO stats = new DashboardStatsDTO();

        List<CarbonLog> allLogs = carbonLogRepository.findByUserId(user.getId());

        // Calculate today's emissions
        LocalDate today = LocalDate.now();
        Double todayEmissions = allLogs.stream()
                .filter(log -> log.getLogDate() != null && log.getLogDate().equals(today))
                .mapToDouble(CarbonLog::getCarbonEmission)
                .sum();
        stats.setTodayEmissions(todayEmissions);

        // Calculate yesterday's emissions for comparison
        LocalDate yesterday = today.minusDays(1);
        Double yesterdayEmissions = allLogs.stream()
                .filter(log -> log.getLogDate() != null && log.getLogDate().equals(yesterday))
                .mapToDouble(CarbonLog::getCarbonEmission)
                .sum();

        if (yesterdayEmissions > 0) {
            double percentChange = ((todayEmissions - yesterdayEmissions) / yesterdayEmissions) * 100;
            stats.setTodayChange(String.format("%+.1f%%", percentChange));
            stats.setTodayTrend(percentChange > 0 ? "up" : percentChange < 0 ? "down" : "neutral");
        } else {
            stats.setTodayChange("+0%");
            stats.setTodayTrend("neutral");
        }

        // Calculate weekly emissions
        LocalDate weekStart = today.minusDays(7);
        Double weeklyEmissions = allLogs.stream()
                .filter(log -> log.getLogDate() != null && log.getLogDate().isAfter(weekStart))
                .mapToDouble(CarbonLog::getCarbonEmission)
                .sum();
        stats.setWeeklyEmissions(weeklyEmissions);

        // Calculate last week's emissions for comparison
        LocalDate lastWeekStart = weekStart.minusDays(7);
        Double lastWeekEmissions = allLogs.stream()
                .filter(log -> log.getLogDate() != null &&
                        log.getLogDate().isAfter(lastWeekStart) &&
                        log.getLogDate().isBefore(weekStart))
                .mapToDouble(CarbonLog::getCarbonEmission)
                .sum();

        if (lastWeekEmissions > 0) {
            double percentChange = ((weeklyEmissions - lastWeekEmissions) / lastWeekEmissions) * 100;
            stats.setWeeklyChange(String.format("%+.1f%%", percentChange));
            stats.setWeeklyTrend(percentChange > 0 ? "up" : percentChange < 0 ? "down" : "neutral");
        } else {
            stats.setWeeklyChange("0%");
            stats.setWeeklyTrend("neutral");
        }

        // Calculate monthly emissions
        LocalDate monthStart = today.withDayOfMonth(1);
        Double monthlyEmissions = allLogs.stream()
                .filter(log -> log.getLogDate() != null && log.getLogDate().isAfter(monthStart.minusDays(1)))
                .mapToDouble(CarbonLog::getCarbonEmission)
                .sum();
        stats.setMonthlyEmissions(monthlyEmissions);

        // Goal status (example: 200kg CO2e per month target)
        double monthlyGoal = 200.0;
        if (monthlyEmissions < monthlyGoal) {
            stats.setGoalStatus("On track");
            stats.setMonthlyTrend("down");
        } else {
            stats.setGoalStatus("Above target");
            stats.setMonthlyTrend("up");
        }

        // Category breakdown
        Map<String, Double> categoryBreakdown = allLogs.stream()
                .filter(log -> log.getLogDate() != null && log.getLogDate().isAfter(monthStart.minusDays(1)))
                .collect(Collectors.groupingBy(
                        CarbonLog::getCategory,
                        Collectors.summingDouble(CarbonLog::getCarbonEmission)));

        // Normalize category names to match frontend
        Map<String, Double> normalizedBreakdown = new HashMap<>();
        normalizedBreakdown.put("transportation", categoryBreakdown.getOrDefault("transportation", 0.0));
        normalizedBreakdown.put("diet", categoryBreakdown.getOrDefault("food", 0.0));
        normalizedBreakdown.put("energy", categoryBreakdown.getOrDefault("energy", 0.0));
        normalizedBreakdown.put("lifestyle", categoryBreakdown.getOrDefault("waste", 0.0));

        stats.setCategoryBreakdown(normalizedBreakdown);

        // Mock goals and badges (TODO: implement from database)
        List<GoalDTO> goals = new ArrayList<>();
        GoalDTO goal1 = new GoalDTO();
        goal1.setTitle("Reduce transport by 10%");
        goal1.setProgress(65);
        goals.add(goal1);

        GoalDTO goal2 = new GoalDTO();
        goal2.setTitle("3 Meatless Days a Week");
        goal2.setProgress(80);
        goals.add(goal2);

        stats.setGoals(goals);

        List<BadgeDTO> badges = new ArrayList<>();
        BadgeDTO badge1 = new BadgeDTO();
        badge1.setName("Eco-Commuter");
        badge1.setIcon("military_tech");
        badge1.setColor("yellow-500");
        badge1.setUnlocked(true);
        badges.add(badge1);

        stats.setBadges(badges);

        return stats;
    }
}
