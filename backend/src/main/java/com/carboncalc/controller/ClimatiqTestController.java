package com.carboncalc.controller;

import com.carboncalc.client.ClimatiqClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Test controller for Climatiq API integration
 */
@Slf4j
@RestController
@RequestMapping("/api/climatiq")
@RequiredArgsConstructor
public class ClimatiqTestController {

    private final ClimatiqClient climatiqClient;

    @GetMapping("/test")
    public ResponseEntity<Map<String, Object>> testConnection() {
        log.info("Testing Climatiq API connection");

        Map<String, Object> response = new HashMap<>();

        try {
            boolean connected = climatiqClient.testConnection();
            response.put("success", connected);
            response.put("message", connected ? "Climatiq API is working!" : "Climatiq API connection failed");
            response.put("timestamp", System.currentTimeMillis());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error testing Climatiq API: {}", e.getMessage());
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/calculate/vehicle")
    public ResponseEntity<Map<String, Object>> calculateVehicle(
            @RequestParam(defaultValue = "100") double distanceKm,
            @RequestParam(defaultValue = "car") String vehicleType) {

        log.info("Calculating vehicle emissions for {} km using {}", distanceKm, vehicleType);

        Map<String, Object> response = new HashMap<>();

        try {
            double emissions = climatiqClient.calculateVehicleEmissions(distanceKm, vehicleType);

            response.put("success", true);
            response.put("distance_km", distanceKm);
            response.put("vehicle_type", vehicleType);
            response.put("co2e_kg", emissions);
            response.put("message", "Emissions calculated successfully");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error calculating vehicle emissions: {}", e.getMessage());
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/calculate/electricity")
    public ResponseEntity<Map<String, Object>> calculateElectricity(
            @RequestParam(defaultValue = "100") double energyKwh,
            @RequestParam(defaultValue = "US") String country) {

        log.info("Calculating electricity emissions for {} kWh in {}", energyKwh, country);

        Map<String, Object> response = new HashMap<>();

        try {
            double emissions = climatiqClient.calculateElectricityEmissions(energyKwh, country);

            response.put("success", true);
            response.put("energy_kwh", energyKwh);
            response.put("country", country);
            response.put("co2e_kg", emissions);
            response.put("message", "Emissions calculated successfully");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error calculating electricity emissions: {}", e.getMessage());
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/calculate/flight")
    public ResponseEntity<Map<String, Object>> calculateFlight(
            @RequestParam(defaultValue = "1000") double distanceKm,
            @RequestParam(defaultValue = "economy") String flightClass) {

        log.info("Calculating flight emissions for {} km in {} class", distanceKm, flightClass);

        Map<String, Object> response = new HashMap<>();

        try {
            double emissions = climatiqClient.calculateFlightEmissions(distanceKm, flightClass);

            response.put("success", true);
            response.put("distance_km", distanceKm);
            response.put("flight_class", flightClass);
            response.put("co2e_kg", emissions);
            response.put("message", "Emissions calculated successfully");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error calculating flight emissions: {}", e.getMessage());
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}
