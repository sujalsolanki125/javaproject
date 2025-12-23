package com.carboncalc.service;

import com.carboncalc.entity.Survey;
import com.carboncalc.entity.User;
import com.carboncalc.repository.SurveyRepository;
import com.carboncalc.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SurveyService {

    @Autowired
    private SurveyRepository surveyRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CarbonCalcService carbonCalcService;

    public Survey createSurvey(Long userId, Survey survey) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        survey.setUser(user);
        
        // Calculate total footprint
        Double totalFootprint = carbonCalcService.calculateTotalFootprint(survey);
        survey.setTotalFootprint(totalFootprint);
        
        return surveyRepository.save(survey);
    }

    public List<Survey> getUserSurveys(Long userId) {
        return surveyRepository.findByUserId(userId);
    }

    public Survey getSurveyById(Long id) {
        return surveyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Survey not found"));
    }

    public void deleteSurvey(Long id) {
        surveyRepository.deleteById(id);
    }
}
