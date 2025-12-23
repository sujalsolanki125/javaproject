package com.carboncalc.dto;

import lombok.Data;
import java.util.Map;

@Data
public class SurveySubmissionDTO {
    private String date;
    private Double totalEmissions;
    private Map<String, Double> breakdown;
    private Map<String, Object> surveyData;
}
