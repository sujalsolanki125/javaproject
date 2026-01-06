package com.carboncalc.client;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

/**
 * Client for Climatiq API
 * Provides accurate carbon emission calculations for various activities
 * API Docs: https://www.climatiq.io/docs
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ClimatiqClient {

    @Value("${climatiq.api.key}")
    private String apiKey;

    @Value("${climatiq.api.url:https://api.climatiq.io}")
    private String baseUrl;

    private final WebClient webClient;

    /**
     * Calculate emissions for vehicle travel
     * 
     * @param distanceKm  Distance traveled in kilometers
     * @param vehicleType Type of vehicle (car, bus, etc.)
     * @return CO2 emissions in kg
     */
    public double calculateVehicleEmissions(double distanceKm, String vehicleType) {
        try {
            log.info("Calculating vehicle emissions for {} km using {}", distanceKm, vehicleType);

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("emission_factor", getVehicleEmissionFactor(vehicleType));
            requestBody.put("parameters", Map.of(
                    "distance", distanceKm,
                    "distance_unit", "km"));

            Map<String, Object> response = webClient.post()
                    .uri(baseUrl + "/estimate")
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                    .header(HttpHeaders.CONTENT_TYPE, "application/json")
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .timeout(Duration.ofSeconds(10))
                    .block();

            if (response != null && response.containsKey("co2e")) {
                double emissions = ((Number) response.get("co2e")).doubleValue();
                log.info("Vehicle emissions calculated: {} kg CO2e", emissions);
                return emissions;
            }

            log.warn("No emissions data in response, using fallback calculation");
            return calculateFallbackVehicleEmissions(distanceKm, vehicleType);

        } catch (WebClientResponseException e) {
            log.error("HTTP error calculating vehicle emissions: {} - {}", e.getStatusCode(),
                    e.getResponseBodyAsString());
            return calculateFallbackVehicleEmissions(distanceKm, vehicleType);
        } catch (Exception e) {
            log.error("Error calculating vehicle emissions: {}", e.getMessage());
            return calculateFallbackVehicleEmissions(distanceKm, vehicleType);
        }
    }

    /**
     * Calculate emissions for electricity consumption
     * 
     * @param energyKwh Energy consumed in kWh
     * @param country   Country code (e.g., "US", "GB")
     * @return CO2 emissions in kg
     */
    public double calculateElectricityEmissions(double energyKwh, String country) {
        try {
            log.info("Calculating electricity emissions for {} kWh in {}", energyKwh, country);

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("emission_factor", Map.of(
                    "activity_id", "electricity-supply_grid-source_residual_mix",
                    "region", country,
                    "source", "IPCC"));
            requestBody.put("parameters", Map.of(
                    "energy", energyKwh,
                    "energy_unit", "kWh"));

            Map<String, Object> response = webClient.post()
                    .uri(baseUrl + "/estimate")
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                    .header(HttpHeaders.CONTENT_TYPE, "application/json")
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .timeout(Duration.ofSeconds(10))
                    .block();

            if (response != null && response.containsKey("co2e")) {
                double emissions = ((Number) response.get("co2e")).doubleValue();
                log.info("Electricity emissions calculated: {} kg CO2e", emissions);
                return emissions;
            }

            log.warn("No emissions data in response, using fallback");
            return calculateFallbackElectricityEmissions(energyKwh, country);

        } catch (Exception e) {
            log.error("Error calculating electricity emissions: {}", e.getMessage());
            return calculateFallbackElectricityEmissions(energyKwh, country);
        }
    }

    /**
     * Calculate emissions for flights
     * 
     * @param distanceKm  Flight distance in kilometers
     * @param flightClass Class of travel (economy, business, first)
     * @return CO2 emissions in kg
     */
    public double calculateFlightEmissions(double distanceKm, String flightClass) {
        try {
            log.info("Calculating flight emissions for {} km in {} class", distanceKm, flightClass);

            String activityId = getFlightActivityId(distanceKm, flightClass);

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("emission_factor", Map.of(
                    "activity_id", activityId,
                    "source", "IPCC"));
            requestBody.put("parameters", Map.of(
                    "passengers", 1,
                    "distance", distanceKm,
                    "distance_unit", "km"));

            Map<String, Object> response = webClient.post()
                    .uri(baseUrl + "/estimate")
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                    .header(HttpHeaders.CONTENT_TYPE, "application/json")
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .timeout(Duration.ofSeconds(10))
                    .block();

            if (response != null && response.containsKey("co2e")) {
                double emissions = ((Number) response.get("co2e")).doubleValue();
                log.info("Flight emissions calculated: {} kg CO2e", emissions);
                return emissions;
            }

            return calculateFallbackFlightEmissions(distanceKm, flightClass);

        } catch (Exception e) {
            log.error("Error calculating flight emissions: {}", e.getMessage());
            return calculateFallbackFlightEmissions(distanceKm, flightClass);
        }
    }

    // ==================== Helper Methods ====================

    private Map<String, String> getVehicleEmissionFactor(String vehicleType) {
        String activityId;
        switch (vehicleType.toLowerCase()) {
            case "car":
            case "passenger_vehicle":
                activityId = "passenger_vehicle-vehicle_type_car-fuel_source_na-engine_size_na-vehicle_age_na-vehicle_weight_na";
                break;
            case "bus":
                activityId = "passenger_vehicle-vehicle_type_bus-fuel_source_na-engine_size_na-vehicle_age_na-vehicle_weight_na";
                break;
            case "motorcycle":
                activityId = "passenger_vehicle-vehicle_type_motorbike-fuel_source_na-engine_size_na-vehicle_age_na-vehicle_weight_na";
                break;
            case "van":
                activityId = "passenger_vehicle-vehicle_type_van-fuel_source_na-engine_size_na-vehicle_age_na-vehicle_weight_na";
                break;
            default:
                activityId = "passenger_vehicle-vehicle_type_car-fuel_source_na-engine_size_na-vehicle_age_na-vehicle_weight_na";
        }

        return Map.of(
                "activity_id", activityId,
                "source", "BEIS",
                "region", "GB",
                "year", "2021");
    }

    private String getFlightActivityId(double distanceKm, String flightClass) {
        String range;
        if (distanceKm < 500) {
            range = "short_haul";
        } else if (distanceKm < 3700) {
            range = "medium_haul";
        } else {
            range = "long_haul";
        }

        String classType = flightClass != null ? flightClass.toLowerCase() : "economy";
        return String.format("passenger_flight-%s-flight_class_%s-aircraft_type_na-distance_na-contrails_included",
                range, classType);
    }

    // ==================== Fallback Calculations ====================

    private double calculateFallbackVehicleEmissions(double distanceKm, String vehicleType) {
        log.info("Using fallback calculation for vehicle emissions");
        // Average emissions: 0.2 kg CO2 per km for cars
        double emissionFactor = switch (vehicleType.toLowerCase()) {
            case "car", "passenger_vehicle" -> 0.2;
            case "bus" -> 0.1; // Per passenger
            case "motorcycle" -> 0.15;
            case "van" -> 0.25;
            default -> 0.2;
        };
        return distanceKm * emissionFactor;
    }

    private double calculateFallbackElectricityEmissions(double energyKwh, String country) {
        log.info("Using fallback calculation for electricity emissions");
        // Average global grid emission factor: 0.5 kg CO2/kWh
        double emissionFactor = switch (country.toUpperCase()) {
            case "US" -> 0.42; // US average
            case "GB", "UK" -> 0.23; // UK
            case "DE" -> 0.34; // Germany
            case "CN" -> 0.55; // China
            case "IN" -> 0.82; // India
            default -> 0.5; // Global average
        };
        return energyKwh * emissionFactor;
    }

    private double calculateFallbackFlightEmissions(double distanceKm, String flightClass) {
        log.info("Using fallback calculation for flight emissions");
        // Base emission factor per km
        double baseFactor = 0.15; // kg CO2 per km

        // Adjust for flight class
        double classFactor = switch (flightClass != null ? flightClass.toLowerCase() : "economy") {
            case "business" -> 2.0;
            case "first" -> 3.0;
            default -> 1.0; // economy
        };

        return distanceKm * baseFactor * classFactor;
    }

    /**
     * Test API connectivity
     */
    public boolean testConnection() {
        try {
            log.info("Testing Climatiq API connection");

            // Try a simple emission calculation
            double emissions = calculateVehicleEmissions(10, "car");

            log.info("Climatiq API connection test successful. Sample emission: {} kg CO2e", emissions);
            return emissions > 0;

        } catch (Exception e) {
            log.error("Climatiq API connection test failed: {}", e.getMessage());
            return false;
        }
    }
}
