package com.carboncalc.client;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.Map;

/**
 * Client for Carbon Interface API
 * Fetches real carbon emission data for various activities
 * API Docs: https://www.carboninterface.com/docs
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class CarbonInterfaceClient {

    @Value("${carbon.interface.api.key:}")
    private String apiKey;

    @Value("${carbon.interface.api.url:https://www.carboninterface.com/api/v1}")
    private String baseUrl;

    private final WebClient webClient;

    /**
     * Estimate emissions for electricity usage
     * 
     * @param kwh     Kilowatt-hours consumed
     * @param country Country code (e.g., "US", "GB")
     * @return Emissions in kg CO2e
     */
    @Cacheable(value = "externalApi", key = "'electricity_' + #kwh + '_' + #country")
    public Double estimateElectricityEmissions(Double kwh, String country) {
        try {
            log.info("Fetching electricity emissions: {}kWh in {}", kwh, country);

            Map<String, Object> request = Map.of(
                    "type", "electricity",
                    "electricity_unit", "kwh",
                    "electricity_value", kwh,
                    "country", country);

            Map<String, Object> response = webClient.post()
                    .uri(baseUrl + "/estimates")
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .timeout(Duration.ofSeconds(10))
                    .block();

            if (response != null && response.containsKey("data")) {
                Map<String, Object> data = (Map<String, Object>) response.get("data");
                Map<String, Object> attributes = (Map<String, Object>) data.get("attributes");
                return (Double) attributes.get("carbon_kg");
            }

            log.warn("No emission data returned from Carbon Interface API");
            return null;
        } catch (Exception e) {
            log.error("Error fetching electricity emissions: {}", e.getMessage());
            return null;
        }
    }

    /**
     * Estimate emissions for vehicle travel
     * 
     * @param distanceMiles Distance traveled in miles
     * @param vehicleModel  Vehicle model (e.g., "2020 Toyota Camry")
     * @return Emissions in kg CO2e
     */
    @Cacheable(value = "externalApi", key = "'vehicle_' + #distanceMiles + '_' + #vehicleModel")
    public Double estimateVehicleEmissions(Double distanceMiles, String vehicleModel) {
        try {
            log.info("Fetching vehicle emissions: {} miles in {}", distanceMiles, vehicleModel);

            Map<String, Object> request = Map.of(
                    "type", "vehicle",
                    "distance_unit", "mi",
                    "distance_value", distanceMiles,
                    "vehicle_model_id", vehicleModel);

            Map<String, Object> response = webClient.post()
                    .uri(baseUrl + "/estimates")
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .timeout(Duration.ofSeconds(10))
                    .block();

            if (response != null && response.containsKey("data")) {
                Map<String, Object> data = (Map<String, Object>) response.get("data");
                Map<String, Object> attributes = (Map<String, Object>) data.get("attributes");
                return (Double) attributes.get("carbon_kg");
            }

            return null;
        } catch (Exception e) {
            log.error("Error fetching vehicle emissions: {}", e.getMessage());
            return null;
        }
    }

    /**
     * Estimate emissions for flight
     * 
     * @param distanceMiles Flight distance in miles
     * @param passengers    Number of passengers
     * @return Emissions in kg CO2e
     */
    @Cacheable(value = "externalApi", key = "'flight_' + #distanceMiles + '_' + #passengers")
    public Double estimateFlightEmissions(Double distanceMiles, Integer passengers) {
        try {
            log.info("Fetching flight emissions: {} miles for {} passengers", distanceMiles, passengers);

            Map<String, Object> request = Map.of(
                    "type", "flight",
                    "passengers", passengers,
                    "legs", new Object[] {
                            Map.of(
                                    "departure_airport", "sfo",
                                    "destination_airport", "jfk")
                    });

            Map<String, Object> response = webClient.post()
                    .uri(baseUrl + "/estimates")
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .timeout(Duration.ofSeconds(10))
                    .block();

            if (response != null && response.containsKey("data")) {
                Map<String, Object> data = (Map<String, Object>) response.get("data");
                Map<String, Object> attributes = (Map<String, Object>) data.get("attributes");
                return (Double) attributes.get("carbon_kg");
            }

            return null;
        } catch (Exception e) {
            log.error("Error fetching flight emissions: {}", e.getMessage());
            return null;
        }
    }
}
