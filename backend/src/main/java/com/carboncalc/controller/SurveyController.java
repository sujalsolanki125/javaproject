package com.carboncalc.controller;

import com.carboncalc.entity.Survey;
import com.carboncalc.entity.User;
import com.carboncalc.repository.UserRepository;
import com.carboncalc.service.SurveyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/surveys")
@CrossOrigin(origins = "*")
public class SurveyController {

    @Autowired
    private SurveyService surveyService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<Survey> createSurvey(@RequestBody Survey survey, Principal principal) {
        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(surveyService.createSurvey(user.getId(), survey));
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
