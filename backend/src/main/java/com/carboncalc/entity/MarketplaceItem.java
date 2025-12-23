package com.carboncalc.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "marketplace_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MarketplaceItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String description;

    @Column(nullable = false)
    private String category; // carbon_credit, eco_product, service

    @Column(nullable = false)
    private Double price;

    private String imageUrl;

    @Column(nullable = false)
    private Integer stock;

    private String seller;

    @Column(nullable = false)
    private Boolean available = true;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
