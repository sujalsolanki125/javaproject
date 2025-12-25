package com.carboncalc.service;

import com.carboncalc.client.CarbonInterfaceClient;
import com.carboncalc.dto.carbon.VehicleMakeResponse;
import com.carboncalc.dto.carbon.VehicleModelResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Utility service for Vehicle-related operations with Carbon Interface API
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class VehicleLookupService {

    private final CarbonInterfaceClient carbonInterfaceClient;

    /**
     * Find vehicle model ID by make, model name, and year
     * 
     * @param makeName  Make name (e.g., "Toyota", "Honda")
     * @param modelName Model name (e.g., "Camry", "Corolla")
     * @param year      Vehicle year (optional, if null will return first match)
     * @return Vehicle model ID for Carbon Interface API or null if not found
     */
    public String findVehicleModelId(String makeName, String modelName, Integer year) {
        try {
            // First, find the vehicle make
            List<VehicleMakeResponse.VehicleMakeData> makes = carbonInterfaceClient.getVehicleMakes();

            Optional<VehicleMakeResponse.VehicleMakeData> targetMake = makes.stream()
                    .filter(make -> make.getAttributes().getName().toLowerCase()
                            .contains(makeName.toLowerCase()))
                    .findFirst();

            if (targetMake.isEmpty()) {
                log.warn("Vehicle make not found: {}", makeName);
                return getDefaultVehicleModelId();
            }

            String makeId = targetMake.get().getId();
            log.info("Found vehicle make: {} with ID: {}",
                    targetMake.get().getAttributes().getName(), makeId);

            // Get models for this make
            List<VehicleModelResponse.VehicleModelData> models = carbonInterfaceClient.getVehicleModels(makeId);

            // Filter by model name and optionally year
            List<VehicleModelResponse.VehicleModelData> matchingModels = models.stream()
                    .filter(model -> model.getAttributes().getName().toLowerCase()
                            .contains(modelName.toLowerCase()))
                    .filter(model -> year == null || model.getAttributes().getYear().equals(year))
                    .collect(Collectors.toList());

            if (matchingModels.isEmpty()) {
                log.warn("Vehicle model not found: {} {} {}", makeName, modelName, year);
                // Try to find any model from the same make
                return models.isEmpty() ? getDefaultVehicleModelId() : models.get(0).getId();
            }

            // Prefer exact year match, otherwise take the most recent
            VehicleModelResponse.VehicleModelData selectedModel = matchingModels.stream()
                    .max((m1, m2) -> m1.getAttributes().getYear().compareTo(m2.getAttributes().getYear()))
                    .orElse(matchingModels.get(0));

            log.info("Found vehicle model: {} {} {} with ID: {}",
                    selectedModel.getAttributes().getVehicleMake(),
                    selectedModel.getAttributes().getName(),
                    selectedModel.getAttributes().getYear(),
                    selectedModel.getId());

            return selectedModel.getId();

        } catch (Exception e) {
            log.error("Error finding vehicle model ID for {} {} {}: {}",
                    makeName, modelName, year, e.getMessage());
            return getDefaultVehicleModelId();
        }
    }

    /**
     * Get a default vehicle model ID for fallback cases
     * This should be a common, representative vehicle
     */
    private String getDefaultVehicleModelId() {
        try {
            // Try to get Toyota Camry 2020 or similar as default
            return findVehicleModelId("Toyota", "Camry", 2020);
        } catch (Exception e) {
            log.error("Could not find default vehicle model: {}", e.getMessage());
            // Return a hardcoded fallback if available
            // This should be updated with a real model ID from the API
            return "7268a9b7-17e8-4c8d-acca-57059252afe9"; // Toyota Corolla 1993 from API docs
        }
    }

    /**
     * Parse vehicle description to extract make, model, and year
     * Supports formats like "2020 Toyota Camry", "Honda Civic", "Tesla Model 3
     * 2022"
     */
    public VehicleInfo parseVehicleDescription(String description) {
        if (description == null || description.trim().isEmpty()) {
            return new VehicleInfo("Toyota", "Camry", 2020);
        }

        String[] parts = description.trim().split("\\s+");

        if (parts.length >= 3) {
            // Try to parse year from first or last position
            Integer year = null;
            String make = null;
            String model = null;

            // Check if first part is a year (4 digits)
            if (parts[0].matches("\\d{4}")) {
                year = Integer.parseInt(parts[0]);
                make = parts[1];
                model = String.join(" ", java.util.Arrays.copyOfRange(parts, 2, parts.length));
            }
            // Check if last part is a year
            else if (parts[parts.length - 1].matches("\\d{4}")) {
                year = Integer.parseInt(parts[parts.length - 1]);
                make = parts[0];
                model = String.join(" ", java.util.Arrays.copyOfRange(parts, 1, parts.length - 1));
            }
            // No year found, assume first is make, rest is model
            else {
                make = parts[0];
                model = String.join(" ", java.util.Arrays.copyOfRange(parts, 1, parts.length));
                year = 2020; // Default year
            }

            return new VehicleInfo(make, model, year);
        }

        // Fallback for short descriptions
        return new VehicleInfo("Toyota", "Camry", 2020);
    }

    /**
     * Helper class for vehicle information
     */
    public static class VehicleInfo {
        public final String make;
        public final String model;
        public final Integer year;

        public VehicleInfo(String make, String model, Integer year) {
            this.make = make;
            this.model = model;
            this.year = year;
        }

        @Override
        public String toString() {
            return String.format("%s %s %d", make, model, year);
        }
    }

    /**
     * Get popular vehicle options for UI dropdowns
     */
    public List<String> getPopularVehicles() {
        return List.of(
                "Toyota Camry",
                "Honda Civic",
                "Ford F-150",
                "Chevrolet Malibu",
                "Toyota Corolla",
                "Honda Accord",
                "Nissan Altima",
                "BMW 3 Series",
                "Mercedes-Benz C-Class",
                "Tesla Model 3");
    }
}