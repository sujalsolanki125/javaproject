package com.carboncalc.controller;

import com.carboncalc.client.CarbonInterfaceClient;
import com.carboncalc.dto.carbon.VehicleMakeResponse;
import com.carboncalc.dto.carbon.VehicleModelResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Controller for Carbon Interface API operations
 */
@Slf4j
@RestController
@RequestMapping("/api/carbon-interface")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CarbonInterfaceController {

    private final CarbonInterfaceClient carbonInterfaceClient;

    /**
     * Test API authentication
     */
    @GetMapping("/auth/test")
    public ResponseEntity<Map<String, Object>> testAuth() {
        try {
            boolean isAuthenticated = carbonInterfaceClient.testAuth();

            return ResponseEntity.ok(Map.of(
                    "success", isAuthenticated,
                    "message", isAuthenticated ? "API authentication successful" : "API authentication failed",
                    "timestamp", System.currentTimeMillis()));
        } catch (Exception e) {
            log.error("Error testing API authentication: {}", e.getMessage());
            return ResponseEntity.ok(Map.of(
                    "success", false,
                    "message", "Error testing API: " + e.getMessage(),
                    "timestamp", System.currentTimeMillis()));
        }
    }

    /**
     * Get all vehicle makes
     */
    @GetMapping("/vehicles/makes")
    public ResponseEntity<List<VehicleMakeResponse.VehicleMakeData>> getVehicleMakes() {
        try {
            List<VehicleMakeResponse.VehicleMakeData> makes = carbonInterfaceClient.getVehicleMakes();
            return ResponseEntity.ok(makes);
        } catch (Exception e) {
            log.error("Error fetching vehicle makes: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get vehicle models for a specific make
     */
    @GetMapping("/vehicles/makes/{makeId}/models")
    public ResponseEntity<List<VehicleModelResponse.VehicleModelData>> getVehicleModels(
            @PathVariable String makeId) {
        try {
            List<VehicleModelResponse.VehicleModelData> models = carbonInterfaceClient.getVehicleModels(makeId);
            return ResponseEntity.ok(models);
        } catch (Exception e) {
            log.error("Error fetching vehicle models for make {}: {}", makeId, e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Calculate electricity emissions
     */
    @PostMapping("/estimate/electricity")
    public ResponseEntity<Map<String, Object>> estimateElectricityEmissions(
            @RequestBody Map<String, Object> request) {
        try {
            Double kwh = Double.valueOf(request.get("kwh").toString());
            String country = request.get("country").toString();
            String state = request.get("state") != null ? request.get("state").toString() : null;

            Double emissions = carbonInterfaceClient.estimateElectricityEmissions(kwh, country, state);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "emissions_kg", emissions != null ? emissions : 0.0,
                    "request", Map.of("kwh", kwh, "country", country, "state", state != null ? state : ""),
                    "timestamp", System.currentTimeMillis()));
        } catch (Exception e) {
            log.error("Error estimating electricity emissions: {}", e.getMessage());
            return ResponseEntity.ok(Map.of(
                    "success", false,
                    "message", "Error calculating emissions: " + e.getMessage(),
                    "timestamp", System.currentTimeMillis()));
        }
    }

    /**
     * Calculate vehicle emissions
     */
    @PostMapping("/estimate/vehicle")
    public ResponseEntity<Map<String, Object>> estimateVehicleEmissions(
            @RequestBody Map<String, Object> request) {
        try {
            Double distanceMiles = Double.valueOf(request.get("distance_miles").toString());
            String vehicleModelId = request.get("vehicle_model_id").toString();

            Double emissions = carbonInterfaceClient.estimateVehicleEmissions(distanceMiles, vehicleModelId);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "emissions_kg", emissions != null ? emissions : 0.0,
                    "request", Map.of("distance_miles", distanceMiles, "vehicle_model_id", vehicleModelId),
                    "timestamp", System.currentTimeMillis()));
        } catch (Exception e) {
            log.error("Error estimating vehicle emissions: {}", e.getMessage());
            return ResponseEntity.ok(Map.of(
                    "success", false,
                    "message", "Error calculating emissions: " + e.getMessage(),
                    "timestamp", System.currentTimeMillis()));
        }
    }

    /**
     * Calculate flight emissions
     */
    @PostMapping("/estimate/flight")
    public ResponseEntity<Map<String, Object>> estimateFlightEmissions(
            @RequestBody Map<String, Object> request) {
        try {
            Integer passengers = Integer.valueOf(request.get("passengers").toString());
            @SuppressWarnings("unchecked")
            List<Map<String, String>> legs = (List<Map<String, String>>) request.get("legs");
            String distanceUnit = request.get("distance_unit") != null ? request.get("distance_unit").toString() : "km";

            Double emissions = carbonInterfaceClient.estimateFlightEmissions(legs, passengers, distanceUnit);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "emissions_kg", emissions != null ? emissions : 0.0,
                    "request", Map.of("passengers", passengers, "legs", legs, "distance_unit", distanceUnit),
                    "timestamp", System.currentTimeMillis()));
        } catch (Exception e) {
            log.error("Error estimating flight emissions: {}", e.getMessage());
            return ResponseEntity.ok(Map.of(
                    "success", false,
                    "message", "Error calculating emissions: " + e.getMessage(),
                    "timestamp", System.currentTimeMillis()));
        }
    }

    /**
     * Calculate shipping emissions
     */
    @PostMapping("/estimate/shipping")
    public ResponseEntity<Map<String, Object>> estimateShippingEmissions(
            @RequestBody Map<String, Object> request) {
        try {
            Double weightValue = Double.valueOf(request.get("weight_value").toString());
            String weightUnit = request.get("weight_unit").toString();
            Double distanceValue = Double.valueOf(request.get("distance_value").toString());
            String distanceUnit = request.get("distance_unit").toString();
            String transportMethod = request.get("transport_method").toString();

            Double emissions = carbonInterfaceClient.estimateShippingEmissions(
                    weightValue, weightUnit, distanceValue, distanceUnit, transportMethod);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "emissions_kg", emissions != null ? emissions : 0.0,
                    "request", Map.of(
                            "weight_value", weightValue,
                            "weight_unit", weightUnit,
                            "distance_value", distanceValue,
                            "distance_unit", distanceUnit,
                            "transport_method", transportMethod),
                    "timestamp", System.currentTimeMillis()));
        } catch (Exception e) {
            log.error("Error estimating shipping emissions: {}", e.getMessage());
            return ResponseEntity.ok(Map.of(
                    "success", false,
                    "message", "Error calculating emissions: " + e.getMessage(),
                    "timestamp", System.currentTimeMillis()));
        }
    }

    /**
     * Calculate fuel combustion emissions
     */
    @PostMapping("/estimate/fuel")
    public ResponseEntity<Map<String, Object>> estimateFuelEmissions(
            @RequestBody Map<String, Object> request) {
        try {
            String fuelSourceType = request.get("fuel_source_type").toString();
            String fuelSourceUnit = request.get("fuel_source_unit").toString();
            Double fuelSourceValue = Double.valueOf(request.get("fuel_source_value").toString());

            Double emissions = carbonInterfaceClient.estimateFuelCombustionEmissions(
                    fuelSourceType, fuelSourceUnit, fuelSourceValue);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "emissions_kg", emissions != null ? emissions : 0.0,
                    "request", Map.of(
                            "fuel_source_type", fuelSourceType,
                            "fuel_source_unit", fuelSourceUnit,
                            "fuel_source_value", fuelSourceValue),
                    "timestamp", System.currentTimeMillis()));
        } catch (Exception e) {
            log.error("Error estimating fuel emissions: {}", e.getMessage());
            return ResponseEntity.ok(Map.of(
                    "success", false,
                    "message", "Error calculating emissions: " + e.getMessage(),
                    "timestamp", System.currentTimeMillis()));
        }
    }
}