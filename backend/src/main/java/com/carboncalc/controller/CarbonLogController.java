package com.carboncalc.controller;

import com.carboncalc.dto.*;
import com.carboncalc.entity.CarbonLog;
import com.carboncalc.entity.User;
import com.carboncalc.repository.CarbonLogRepository;
import com.carboncalc.repository.UserRepository;
import com.carboncalc.service.CarbonCalcService;
import com.carboncalc.service.DashboardService;
import com.carboncalc.service.LeaderboardService;
import com.carboncalc.client.CarbonInterfaceClient;
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

    @Autowired
    private CarbonInterfaceClient carbonInterfaceClient;

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
        Map<String, Object> survey = surveyData.getSurveyData();

        double transportEmission = 0.0;
        double energyEmission = 0.0;
        double flightEmission = 0.0;
        Map<String, Object> vehicleInfoData = null;

        // Transport via Carbon Interface (vehicle estimates)
        try {
            Object transportMode = survey.get("transportMode");
            Object commuteDistance = survey.get("commuteDistance"); // km
            Object vehicleInfo = survey.get("vehicleInfo");

            if (transportMode != null && vehicleInfo instanceof Map<?, ?> && commuteDistance != null) {
                @SuppressWarnings("unchecked")
                Map<String, Object> vehicle = (Map<String, Object>) vehicleInfo;
                vehicleInfoData = vehicle; // store for later use
                String modelId = vehicle.get("modelId") != null ? vehicle.get("modelId").toString() : null;
                if (modelId != null && !modelId.isBlank()) {
                    double km = Double.parseDouble(commuteDistance.toString());
                    double miles = km * 0.621371; // convert to miles for Carbon Interface
                    Double ciTransport = carbonInterfaceClient.estimateVehicleEmissions(miles, modelId);
                    transportEmission = ciTransport != null ? ciTransport : 0.0;
                }
            }
        } catch (Exception e) {
            // keep transportEmission = 0 on failure
        }

        // Electricity via Carbon Interface
        try {
            Object kwh = survey.get("electricityUsage");
            Object country = survey.get("countryCode");
            Object state = survey.get("stateCode");
            if (kwh != null && country != null) {
                Double ciEnergy = carbonInterfaceClient.estimateElectricityEmissions(
                        Double.parseDouble(kwh.toString()),
                        country.toString(),
                        state != null ? state.toString() : null);
                energyEmission = ciEnergy != null ? ciEnergy : 0.0;
            }
        } catch (Exception e) {
            // keep energyEmission = 0 on failure
        }

        // Flights via Carbon Interface (optional; uses simple estimate if legs not
        // provided)
        try {
            Object shortFlights = survey.get("shortHaulFlights");
            Object longFlights = survey.get("longHaulFlights");
            int passengers = 1;
            int shortCount = shortFlights != null ? Integer.parseInt(shortFlights.toString()) : 0;
            int longCount = longFlights != null ? Integer.parseInt(longFlights.toString()) : 0;
            // Approximate using Carbon Interface simple flight method with placeholder legs
            if (shortCount > 0) {
                flightEmission += carbonInterfaceClient.estimateFlightEmissions(500.0 * shortCount, passengers) != null
                        ? carbonInterfaceClient.estimateFlightEmissions(500.0 * shortCount, passengers)
                        : 0.0;
            }
            if (longCount > 0) {
                flightEmission += carbonInterfaceClient.estimateFlightEmissions(2500.0 * longCount, passengers) != null
                        ? carbonInterfaceClient.estimateFlightEmissions(2500.0 * longCount, passengers)
                        : 0.0;
            }
        } catch (Exception e) {
            // keep flightEmission = 0 on failure
        }

        double totalEmissions = Math.max(0.0, transportEmission + energyEmission + flightEmission);

        // Persist logs only for computed categories
        if (transportEmission > 0) {
            CarbonLog transportLog = new CarbonLog();
            transportLog.setUser(user);
            transportLog.setCategory("transportation");
            transportLog.setActivity("Survey - Daily commute (Carbon Interface)");
            transportLog.setCarbonEmission(transportEmission);
            transportLog.setLogDate(LocalDate.now());
            transportLog.setDescription("Computed via Carbon Interface");
            transportLog.setApiSource("carbon_interface");
            transportLog.setApiCalculatedAt(LocalDateTime.now());

            // Store vehicle information if available
            if (vehicleInfoData != null) {
                transportLog.setVehicleModelId(
                        vehicleInfoData.get("modelId") != null ? vehicleInfoData.get("modelId").toString() : null);
                transportLog.setVehicleMake(
                        vehicleInfoData.get("make") != null ? vehicleInfoData.get("make").toString() : null);
                transportLog.setVehicleModel(
                        vehicleInfoData.get("model") != null ? vehicleInfoData.get("model").toString() : null);
                Object year = vehicleInfoData.get("year");
                if (year != null) {
                    try {
                        transportLog.setVehicleYear(Integer.parseInt(year.toString()));
                    } catch (NumberFormatException ignored) {
                    }
                }
            }
            carbonLogRepository.save(transportLog);
        }

        if (energyEmission > 0) {
            CarbonLog energyLog = new CarbonLog();
            energyLog.setUser(user);
            energyLog.setCategory("energy");
            energyLog.setActivity("Survey - Electricity (Carbon Interface)");
            energyLog.setCarbonEmission(energyEmission);
            energyLog.setLogDate(LocalDate.now());
            energyLog.setDescription("Computed via Carbon Interface");
            energyLog.setApiSource("carbon_interface");
            energyLog.setApiCalculatedAt(LocalDateTime.now());

            // Store electricity and location details
            try {
                Object unit = survey.get("electricityUnit");
                Object country = survey.get("countryCode");
                Object state = survey.get("stateCode");

                if (unit != null)
                    energyLog.setElectricityUnit(unit.toString());
                if (country != null)
                    energyLog.setCountryCode(country.toString());
                if (state != null)
                    energyLog.setStateCode(state.toString());
            } catch (Exception ignored) {
            }

            carbonLogRepository.save(energyLog);
        }

        if (flightEmission > 0) {
            CarbonLog flightLog = new CarbonLog();
            flightLog.setUser(user);
            flightLog.setCategory("transportation");
            flightLog.setActivity("Survey - Flights (Carbon Interface)");
            flightLog.setCarbonEmission(flightEmission);
            flightLog.setLogDate(LocalDate.now());
            flightLog.setDescription("Computed via Carbon Interface");
            flightLog.setApiSource("carbon_interface");
            flightLog.setApiCalculatedAt(LocalDateTime.now());
            carbonLogRepository.save(flightLog);
        }

        // Update leaderboard with total emissions
        leaderboardService.updateLeaderboard(user.getId(), totalEmissions,
                (int) (totalEmissions * 10));

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Survey submitted via Carbon Interface",
                "totalEmissions", totalEmissions,
                "transportEmission", transportEmission,
                "energyEmission", energyEmission,
                "flightEmission", flightEmission));
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

    @PutMapping("/{id}")
    public ResponseEntity<CarbonLog> updateLog(@PathVariable Long id,
            @RequestBody CarbonLog updated,
            Principal principal) {
        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        CarbonLog existing = carbonLogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Log not found"));

        // Ensure the log belongs to the authenticated user
        if (!existing.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).build();
        }

        existing.setCategory(updated.getCategory());
        existing.setActivity(updated.getActivity());
        existing.setAmount(updated.getAmount());
        existing.setDescription(updated.getDescription());
        existing.setLogDate(updated.getLogDate());

        // Recalculate emission based on updated fields
        Double emission = carbonCalcService.calculateActivityEmission(
                existing.getCategory(), existing.getActivity(), existing.getAmount());
        existing.setCarbonEmission(emission);

        return ResponseEntity.ok(carbonLogRepository.save(existing));
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

    @GetMapping("/range")
    public ResponseEntity<List<CarbonLog>> getLogsByDateRange(@RequestParam String startDate,
            @RequestParam String endDate,
            Principal principal) {
        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        LocalDate start = LocalDate.parse(startDate);
        LocalDate end = LocalDate.parse(endDate);
        List<CarbonLog> logs = carbonLogRepository.findByUserIdAndLogDateBetween(user.getId(), start, end);
        return ResponseEntity.ok(logs);
    }
}
