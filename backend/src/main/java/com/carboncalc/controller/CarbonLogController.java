package com.carboncalc.controller;

import com.carboncalc.dto.*;
import com.carboncalc.entity.CarbonLog;
import com.carboncalc.entity.User;
import com.carboncalc.repository.CarbonLogRepository;
import com.carboncalc.repository.UserRepository;
import com.carboncalc.service.CarbonCalcService;
import com.carboncalc.service.DashboardService;
import com.carboncalc.service.LeaderboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/carbon-logs")
@CrossOrigin(origins = "*")
public class CarbonLogController {

    @Autowired
    private CarbonLogRepository carbonLogRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CarbonCalcService carbonCalcService;

    @Autowired
    private DashboardService dashboardService;

    @Autowired
    private LeaderboardService leaderboardService;

    @PostMapping
    public ResponseEntity<CarbonLog> createLog(@RequestBody CarbonLog log, Principal principal) {
        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        log.setUser(user);

        // Calculate carbon emission
        Double emission = carbonCalcService.calculateActivityEmission(
                log.getCategory(), log.getActivity(), log.getAmount());
        log.setCarbonEmission(emission);

        return ResponseEntity.ok(carbonLogRepository.save(log));
    }

    @PostMapping("/from-survey")
    public ResponseEntity<Map<String, Object>> createLogFromSurvey(
            @RequestBody SurveySubmissionDTO surveyData,
            Principal principal) {
        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Create carbon logs for each category
        Map<String, Double> breakdown = surveyData.getBreakdown();

        // Transportation log
        if (breakdown.containsKey("transportation") && breakdown.get("transportation") > 0) {
            CarbonLog transportLog = new CarbonLog();
            transportLog.setUser(user);
            transportLog.setCategory("transportation");
            transportLog.setActivity("Survey - Daily commute and travel");
            transportLog.setCarbonEmission(breakdown.get("transportation"));
            transportLog.setLogDate(LocalDate.now());
            transportLog.setDescription("From carbon footprint survey");
            carbonLogRepository.save(transportLog);
        }

        // Diet log
        if (breakdown.containsKey("diet") && breakdown.get("diet") > 0) {
            CarbonLog dietLog = new CarbonLog();
            dietLog.setUser(user);
            dietLog.setCategory("food");
            dietLog.setActivity("Survey - Diet type");
            dietLog.setCarbonEmission(breakdown.get("diet"));
            dietLog.setLogDate(LocalDate.now());
            dietLog.setDescription("From carbon footprint survey");
            carbonLogRepository.save(dietLog);
        }

        // Energy log
        if (breakdown.containsKey("energy") && breakdown.get("energy") > 0) {
            CarbonLog energyLog = new CarbonLog();
            energyLog.setUser(user);
            energyLog.setCategory("energy");
            energyLog.setActivity("Survey - Home energy usage");
            energyLog.setCarbonEmission(breakdown.get("energy"));
            energyLog.setLogDate(LocalDate.now());
            energyLog.setDescription("From carbon footprint survey");
            carbonLogRepository.save(energyLog);
        }

        // Lifestyle log (if negative, it's a reduction)
        if (breakdown.containsKey("lifestyle")) {
            CarbonLog lifestyleLog = new CarbonLog();
            lifestyleLog.setUser(user);
            lifestyleLog.setCategory("waste");
            lifestyleLog.setActivity("Survey - Eco-friendly habits");
            lifestyleLog.setCarbonEmission(breakdown.get("lifestyle"));
            lifestyleLog.setLogDate(LocalDate.now());
            lifestyleLog.setDescription("Carbon reduction from eco-friendly habits");
            carbonLogRepository.save(lifestyleLog);
        }

        // Update leaderboard with total emissions
        leaderboardService.updateLeaderboard(user.getId(), surveyData.getTotalEmissions(),
                (int) (surveyData.getTotalEmissions() * 10));

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Survey submitted successfully",
                "totalEmissions", surveyData.getTotalEmissions()));
    }

    @GetMapping("/dashboard-stats")
    public ResponseEntity<DashboardStatsDTO> getDashboardStats(Principal principal) {
        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        DashboardStatsDTO stats = dashboardService.calculateDashboardStats(user);
        return ResponseEntity.ok(stats);
    }

    @GetMapping
    public ResponseEntity<List<CarbonLog>> getUserLogs(Principal principal) {
        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(carbonLogRepository.findByUserId(user.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CarbonLog> getLogById(@PathVariable Long id) {
        CarbonLog log = carbonLogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Log not found"));
        return ResponseEntity.ok(log);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteLog(@PathVariable Long id) {
        carbonLogRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/total")
    public ResponseEntity<Double> getTotalCarbon(Principal principal) {
        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Double total = carbonLogRepository.getTotalCarbonByUserId(user.getId());
        return ResponseEntity.ok(total != null ? total : 0.0);
    }

    @GetMapping("/trend")
    public ResponseEntity<Map<String, Double>> getTrendData(
            @RequestParam(defaultValue = "30") int days,
            Principal principal) {
        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(days - 1);

        List<CarbonLog> logs = carbonLogRepository.findByUserIdAndLogDateBetween(
                user.getId(), startDate, endDate);

        // Group by date and sum emissions
        Map<String, Double> trendData = new LinkedHashMap<>();
        for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
            final LocalDate currentDate = date;
            double dailyTotal = logs.stream()
                    .filter(log -> log.getLogDate() != null && log.getLogDate().equals(currentDate))
                    .mapToDouble(CarbonLog::getCarbonEmission)
                    .sum();
            trendData.put(currentDate.toString(), dailyTotal);
        }

        return ResponseEntity.ok(trendData);
    }
}
