package com.carboncalc.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "goals")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Goal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String title;

    private String description;

    private Double targetValue;

    private Double currentValue = 0.0;

    private String category;

    private LocalDate startDate;

    private LocalDate targetDate;

    @Column(nullable = false)
    private String status = "ACTIVE"; // ACTIVE, COMPLETED, FAILED

    @CreationTimestamp
    private LocalDateTime createdAt;
}
