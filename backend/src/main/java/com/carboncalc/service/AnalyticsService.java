package com.carboncalc.service;

import com.carboncalc.dto.AnalyticsReportDTO;
import com.carboncalc.entity.CarbonLog;
import com.carboncalc.entity.User;
import com.carboncalc.repository.CarbonLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Analytics and Reporting Service
 * Generates comprehensive reports for users
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final CarbonLogRepository carbonLogRepository;

    /**
     * Generate weekly report for user
     */
    @Cacheable(value = "analyticsReports", key = "'weekly_' + #user.id + '_' + #startDate")
    public AnalyticsReportDTO generateWeeklyReport(User user, LocalDate startDate) {
        LocalDate endDate = startDate.plusDays(6);
        return generateReport(user, startDate, endDate, "WEEKLY");
    }

    /**
     * Generate monthly report for user
     */
    @Cacheable(value = "analyticsReports", key = "'monthly_' + #user.id + '_' + #startDate")
    public AnalyticsReportDTO generateMonthlyReport(User user, LocalDate startDate) {
        LocalDate endDate = startDate.with(TemporalAdjusters.lastDayOfMonth());
        return generateReport(user, startDate, endDate, "MONTHLY");
    }

    /**
     * Generate yearly report for user
     */
    @Cacheable(value = "analyticsReports", key = "'yearly_' + #user.id + '_' + #year")
    public AnalyticsReportDTO generateYearlyReport(User user, int year) {
        LocalDate startDate = LocalDate.of(year, 1, 1);
        LocalDate endDate = LocalDate.of(year, 12, 31);
        return generateReport(user, startDate, endDate, "YEARLY");
    }

    /**
     * Core report generation logic
     */
    private AnalyticsReportDTO generateReport(User user, LocalDate startDate, LocalDate endDate, String reportType) {
        log.info("Generating {} report for user {} from {} to {}", reportType, user.getUsername(), startDate, endDate);

        // Fetch carbon logs for date range
        List<CarbonLog> logs = carbonLogRepository.findByUserAndLogDateBetween(user, startDate, endDate);

        // Calculate total emissions
        Double totalEmissions = logs.stream()
                .mapToDouble(CarbonLog::getCarbonEmission)
                .sum();

        // Calculate average daily emissions
        long days = endDate.toEpochDay() - startDate.toEpochDay() + 1;
        Double averageDailyEmissions = totalEmissions / days;

        // Category breakdown
        Map<String, Double> categoryBreakdown = logs.stream()
                .collect(Collectors.groupingBy(
                        log -> normalizeCategoryName(log.getCategory()),
                        Collectors.summingDouble(CarbonLog::getCarbonEmission)));

        // Trend analysis (day-by-day or week-by-week)
        Map<String, Double> trendAnalysis = calculateTrendAnalysis(logs, reportType);

        // Generate recommendation
        String recommendation = generateRecommendation(categoryBreakdown, totalEmissions);

        // Calculate gamification metrics
        // TODO: Fetch from actual goals/badges tables
        Integer carbonPointsEarned = calculateCarbonPoints(totalEmissions);
        Integer goalsAchieved = 0; // Placeholder
        Integer badgesUnlocked = 0; // Placeholder

        return new AnalyticsReportDTO(
                reportType,
                startDate,
                endDate,
                Math.round(totalEmissions * 100.0) / 100.0,
                Math.round(averageDailyEmissions * 100.0) / 100.0,
                categoryBreakdown,
                trendAnalysis,
                recommendation,
                carbonPointsEarned,
                goalsAchieved,
                badgesUnlocked);
    }

    /**
     * Calculate trend analysis based on report type
     */
    private Map<String, Double> calculateTrendAnalysis(List<CarbonLog> logs, String reportType) {
        if ("WEEKLY".equals(reportType)) {
            // Day-by-day breakdown
            return logs.stream()
                    .collect(Collectors.groupingBy(
                            log -> log.getLogDate().getDayOfWeek().toString(),
                            Collectors.summingDouble(CarbonLog::getCarbonEmission)));
        } else if ("MONTHLY".equals(reportType)) {
            // Week-by-week breakdown
            return logs.stream()
                    .collect(Collectors.groupingBy(
                            log -> "Week " + log.getLogDate().get(java.time.temporal.WeekFields.ISO.weekOfMonth()),
                            Collectors.summingDouble(CarbonLog::getCarbonEmission)));
        } else {
            // Month-by-month breakdown
            return logs.stream()
                    .collect(Collectors.groupingBy(
                            log -> log.getLogDate().getMonth().toString(),
                            Collectors.summingDouble(CarbonLog::getCarbonEmission)));
        }
    }

    /**
     * Generate personalized recommendation
     */
    private String generateRecommendation(Map<String, Double> categoryBreakdown, Double totalEmissions) {
        // Find highest emission category
        String highestCategory = categoryBreakdown.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("general");

        Double highestEmission = categoryBreakdown.getOrDefault(highestCategory, 0.0);
        Double percentage = (highestEmission / totalEmissions) * 100;

        return switch (highestCategory.toLowerCase()) {
            case "transportation" -> String.format(
                    "Transportation accounts for %.0f%% of your emissions. Consider carpooling, public transport, or cycling for short trips.",
                    percentage);
            case "diet", "food" -> String.format(
                    "Food choices contribute %.0f%% of your carbon footprint. Try incorporating more plant-based meals.",
                    percentage);
            case "energy" -> String.format(
                    "Energy usage is %.0f%% of your footprint. Switch to LED bulbs and unplug devices when not in use.",
                    percentage);
            case "waste", "lifestyle" -> String.format(
                    "Lifestyle habits account for %.0f%%. Reduce single-use plastics and increase recycling.",
                    percentage);
            default -> "Great job tracking your emissions! Keep up the sustainable practices.";
        };
    }

    /**
     * Calculate carbon points based on emissions
     * Lower emissions = more points
     */
    private Integer calculateCarbonPoints(Double emissions) {
        // Award points inversely proportional to emissions
        // Max 100 points for < 50kg, decreasing scale
        if (emissions < 50)
            return 100;
        if (emissions < 100)
            return 80;
        if (emissions < 200)
            return 60;
        if (emissions < 500)
            return 40;
        return 20;
    }

    /**
     * Normalize category names
     */
    private String normalizeCategoryName(String category) {
        if (category == null)
            return "other";

        return switch (category.toLowerCase()) {
            case "food" -> "diet";
            case "waste" -> "lifestyle";
            default -> category.toLowerCase();
        };
    }

    /**
     * Get emissions comparison with previous period
     */
    public Map<String, Object> getEmissionsComparison(User user, LocalDate currentStart, LocalDate currentEnd) {
        long days = currentEnd.toEpochDay() - currentStart.toEpochDay() + 1;
        LocalDate previousStart = currentStart.minusDays(days);
        LocalDate previousEnd = currentStart.minusDays(1);

        Double currentEmissions = carbonLogRepository.findByUserAndLogDateBetween(user, currentStart, currentEnd)
                .stream().mapToDouble(CarbonLog::getCarbonEmission).sum();

        Double previousEmissions = carbonLogRepository.findByUserAndLogDateBetween(user, previousStart, previousEnd)
                .stream().mapToDouble(CarbonLog::getCarbonEmission).sum();

        Double percentChange = previousEmissions > 0
                ? ((currentEmissions - previousEmissions) / previousEmissions) * 100
                : 0.0;

        String trend = percentChange > 0 ? "up" : percentChange < 0 ? "down" : "neutral";

        return Map.of(
                "current", currentEmissions,
                "previous", previousEmissions,
                "percentChange", Math.round(Math.abs(percentChange) * 100.0) / 100.0,
                "trend", trend);
    }
}
