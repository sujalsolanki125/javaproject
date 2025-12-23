package com.carboncalc.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "carbon_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CarbonLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String category; // transportation, energy, food, waste

    @Column(nullable = false)
    private String activity;

    private Double amount;

    @Column(nullable = false)
    private Double carbonEmission;

    private LocalDate logDate;

    private String description;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
