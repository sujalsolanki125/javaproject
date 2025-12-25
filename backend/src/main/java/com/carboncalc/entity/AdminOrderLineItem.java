package com.carboncalc.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "admin_order_line_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminOrderLineItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_line_item_id")
    private Long orderLineItemId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_order_id", nullable = false)
    private AdminCustomerOrder customerOrder;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "catalog_product_id", nullable = false)
    private AdminProductCatalog productCatalog;

    @Column(name = "ordered_quantity_count", nullable = false)
    private Integer orderedQuantityCount;

    @Column(name = "unit_selling_price", nullable = false, precision = 10)
    private Double unitSellingPrice;

    @Column(name = "line_item_total_price", nullable = false, precision = 12)
    private Double lineItemTotalPrice;

    @Column(name = "product_name_snapshot", nullable = false, length = 255)
    private String productNameSnapshot;

    @Column(name = "product_description_snapshot", columnDefinition = "TEXT")
    private String productDescriptionSnapshot;

    @Column(name = "applied_discount_amount", precision = 8)
    private Double appliedDiscountAmount = 0.0;

    @Column(name = "item_fulfillment_status", length = 30)
    @Enumerated(EnumType.STRING)
    private ItemFulfillmentStatus itemFulfillmentStatus = ItemFulfillmentStatus.PENDING;

    @CreationTimestamp
    @Column(name = "line_item_created_timestamp")
    private LocalDateTime lineItemCreatedTimestamp;

    public enum ItemFulfillmentStatus {
        PENDING, ALLOCATED, PACKED, SHIPPED, DELIVERED, CANCELLED, RETURNED
    }
}