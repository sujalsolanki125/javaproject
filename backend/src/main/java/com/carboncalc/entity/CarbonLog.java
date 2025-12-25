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

    // Carbon Interface API integration fields
    private String carbonInterfaceEstimateId;

    @Column(name = "api_source")
    private String apiSource = "static_calculation"; // 'carbon_interface' or 'static_calculation'

    private String vehicleModelId;
    private String vehicleMake;
    private String vehicleModel;
    private Integer vehicleYear;

    @Column(columnDefinition = "JSON")
    private String flightLegs;

    private String electricityUnit;
    private String countryCode;
    private String stateCode;

    private LocalDateTime apiCalculatedAt;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
