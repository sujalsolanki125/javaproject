package com.carboncalc.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "vehicle_cache")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VehicleCache {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "make_id", nullable = false)
    private String makeId;

    @Column(name = "make_name", nullable = false, length = 100)
    private String makeName;

    @Column(name = "model_id", nullable = false, unique = true)
    private String modelId;

    @Column(name = "model_name", nullable = false, length = 100)
    private String modelName;

    @Column(name = "model_year", nullable = false)
    private Integer modelYear;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}