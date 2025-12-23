package com.carboncalc.controller;

import com.carboncalc.entity.Goal;
import com.carboncalc.entity.User;
import com.carboncalc.repository.GoalRepository;
import com.carboncalc.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/goals")
@CrossOrigin(origins = "*")
public class GoalsController {

    @Autowired
    private GoalRepository goalRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<Goal> createGoal(@RequestBody Goal goal, Principal principal) {
        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        goal.setUser(user);
        return ResponseEntity.ok(goalRepository.save(goal));
    }

    @GetMapping
    public ResponseEntity<List<Goal>> getUserGoals(Principal principal) {
        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(goalRepository.findByUserId(user.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Goal> getGoalById(@PathVariable Long id) {
        Goal goal = goalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Goal not found"));
        return ResponseEntity.ok(goal);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Goal> updateGoal(@PathVariable Long id, @RequestBody Goal goalDetails) {
        Goal goal = goalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Goal not found"));

        goal.setTitle(goalDetails.getTitle());
        goal.setDescription(goalDetails.getDescription());
        goal.setTargetValue(goalDetails.getTargetValue());
        goal.setCurrentValue(goalDetails.getCurrentValue());
        goal.setStatus(goalDetails.getStatus());

        return ResponseEntity.ok(goalRepository.save(goal));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteGoal(@PathVariable Long id) {
        goalRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
