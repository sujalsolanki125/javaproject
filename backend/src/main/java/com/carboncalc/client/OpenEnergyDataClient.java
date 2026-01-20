package com.carboncalc.client;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;
import java.util.List;
import java.util.Map;

/**
 * Client for Open Energy Data API
 * Fetches energy grid carbon intensity data
 * API: https://api.carbonintensity.org.uk/ (UK example)
 */
@Slf4j
// @Service - Disabled: Using local calculations instead of API
@RequiredArgsConstructor
public class OpenEnergyDataClient {

    @Value("${energy.data.api.url:https://api.carbonintensity.org.uk}")
    private String baseUrl;

    private final WebClient webClient;

    /**
     * Get current carbon intensity for region
     * 
     * @param regionId Region ID (e.g., "1" for North Scotland)
     * @return Carbon intensity in gCO2/kWh
     */
    @Cacheable(value = "externalApi", key = "'energy_intensity_' + #regionId")
    public Double getCurrentCarbonIntensity(String regionId) {
        try {
            log.info("Fetching carbon intensity for region: {}", regionId);

            Map<String, Object> response = webClient.get()
                    .uri(baseUrl + "/regional/regionid/" + regionId)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .timeout(Duration.ofSeconds(10))
                    .block();

            if (response != null && response.containsKey("data")) {
                List<Map<String, Object>> data = (List<Map<String, Object>>) response.get("data");
                if (!data.isEmpty()) {
                    Map<String, Object> regionData = data.get(0);
                    Map<String, Object> intensity = (Map<String, Object>) regionData.get("data");
                    if (intensity != null) {
                        Object forecast = intensity.get("forecast");
                        if (forecast instanceof Number) {
                            return ((Number) forecast).doubleValue();
                        }
                    }
                }
            }

            return null;
        } catch (Exception e) {
            log.error("Error fetching carbon intensity: {}", e.getMessage());
            return null;
        }
    }

    /**
     * Get energy generation mix for region
     * 
     * @param regionId Region ID
     * @return Map of fuel types to percentages
     */
    @Cacheable(value = "externalApi", key = "'energy_mix_' + #regionId")
    public Map<String, Double> getEnergyGenerationMix(String regionId) {
        try {
            log.info("Fetching energy generation mix for region: {}", regionId);

            Map<String, Object> response = webClient.get()
                    .uri(baseUrl + "/regional/regionid/" + regionId)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .timeout(Duration.ofSeconds(10))
                    .block();

            if (response != null && response.containsKey("data")) {
                List<Map<String, Object>> data = (List<Map<String, Object>>) response.get("data");
                if (!data.isEmpty()) {
                    Map<String, Object> regionData = data.get(0);
                    Map<String, Object> dataObj = (Map<String, Object>) regionData.get("data");
                    if (dataObj != null && dataObj.containsKey("generationmix")) {
                        List<Map<String, Object>> generationMix = (List<Map<String, Object>>) dataObj
                                .get("generationmix");

                        return generationMix.stream()
                                .collect(java.util.stream.Collectors.toMap(
                                        item -> (String) item.get("fuel"),
                                        item -> ((Number) item.get("perc")).doubleValue()));
                    }
                }
            }

            return Map.of();
        } catch (Exception e) {
            log.error("Error fetching energy generation mix: {}", e.getMessage());
            return Map.of();
        }
    }
}
