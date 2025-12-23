package com.carboncalc.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "surveys")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Survey {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(columnDefinition = "TEXT")
    private String transportation;

    @Column(columnDefinition = "TEXT")
    private String housing;

    @Column(columnDefinition = "TEXT")
    private String diet;

    @Column(columnDefinition = "TEXT")
    private String consumption;

    private Double totalFootprint;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
