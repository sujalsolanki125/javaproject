package com.carboncalc.controller;

import com.carboncalc.entity.Leaderboard;
import com.carboncalc.entity.User;
import com.carboncalc.service.LeaderboardService;
import com.carboncalc.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/leaderboard")
@CrossOrigin(origins = "*")
public class LeaderboardController {

    @Autowired
    private LeaderboardService leaderboardService;

    @Autowired
    private UserService userService;

    @GetMapping("/top")
    public ResponseEntity<List<Map<String, Object>>> getTopLeaderboard(
            @RequestParam(defaultValue = "10") int limit) {
        List<Leaderboard> leaderboards = leaderboardService.getTopLeaderboard(limit);

        List<Map<String, Object>> response = leaderboards.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/user")
    public ResponseEntity<Map<String, Object>> getUserLeaderboard(Principal principal) {
        User user = userService.getUserByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Leaderboard leaderboard = leaderboardService.getUserLeaderboard(user.getId())
                .orElse(null);

        if (leaderboard == null) {
            Map<String, Object> response = new HashMap<>();
            response.put("rank", null);
            response.put("username", user.getUsername());
            response.put("fullName",
                    user.getFirstName() != null ? user.getFirstName() + " " + user.getLastName() : user.getUsername());
            response.put("profilePicture", user.getProfilePicture());
            response.put("totalCarbonSaved", 0.0);
            response.put("totalPoints", 0);
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.ok(convertToResponse(leaderboard));
    }

    private Map<String, Object> convertToResponse(Leaderboard leaderboard) {
        Map<String, Object> response = new HashMap<>();
        User user = leaderboard.getUser();

        response.put("rank", leaderboard.getRank());
        response.put("username", user.getUsername());
        response.put("fullName",
                user.getFirstName() != null ? user.getFirstName() + " " + user.getLastName() : user.getUsername());
        response.put("profilePicture", user.getProfilePicture());
        response.put("totalCarbonSaved", leaderboard.getTotalCarbonSaved());
        response.put("totalPoints", leaderboard.getTotalPoints());

        return response;
    }
}
