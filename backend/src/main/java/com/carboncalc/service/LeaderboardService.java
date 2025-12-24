package com.carboncalc.service;

import com.carboncalc.entity.Leaderboard;
import com.carboncalc.entity.User;
import com.carboncalc.repository.LeaderboardRepository;
import com.carboncalc.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class LeaderboardService {

    @Autowired
    private LeaderboardRepository leaderboardRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Leaderboard> getTopLeaderboard(int limit) {
        return leaderboardRepository.findTop10ByOrderByRankAsc()
                .stream()
                .limit(limit)
                .collect(Collectors.toList());
    }

    public Optional<Leaderboard> getUserLeaderboard(Long userId) {
        return leaderboardRepository.findByUserId(userId);
    }

    @Transactional
    public void updateLeaderboard(Long userId, double carbonSaved, int points) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Optional<Leaderboard> existingLeaderboard = leaderboardRepository.findByUserId(userId);

        Leaderboard leaderboard;
        if (existingLeaderboard.isPresent()) {
            leaderboard = existingLeaderboard.get();
            leaderboard.setTotalCarbonSaved(
                    (leaderboard.getTotalCarbonSaved() != null ? leaderboard.getTotalCarbonSaved() : 0.0)
                            + carbonSaved);
            leaderboard.setTotalPoints(leaderboard.getTotalPoints() + points);
        } else {
            leaderboard = new Leaderboard();
            leaderboard.setUser(user);
            leaderboard.setTotalCarbonSaved(carbonSaved);
            leaderboard.setTotalPoints(points);
            leaderboard.setRank(999); // Will be updated by recalculateRanks
        }

        leaderboardRepository.save(leaderboard);
        recalculateRanks();
    }

    @Transactional
    public void recalculateRanks() {
        List<Leaderboard> allLeaderboards = leaderboardRepository.findAll();

        // Sort by total carbon saved (descending)
        allLeaderboards.sort((a, b) -> {
            double carbonA = a.getTotalCarbonSaved() != null ? a.getTotalCarbonSaved() : 0.0;
            double carbonB = b.getTotalCarbonSaved() != null ? b.getTotalCarbonSaved() : 0.0;
            return Double.compare(carbonB, carbonA);
        });

        // Update ranks
        for (int i = 0; i < allLeaderboards.size(); i++) {
            allLeaderboards.get(i).setRank(i + 1);
        }

        leaderboardRepository.saveAll(allLeaderboards);
    }
}
