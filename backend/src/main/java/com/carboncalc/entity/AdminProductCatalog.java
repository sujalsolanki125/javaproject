package com.carboncalc.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.HashSet;

@Entity
@Table(name = "admin_product_catalog")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminProductCatalog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "catalog_product_id")
    private Long catalogProductId;

    @Column(name = "product_display_name", nullable = false, length = 255)
    private String productDisplayName;

    @Column(name = "product_detailed_description", columnDefinition = "TEXT")
    private String productDetailedDescription;

    @Column(name = "product_selling_price", nullable = false, precision = 10)
    private Double productSellingPrice;

    @Column(name = "product_category_type", nullable = false, length = 100)
    private String productCategoryType;

    @Column(name = "available_inventory_count", nullable = false)
    private Integer availableInventoryCount;

    @Column(name = "product_image_path", columnDefinition = "LONGTEXT")
    private String productImagePath;

    @Column(name = "catalog_status", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private ProductCatalogStatus catalogStatus = ProductCatalogStatus.ACTIVE;

    @Column(name = "co2_emission_offset", length = 50)
    private String co2EmissionOffset;

    @Column(name = "product_vendor_name", length = 100)
    private String productVendorName;

    @Column(name = "admin_notes", columnDefinition = "TEXT")
    private String adminNotes;

    @Column(name = "featured_product_flag")
    private Boolean featuredProductFlag = false;

    @Column(name = "product_weight_grams")
    private Double productWeightGrams;

    @Column(name = "sustainability_rating")
    private Integer sustainabilityRating;

    @OneToMany(mappedBy = "productCatalog", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<AdminOrderLineItem> orderLineItems = new HashSet<>();

    @CreationTimestamp
    @Column(name = "catalog_created_timestamp")
    private LocalDateTime catalogCreatedTimestamp;

    @UpdateTimestamp
    @Column(name = "catalog_updated_timestamp")
    private LocalDateTime catalogUpdatedTimestamp;

    public enum ProductCatalogStatus {
        ACTIVE, INACTIVE, DISCONTINUED, DRAFT
    }
}