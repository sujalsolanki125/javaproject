package com.carboncalc.controller;

import com.carboncalc.dto.SurveySubmissionDTO;
import com.carboncalc.entity.Survey;
import com.carboncalc.entity.User;
import com.carboncalc.repository.UserRepository;
import com.carboncalc.service.SurveyService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/surveys")
@CrossOrigin(origins = "*")
public class SurveyController {

    @Autowired
    private SurveyService surveyService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @PostMapping
    public ResponseEntity<Survey> createSurvey(@RequestBody SurveySubmissionDTO submissionDTO, Principal principal) {
        try {
            log.info("Received survey submission from user: {}", principal.getName());
            log.debug("Submission DTO: {}", submissionDTO);

            // Get the authenticated user
            User user = userRepository.findByUsername(principal.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Create a new Survey entity and map data from surveyData
            Survey survey = new Survey();
            survey.setUser(user);
            survey.setTotalFootprint(submissionDTO.getTotalEmissions());

            // Extract survey data from the map
            Map<String, Object> surveyData = submissionDTO.getSurveyData();

            if (surveyData != null) {
                // Map transportation data
                survey.setTransportation(serializeToJson(Map.of(
                        "transportMode", getStringValue(surveyData, "transportMode"),
                        "vehicleInfo", surveyData.getOrDefault("vehicleInfo", null),
                        "commuteFrequency", getStringValue(surveyData, "commuteFrequency"),
                        "commuteDistance", getDoubleValue(surveyData, "commuteDistance"),
                        "shortHaulFlights", getIntValue(surveyData, "shortHaulFlights"),
                        "longHaulFlights", getIntValue(surveyData, "longHaulFlights"),
                        "flightLegs", surveyData.getOrDefault("flightLegs", null))));

                // Map diet data
                survey.setDiet(serializeToJson(Map.of(
                        "dietType", getStringValue(surveyData, "dietType"))));

                // Map housing/energy data
                survey.setHousing(serializeToJson(Map.of(
                        "electricityUsage", getStringValue(surveyData, "electricityUsage"),
                        "electricityUnit", getStringValue(surveyData, "electricityUnit"),
                        "countryCode", getStringValue(surveyData, "countryCode"),
                        "stateCode", getStringValue(surveyData, "stateCode"),
                        "naturalGasUsage", getStringValue(surveyData, "naturalGasUsage"),
                        "naturalGasUnit", getStringValue(surveyData, "naturalGasUnit"),
                        "heatingOilUsage", getStringValue(surveyData, "heatingOilUsage"),
                        "heatingOilUnit", getStringValue(surveyData, "heatingOilUnit"))));

                // Map consumption/habits data
                survey.setConsumption(serializeToJson(Map.of(
                        "useReusableBags", getBooleanValue(surveyData, "useReusableBags"),
                        "recycleWaste", getBooleanValue(surveyData, "recycleWaste"),
                        "compostFood", getBooleanValue(surveyData, "compostFood"),
                        "unplugElectronics", getBooleanValue(surveyData, "unplugElectronics"),
                        "buyLocalProduce", getBooleanValue(surveyData, "buyLocalProduce"))));
            }

            // Save the survey
            Survey savedSurvey = surveyService.createSurvey(user.getId(), survey);
            log.info("Survey created successfully with ID: {}", savedSurvey.getId());

            return ResponseEntity.ok(savedSurvey);
        } catch (Exception e) {
            log.error("Error creating survey: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to create survey: " + e.getMessage());
        }
    }

    // Helper methods to safely extract values from the map
    private String getStringValue(Map<String, Object> map, String key) {
        Object value = map.get(key);
        return value != null ? value.toString() : "";
    }

    private Double getDoubleValue(Map<String, Object> map, String key) {
        Object value = map.get(key);
        if (value == null)
            return 0.0;
        if (value instanceof Number)
            return ((Number) value).doubleValue();
        try {
            return Double.parseDouble(value.toString());
        } catch (NumberFormatException e) {
            return 0.0;
        }
    }

    private Integer getIntValue(Map<String, Object> map, String key) {
        Object value = map.get(key);
        if (value == null)
            return 0;
        if (value instanceof Number)
            return ((Number) value).intValue();
        try {
            return Integer.parseInt(value.toString());
        } catch (NumberFormatException e) {
            return 0;
        }
    }

    private Boolean getBooleanValue(Map<String, Object> map, String key) {
        Object value = map.get(key);
        if (value == null)
            return false;
        if (value instanceof Boolean)
            return (Boolean) value;
        return Boolean.parseBoolean(value.toString());
    }

    private String serializeToJson(Map<String, Object> data) {
        try {
            return objectMapper.writeValueAsString(data);
        } catch (Exception e) {
            log.error("Error serializing to JSON: {}", e.getMessage());
            return "{}";
        }
    }

    @GetMapping
    public ResponseEntity<List<Survey>> getUserSurveys(Principal principal) {
        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(surveyService.getUserSurveys(user.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Survey> getSurveyById(@PathVariable Long id) {
        return ResponseEntity.ok(surveyService.getSurveyById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSurvey(@PathVariable Long id) {
        surveyService.deleteSurvey(id);
        return ResponseEntity.ok().build();
    }
}
