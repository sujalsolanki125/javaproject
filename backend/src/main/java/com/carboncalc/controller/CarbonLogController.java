package com.carboncalc.controller;

import com.carboncalc.entity.CarbonLog;
import com.carboncalc.entity.User;
import com.carboncalc.repository.CarbonLogRepository;
import com.carboncalc.repository.UserRepository;
import com.carboncalc.service.CarbonCalcService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/carbon-logs")
@CrossOrigin(origins = "*")
public class CarbonLogController {

    @Autowired
    private CarbonLogRepository carbonLogRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CarbonCalcService carbonCalcService;

    @PostMapping
    public ResponseEntity<CarbonLog> createLog(@RequestBody CarbonLog log, Principal principal) {
        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        log.setUser(user);
        
        // Calculate carbon emission
        Double emission = carbonCalcService.calculateActivityEmission(
                log.getCategory(), log.getActivity(), log.getAmount());
        log.setCarbonEmission(emission);
        
        return ResponseEntity.ok(carbonLogRepository.save(log));
    }

    @GetMapping
    public ResponseEntity<List<CarbonLog>> getUserLogs(Principal principal) {
        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(carbonLogRepository.findByUserId(user.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CarbonLog> getLogById(@PathVariable Long id) {
        CarbonLog log = carbonLogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Log not found"));
        return ResponseEntity.ok(log);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteLog(@PathVariable Long id) {
        carbonLogRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/total")
    public ResponseEntity<Double> getTotalCarbon(Principal principal) {
        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Double total = carbonLogRepository.getTotalCarbonByUserId(user.getId());
        return ResponseEntity.ok(total != null ? total : 0.0);
    }
}
