package com.carboncalc.client;

import com.carboncalc.dto.carbon.CarbonEstimateResponse;
import com.carboncalc.dto.carbon.VehicleMakeResponse;
import com.carboncalc.dto.carbon.VehicleModelResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Client for Carbon Interface API
 * Fetches real carbon emission data for various activities
 * API Docs: https://docs.carboninterface.com/
 */
@Slf4j
// @Service - Disabled: Using local calculations instead of API
@RequiredArgsConstructor
public class CarbonInterfaceClient {

    @Value("${carbon.interface.api.key:}")
    private String apiKey;

    @Value("${carbon.interface.api.url:https://www.carboninterface.com/api/v1}")
    private String baseUrl;

    private final WebClient webClient;

    /**
     * Test API authentication
     * 
     * @return true if authentication is successful
     */
    public boolean testAuth() {
        try {
            log.info("Testing Carbon Interface API authentication");

            if (apiKey == null || apiKey.trim().isEmpty()) {
                log.error("Carbon Interface API key is not configured");
                return false;
            }

            Map<String, String> response = webClient.get()
                    .uri(baseUrl + "/auth")
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .timeout(Duration.ofSeconds(10))
                    .block();

            if (response != null && "auth successful".equals(response.get("message"))) {
                log.info("Carbon Interface API authentication successful");
                return true;
            }

            log.warn("Carbon Interface API authentication failed: {}", response);
            return false;
        } catch (WebClientResponseException e) {
            if (e.getStatusCode() == HttpStatus.UNAUTHORIZED) {
                log.error("Carbon Interface API key is invalid");
            } else {
                log.error("Error testing Carbon Interface API auth: {} - {}", e.getStatusCode(), e.getMessage());
            }
            return false;
        } catch (Exception e) {
            log.error("Error testing Carbon Interface API auth: {}", e.getMessage());
            return false;
        }
    }

    /**
     * Estimate emissions for electricity usage
     * 
     * @param kwh     Kilowatt-hours consumed
     * @param country Country code (e.g., "US", "GB")
     * @param state   Optional state code for more accurate estimates (e.g., "CA",
     *                "FL")
     * @return Emissions in kg CO2e
     */
    @Cacheable(value = "externalApi", key = "'electricity_' + #kwh + '_' + #country + '_' + (#state ?: 'none')")
    public Double estimateElectricityEmissions(Double kwh, String country, String state) {
        try {
            log.info("Fetching electricity emissions: {}kWh in {}{}", kwh, country,
                    state != null ? "-" + state : "");

            Map<String, Object> request = Map.of(
                    "type", "electricity",
                    "electricity_unit", "kwh",
                    "electricity_value", kwh,
                    "country", country.toLowerCase());

            // Add state if provided
            if (state != null && !state.trim().isEmpty()) {
                request = Map.of(
                        "type", "electricity",
                        "electricity_unit", "kwh",
                        "electricity_value", kwh,
                        "country", country.toLowerCase(),
                        "state", state.toLowerCase());
            }

            CarbonEstimateResponse response = webClient.post()
                    .uri(baseUrl + "/estimates")
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                    .header(HttpHeaders.CONTENT_TYPE, "application/json")
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(CarbonEstimateResponse.class)
                    .timeout(Duration.ofSeconds(15))
                    .block();

            if (response != null && response.getData() != null && response.getData().getAttributes() != null) {
                Double carbonKg = response.getData().getAttributes().getCarbonKg();
                log.info("Successfully fetched electricity emissions: {} kg CO2e", carbonKg);
                return carbonKg;
            }

            log.warn("No emission data returned from Carbon Interface API for electricity");
            return null;
        } catch (WebClientResponseException e) {
            log.error("HTTP error fetching electricity emissions: {} - {}", e.getStatusCode(),
                    e.getResponseBodyAsString());
            return null;
        } catch (Exception e) {
            log.error("Error fetching electricity emissions: {}", e.getMessage());
            return null;
        }
    }

    /**
     * Overloaded method for backward compatibility
     */
    @Cacheable(value = "externalApi", key = "'electricity_' + #kwh + '_' + #country")
    public Double estimateElectricityEmissions(Double kwh, String country) {
        return estimateElectricityEmissions(kwh, country, null);
    }

    /**
     * Get all available vehicle makes
     * 
     * @return List of vehicle makes with their IDs and model counts
     */
    @Cacheable(value = "externalApi", key = "'vehicle_makes'", cacheManager = "longTermCacheManager")
    public List<VehicleMakeResponse.VehicleMakeData> getVehicleMakes() {
        try {
            log.info("Fetching vehicle makes from Carbon Interface API");

            // Carbon Interface returns an array of wrapper objects, each containing a
            // "data" field
            VehicleMakeWrapper[] responseArray = webClient.get()
                    .uri(baseUrl + "/vehicle_makes")
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                    .header(HttpHeaders.CONTENT_TYPE, "application/json")
                    .retrieve()
                    .bodyToMono(VehicleMakeWrapper[].class)
                    .timeout(Duration.ofSeconds(15))
                    .block();

            if (responseArray != null && responseArray.length > 0) {
                List<VehicleMakeResponse.VehicleMakeData> makes = new ArrayList<>();
                for (VehicleMakeWrapper wrapper : responseArray) {
                    if (wrapper.getData() != null) {
                        makes.add(wrapper.getData());
                    }
                }
                log.info("Successfully fetched {} vehicle makes", makes.size());
                return makes;
            }

            log.warn("No vehicle makes data returned from Carbon Interface API, using mock data");
            return getMockVehicleMakes();
        } catch (WebClientResponseException e) {
            log.error("HTTP error fetching vehicle makes: {} - {}. Using mock data as fallback.", e.getStatusCode(),
                    e.getResponseBodyAsString());
            return getMockVehicleMakes();
        } catch (Exception e) {
            log.error("Error fetching vehicle makes: {}. Using mock data as fallback.", e.getMessage());
            return getMockVehicleMakes();
        }
    }

    /**
     * Provides mock vehicle makes data as fallback when API is unavailable
     */
    private List<VehicleMakeResponse.VehicleMakeData> getMockVehicleMakes() {
        log.info("Returning mock vehicle makes data");
        List<VehicleMakeResponse.VehicleMakeData> mockMakes = new ArrayList<>();

        // Toyota
        VehicleMakeResponse.VehicleMakeData toyota = new VehicleMakeResponse.VehicleMakeData();
        toyota.setId("mock-toyota");
        toyota.setType("vehicle_make");
        VehicleMakeResponse.VehicleMakeAttributes toyotaAttr = new VehicleMakeResponse.VehicleMakeAttributes();
        toyotaAttr.setName("Toyota");
        toyotaAttr.setNumberOfModels(50);
        toyota.setAttributes(toyotaAttr);
        mockMakes.add(toyota);

        // Honda
        VehicleMakeResponse.VehicleMakeData honda = new VehicleMakeResponse.VehicleMakeData();
        honda.setId("mock-honda");
        honda.setType("vehicle_make");
        VehicleMakeResponse.VehicleMakeAttributes hondaAttr = new VehicleMakeResponse.VehicleMakeAttributes();
        hondaAttr.setName("Honda");
        hondaAttr.setNumberOfModels(40);
        honda.setAttributes(hondaAttr);
        mockMakes.add(honda);

        // Ford
        VehicleMakeResponse.VehicleMakeData ford = new VehicleMakeResponse.VehicleMakeData();
        ford.setId("mock-ford");
        ford.setType("vehicle_make");
        VehicleMakeResponse.VehicleMakeAttributes fordAttr = new VehicleMakeResponse.VehicleMakeAttributes();
        fordAttr.setName("Ford");
        fordAttr.setNumberOfModels(45);
        ford.setAttributes(fordAttr);
        mockMakes.add(ford);

        // Chevrolet
        VehicleMakeResponse.VehicleMakeData chevy = new VehicleMakeResponse.VehicleMakeData();
        chevy.setId("mock-chevrolet");
        chevy.setType("vehicle_make");
        VehicleMakeResponse.VehicleMakeAttributes chevyAttr = new VehicleMakeResponse.VehicleMakeAttributes();
        chevyAttr.setName("Chevrolet");
        chevyAttr.setNumberOfModels(42);
        chevy.setAttributes(chevyAttr);
        mockMakes.add(chevy);

        // Tesla
        VehicleMakeResponse.VehicleMakeData tesla = new VehicleMakeResponse.VehicleMakeData();
        tesla.setId("mock-tesla");
        tesla.setType("vehicle_make");
        VehicleMakeResponse.VehicleMakeAttributes teslaAttr = new VehicleMakeResponse.VehicleMakeAttributes();
        teslaAttr.setName("Tesla");
        teslaAttr.setNumberOfModels(5);
        tesla.setAttributes(teslaAttr);
        mockMakes.add(tesla);

        return mockMakes;
    }

    /**
     * Get vehicle models for a specific make
     * 
     * @param vehicleMakeId The ID of the vehicle make
     * @return List of vehicle models for the specified make
     */
    @Cacheable(value = "externalApi", key = "'vehicle_models_' + #vehicleMakeId", cacheManager = "longTermCacheManager")
    public List<VehicleModelResponse.VehicleModelData> getVehicleModels(String vehicleMakeId) {
        try {
            log.info("Fetching vehicle models for make ID: {}", vehicleMakeId);

            // Carbon Interface returns an array of wrapper objects, each containing a
            // "data" field
            VehicleModelWrapper[] responseArray = webClient.get()
                    .uri(baseUrl + "/vehicle_makes/" + vehicleMakeId + "/vehicle_models")
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                    .header(HttpHeaders.CONTENT_TYPE, "application/json")
                    .retrieve()
                    .bodyToMono(VehicleModelWrapper[].class)
                    .timeout(Duration.ofSeconds(15))
                    .block();

            if (responseArray != null && responseArray.length > 0) {
                List<VehicleModelResponse.VehicleModelData> models = new ArrayList<>();
                for (VehicleModelWrapper wrapper : responseArray) {
                    if (wrapper.getData() != null) {
                        models.add(wrapper.getData());
                    }
                }
                log.info("Successfully fetched {} vehicle models for make ID: {}", models.size(),
                        vehicleMakeId);
                return models;
            }

            log.warn("No vehicle models data returned from Carbon Interface API for make ID: {}", vehicleMakeId);
            return getMockVehicleModels(vehicleMakeId);
        } catch (WebClientResponseException e) {
            log.error("HTTP error fetching vehicle models for make {}: {} - {}. Using mock data.", vehicleMakeId,
                    e.getStatusCode(),
                    e.getResponseBodyAsString());
            return getMockVehicleModels(vehicleMakeId);
        } catch (Exception e) {
            log.error("Error fetching vehicle models for make {}: {}. Using mock data.", vehicleMakeId, e.getMessage());
            return getMockVehicleModels(vehicleMakeId);
        }
    }

    /**
     * Provides mock vehicle models data as fallback when API is unavailable
     */
    private List<VehicleModelResponse.VehicleModelData> getMockVehicleModels(String makeId) {
        log.info("Returning mock vehicle models for make ID: {}", makeId);
        List<VehicleModelResponse.VehicleModelData> mockModels = new ArrayList<>();

        String makeName = getMakeNameFromId(makeId);

        // Add common models for each make
        String[] modelNames = getModelNamesForMake(makeName);
        int[] years = { 2020, 2021, 2022, 2023, 2024 };

        int idCounter = 1;
        for (String modelName : modelNames) {
            for (int year : years) {
                VehicleModelResponse.VehicleModelData model = new VehicleModelResponse.VehicleModelData();
                model.setId("mock-model-" + idCounter++);
                model.setType("vehicle_model");
                VehicleModelResponse.VehicleModelAttributes attr = new VehicleModelResponse.VehicleModelAttributes();
                attr.setName(modelName);
                attr.setYear(year);
                attr.setVehicleMake(makeName);
                model.setAttributes(attr);
                mockModels.add(model);
            }
        }

        return mockModels;
    }

    private String getMakeNameFromId(String makeId) {
        if (makeId == null)
            return "Generic";
        if (makeId.contains("toyota"))
            return "Toyota";
        if (makeId.contains("honda"))
            return "Honda";
        if (makeId.contains("ford"))
            return "Ford";
        if (makeId.contains("chevrolet"))
            return "Chevrolet";
        if (makeId.contains("tesla"))
            return "Tesla";
        return "Generic";
    }

    private String[] getModelNamesForMake(String makeName) {
        switch (makeName.toLowerCase()) {
            case "toyota":
                return new String[] { "Camry", "Corolla", "RAV4", "Highlander" };
            case "honda":
                return new String[] { "Civic", "Accord", "CR-V", "Pilot" };
            case "ford":
                return new String[] { "F-150", "Escape", "Explorer", "Mustang" };
            case "chevrolet":
                return new String[] { "Silverado", "Equinox", "Malibu", "Tahoe" };
            case "tesla":
                return new String[] { "Model 3", "Model Y", "Model S", "Model X" };
            default:
                return new String[] { "Sedan", "SUV", "Truck" };
        }
    }

    /**
     * Estimate emissions for vehicle travel
     * 
     * @param distanceMiles  Distance traveled in miles
     * @param vehicleModelId Vehicle model ID from Carbon Interface API
     * @return Emissions in kg CO2e
     */
    @Cacheable(value = "externalApi", key = "'vehicle_' + #distanceMiles + '_' + #vehicleModelId")
    public Double estimateVehicleEmissions(Double distanceMiles, String vehicleModelId) {
        try {
            log.info("Fetching vehicle emissions: {} miles with model ID: {}", distanceMiles, vehicleModelId);

            Map<String, Object> request = Map.of(
                    "type", "vehicle",
                    "distance_unit", "mi",
                    "distance_value", distanceMiles,
                    "vehicle_model_id", vehicleModelId);

            CarbonEstimateResponse response = webClient.post()
                    .uri(baseUrl + "/estimates")
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                    .header(HttpHeaders.CONTENT_TYPE, "application/json")
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(CarbonEstimateResponse.class)
                    .timeout(Duration.ofSeconds(15))
                    .block();

            if (response != null && response.getData() != null && response.getData().getAttributes() != null) {
                Double carbonKg = response.getData().getAttributes().getCarbonKg();
                log.info("Successfully fetched vehicle emissions: {} kg CO2e for {} miles", carbonKg, distanceMiles);
                return carbonKg;
            }

            log.warn("No emission data returned from Carbon Interface API for vehicle");
            return null;
        } catch (WebClientResponseException e) {
            log.error("HTTP error fetching vehicle emissions: {} - {}", e.getStatusCode(), e.getResponseBodyAsString());
            return null;
        } catch (Exception e) {
            log.error("Error fetching vehicle emissions: {}", e.getMessage());
            return null;
        }
    }

    /**
     * Estimate emissions for flight
     * 
     * @param legs         List of flight legs with departure and destination
     *                     airports
     * @param passengers   Number of passengers
     * @param distanceUnit Optional distance unit ("mi" or "km", defaults to "km")
     * @return Emissions in kg CO2e
     */
    @Cacheable(value = "externalApi", key = "'flight_' + #legs.hashCode() + '_' + #passengers + '_' + (#distanceUnit ?: 'km')")
    public Double estimateFlightEmissions(List<Map<String, String>> legs, Integer passengers, String distanceUnit) {
        try {
            log.info("Fetching flight emissions: {} passengers, {} legs", passengers, legs.size());

            Map<String, Object> request = Map.of(
                    "type", "flight",
                    "passengers", passengers,
                    "legs", legs);

            if (distanceUnit != null && !distanceUnit.trim().isEmpty()) {
                request = Map.of(
                        "type", "flight",
                        "passengers", passengers,
                        "legs", legs,
                        "distance_unit", distanceUnit.toLowerCase());
            }

            CarbonEstimateResponse response = webClient.post()
                    .uri(baseUrl + "/estimates")
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                    .header(HttpHeaders.CONTENT_TYPE, "application/json")
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(CarbonEstimateResponse.class)
                    .timeout(Duration.ofSeconds(15))
                    .block();

            if (response != null && response.getData() != null && response.getData().getAttributes() != null) {
                Double carbonKg = response.getData().getAttributes().getCarbonKg();
                log.info("Successfully fetched flight emissions: {} kg CO2e for {} passengers", carbonKg, passengers);
                return carbonKg;
            }

            log.warn("No emission data returned from Carbon Interface API for flight");
            return null;
        } catch (WebClientResponseException e) {
            log.error("HTTP error fetching flight emissions: {} - {}", e.getStatusCode(), e.getResponseBodyAsString());
            return null;
        } catch (Exception e) {
            log.error("Error fetching flight emissions: {}", e.getMessage());
            return null;
        }
    }

    /**
     * Simplified flight emissions for distance-based estimates (backward
     * compatibility)
     */
    @Cacheable(value = "externalApi", key = "'flight_simple_' + #distanceMiles + '_' + #passengers")
    public Double estimateFlightEmissions(Double distanceMiles, Integer passengers) {
        // For simplicity, create a round trip flight legs based on distance
        // This is an approximation - real implementation should use actual airport
        // codes
        List<Map<String, String>> legs = List.of(
                Map.of("departure_airport", "JFK", "destination_airport", "LAX"),
                Map.of("departure_airport", "LAX", "destination_airport", "JFK"));

        return estimateFlightEmissions(legs, passengers, "mi");
    }

    /**
     * Estimate emissions for shipping
     * 
     * @param weightValue     Weight of the shipment
     * @param weightUnit      Weight unit ("g", "lb", "kg", "mt")
     * @param distanceValue   Distance traveled
     * @param distanceUnit    Distance unit ("mi", "km")
     * @param transportMethod Transport method ("ship", "train", "truck", "plane")
     * @return Emissions in kg CO2e
     */
    @Cacheable(value = "externalApi", key = "'shipping_' + #weightValue + '_' + #weightUnit + '_' + #distanceValue + '_' + #distanceUnit + '_' + #transportMethod")
    public Double estimateShippingEmissions(Double weightValue, String weightUnit, Double distanceValue,
            String distanceUnit, String transportMethod) {
        try {
            log.info("Fetching shipping emissions: {}{}  via {} for {} {}",
                    weightValue, weightUnit, transportMethod, distanceValue, distanceUnit);

            Map<String, Object> request = Map.of(
                    "type", "shipping",
                    "weight_value", weightValue,
                    "weight_unit", weightUnit.toLowerCase(),
                    "distance_value", distanceValue,
                    "distance_unit", distanceUnit.toLowerCase(),
                    "transport_method", transportMethod.toLowerCase());

            CarbonEstimateResponse response = webClient.post()
                    .uri(baseUrl + "/estimates")
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                    .header(HttpHeaders.CONTENT_TYPE, "application/json")
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(CarbonEstimateResponse.class)
                    .timeout(Duration.ofSeconds(15))
                    .block();

            if (response != null && response.getData() != null && response.getData().getAttributes() != null) {
                Double carbonKg = response.getData().getAttributes().getCarbonKg();
                log.info("Successfully fetched shipping emissions: {} kg CO2e", carbonKg);
                return carbonKg;
            }

            log.warn("No emission data returned from Carbon Interface API for shipping");
            return null;
        } catch (WebClientResponseException e) {
            log.error("HTTP error fetching shipping emissions: {} - {}", e.getStatusCode(),
                    e.getResponseBodyAsString());
            return null;
        } catch (Exception e) {
            log.error("Error fetching shipping emissions: {}", e.getMessage());
            return null;
        }
    }

    /**
     * Estimate emissions for fuel combustion
     * 
     * @param fuelSourceType  Type of fuel source (e.g., "dfo" for diesel fuel oil)
     * @param fuelSourceUnit  Unit of fuel measurement (e.g., "btu", "gallon")
     * @param fuelSourceValue Amount of fuel consumed
     * @return Emissions in kg CO2e
     */
    @Cacheable(value = "externalApi", key = "'fuel_' + #fuelSourceType + '_' + #fuelSourceUnit + '_' + #fuelSourceValue")
    public Double estimateFuelCombustionEmissions(String fuelSourceType, String fuelSourceUnit,
            Double fuelSourceValue) {
        try {
            log.info("Fetching fuel combustion emissions: {} {} of {}",
                    fuelSourceValue, fuelSourceUnit, fuelSourceType);

            Map<String, Object> request = Map.of(
                    "type", "fuel_combustion",
                    "fuel_source_type", fuelSourceType.toLowerCase(),
                    "fuel_source_unit", fuelSourceUnit.toLowerCase(),
                    "fuel_source_value", fuelSourceValue);

            CarbonEstimateResponse response = webClient.post()
                    .uri(baseUrl + "/estimates")
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                    .header(HttpHeaders.CONTENT_TYPE, "application/json")
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(CarbonEstimateResponse.class)
                    .timeout(Duration.ofSeconds(15))
                    .block();

            if (response != null && response.getData() != null && response.getData().getAttributes() != null) {
                Double carbonKg = response.getData().getAttributes().getCarbonKg();
                log.info("Successfully fetched fuel combustion emissions: {} kg CO2e", carbonKg);
                return carbonKg;
            }

            log.warn("No emission data returned from Carbon Interface API for fuel combustion");
            return null;
        } catch (WebClientResponseException e) {
            log.error("HTTP error fetching fuel combustion emissions: {} - {}", e.getStatusCode(),
                    e.getResponseBodyAsString());
            return null;
        } catch (Exception e) {
            log.error("Error fetching fuel combustion emissions: {}", e.getMessage());
            return null;
        }
    }

    /**
     * Get a specific estimate by ID
     * 
     * @param estimateId The ID of the estimate to retrieve
     * @return CarbonEstimateResponse or null if not found
     */
    @Cacheable(value = "externalApi", key = "'estimate_' + #estimateId")
    public CarbonEstimateResponse getEstimate(String estimateId) {
        try {
            log.info("Fetching estimate by ID: {}", estimateId);

            CarbonEstimateResponse response = webClient.get()
                    .uri(baseUrl + "/estimates/" + estimateId)
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                    .header(HttpHeaders.CONTENT_TYPE, "application/json")
                    .retrieve()
                    .bodyToMono(CarbonEstimateResponse.class)
                    .timeout(Duration.ofSeconds(15))
                    .block();

            if (response != null && response.getData() != null) {
                log.info("Successfully fetched estimate: {}", estimateId);
                return response;
            }

            log.warn("No estimate data returned for ID: {}", estimateId);
            return null;
        } catch (WebClientResponseException e) {
            if (e.getStatusCode() == HttpStatus.NOT_FOUND) {
                log.warn("Estimate not found: {}", estimateId);
            } else {
                log.error("HTTP error fetching estimate {}: {} - {}", estimateId, e.getStatusCode(),
                        e.getResponseBodyAsString());
            }
            return null;
        } catch (Exception e) {
            log.error("Error fetching estimate {}: {}", estimateId, e.getMessage());
            return null;
        }
    }

    /**
     * Wrapper class for Carbon Interface API vehicle makes response
     * The API returns an array like: [{"data": {...}}, {"data": {...}}]
     */
    @lombok.Data
    private static class VehicleMakeWrapper {
        private VehicleMakeResponse.VehicleMakeData data;
    }

    /**
     * Wrapper class for Carbon Interface API vehicle models response
     * The API returns an array like: [{"data": {...}}, {"data": {...}}]
     */
    @lombok.Data
    private static class VehicleModelWrapper {
        private VehicleModelResponse.VehicleModelData data;
    }
}
