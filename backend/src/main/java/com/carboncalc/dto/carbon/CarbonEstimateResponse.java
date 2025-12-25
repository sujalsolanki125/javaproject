package com.carboncalc.dto.carbon;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CarbonEstimateResponse {
    private EstimateData data;

    @Data
    public static class EstimateData {
        private String id;
        private String type;
        private EstimateAttributes attributes;
    }

    @Data
    public static class EstimateAttributes {
        // Common fields for all estimate types
        @JsonProperty("estimated_at")
        private LocalDateTime estimatedAt;

        @JsonProperty("carbon_g")
        private Double carbonG;

        @JsonProperty("carbon_lb")
        private Double carbonLb;

        @JsonProperty("carbon_kg")
        private Double carbonKg;

        @JsonProperty("carbon_mt")
        private Double carbonMt;

        // Electricity specific fields
        private String country;
        private String state;

        @JsonProperty("electricity_unit")
        private String electricityUnit;

        @JsonProperty("electricity_value")
        private String electricityValue;

        // Vehicle specific fields
        @JsonProperty("distance_value")
        private Double distanceValue;

        @JsonProperty("distance_unit")
        private String distanceUnit;

        @JsonProperty("vehicle_make")
        private String vehicleMake;

        @JsonProperty("vehicle_model")
        private String vehicleModel;

        @JsonProperty("vehicle_year")
        private Integer vehicleYear;

        @JsonProperty("vehicle_model_id")
        private String vehicleModelId;

        // Flight specific fields
        private Integer passengers;
        private FlightLeg[] legs;

        // Shipping specific fields
        @JsonProperty("weight_value")
        private String weightValue;

        @JsonProperty("weight_unit")
        private String weightUnit;

        @JsonProperty("transport_method")
        private String transportMethod;

        // Fuel combustion specific fields
        @JsonProperty("fuel_source_type")
        private String fuelSourceType;

        @JsonProperty("fuel_source_unit")
        private String fuelSourceUnit;

        @JsonProperty("fuel_source_value")
        private Double fuelSourceValue;
    }

    @Data
    public static class FlightLeg {
        @JsonProperty("departure_airport")
        private String departureAirport;

        @JsonProperty("destination_airport")
        private String destinationAirport;

        @JsonProperty("cabin_class")
        private String cabinClass;
    }
}