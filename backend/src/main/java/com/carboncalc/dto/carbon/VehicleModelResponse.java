package com.carboncalc.dto.carbon;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
public class VehicleModelResponse {
    private List<VehicleModelData> data;

    @Data
    public static class VehicleModelData {
        private String id;
        private String type;
        private VehicleModelAttributes attributes;
    }

    @Data
    public static class VehicleModelAttributes {
        private String name;
        private Integer year;

        @JsonProperty("vehicle_make")
        private String vehicleMake;
    }
}