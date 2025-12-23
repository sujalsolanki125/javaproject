package com.carboncalc.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "leaderboard")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Leaderboard {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne
    @JoinColumn(name = "user_id", unique = true)
    private User user;
    
    @Column(nullable = false)
    private Integer rank;
    
    @Column(nullable = false)
    private Integer totalPoints;
    
    private Double totalCarbonSaved;
    
    @UpdateTimestamp
    private LocalDateTime lastUpdated;
}
