package com.carboncalc.dto.carbon;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
public class VehicleMakeResponse {
    private List<VehicleMakeData> data;

    @Data
    public static class VehicleMakeData {
        private String id;
        private String type;
        private VehicleMakeAttributes attributes;
    }

    @Data
    public static class VehicleMakeAttributes {
        private String name;

        @JsonProperty("number_of_models")
        private Integer numberOfModels;
    }
}