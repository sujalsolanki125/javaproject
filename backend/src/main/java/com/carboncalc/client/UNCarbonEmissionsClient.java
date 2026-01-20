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
 * Client for UN Carbon Emissions Database
 * Fetches country-level emissions data and statistics
 * API: https://data.un.org/
 */
@Slf4j
// @Service - Disabled: Using local calculations instead of API
@RequiredArgsConstructor
public class UNCarbonEmissionsClient {

    @Value("${un.emissions.api.url:https://data.un.org/ws/rest}")
    private String baseUrl;

    private final WebClient webClient;

    /**
     * Get country emissions data
     * 
     * @param countryCode ISO country code (e.g., "USA", "GBR")
     * @return Emissions data in metric tons CO2
     */
    @Cacheable(value = "externalApi", key = "'un_emissions_' + #countryCode")
    public Map<String, Object> getCountryEmissions(String countryCode) {
        try {
            log.info("Fetching UN emissions data for country: {}", countryCode);

            // Note: This is a simplified example
            // Real UN API may require different endpoints and authentication
            String endpoint = String.format("%s/data/UNFCCC,DF_UNFCCC_GHG,1.0/%s", baseUrl, countryCode);

            Map<String, Object> response = webClient.get()
                    .uri(endpoint)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .timeout(Duration.ofSeconds(15))
                    .block();

            if (response != null) {
                return response;
            }

            return Map.of();
        } catch (Exception e) {
            log.error("Error fetching UN emissions data: {}", e.getMessage());
            return Map.of();
        }
    }

    /**
     * Get global average emissions per capita
     * 
     * @return Emissions in metric tons CO2 per person
     */
    @Cacheable(value = "externalApi", key = "'global_avg_emissions'")
    public Double getGlobalAverageEmissions() {
        try {
            log.info("Fetching global average emissions");

            // Placeholder - would query UN statistics API
            // For now, returning 2023 global average estimate
            return 4.7; // metric tons CO2 per capita
        } catch (Exception e) {
            log.error("Error fetching global average emissions: {}", e.getMessage());
            return null;
        }
    }

    /**
     * Compare country emissions
     * 
     * @param countryCodes List of country codes to compare
     * @return Map of country codes to emissions data
     */
    @Cacheable(value = "externalApi", key = "'compare_emissions_' + #countryCodes.hashCode()")
    public Map<String, Map<String, Object>> compareCountryEmissions(List<String> countryCodes) {
        try {
            log.info("Comparing emissions for countries: {}", countryCodes);

            return countryCodes.stream()
                    .collect(java.util.stream.Collectors.toMap(
                            code -> code,
                            this::getCountryEmissions));
        } catch (Exception e) {
            log.error("Error comparing country emissions: {}", e.getMessage());
            return Map.of();
        }
    }
}
