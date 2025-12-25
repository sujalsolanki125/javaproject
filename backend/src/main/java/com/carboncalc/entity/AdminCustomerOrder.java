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
@Table(name = "admin_customer_orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminCustomerOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "customer_order_id")
    private Long customerOrderId;

    @Column(name = "order_reference_number", unique = true, nullable = false, length = 50)
    private String orderReferenceNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_profile_id", nullable = false)
    private AdminUserProfile customerProfile;

    @Column(name = "order_total_amount", nullable = false, precision = 12)
    private Double orderTotalAmount;

    @Column(name = "order_subtotal_amount", precision = 12)
    private Double orderSubtotalAmount;

    @Column(name = "tax_amount_charged", precision = 8)
    private Double taxAmountCharged = 0.0;

    @Column(name = "shipping_cost_amount", precision = 8)
    private Double shippingCostAmount = 0.0;

    @Column(name = "order_processing_status", nullable = false, length = 30)
    @Enumerated(EnumType.STRING)
    private OrderProcessingStatus orderProcessingStatus = OrderProcessingStatus.PENDING_CONFIRMATION;

    @Column(name = "payment_processing_status", nullable = false, length = 30)
    @Enumerated(EnumType.STRING)
    private PaymentProcessingStatus paymentProcessingStatus = PaymentProcessingStatus.PAYMENT_PENDING;

    @Column(name = "shipping_address_line1", length = 255)
    private String shippingAddressLine1;

    @Column(name = "shipping_address_line2", length = 255)
    private String shippingAddressLine2;

    @Column(name = "shipping_city_name", length = 100)
    private String shippingCityName;

    @Column(name = "shipping_state_province", length = 100)
    private String shippingStateProvince;

    @Column(name = "shipping_postal_code", length = 20)
    private String shippingPostalCode;

    @Column(name = "shipping_country_code", length = 10)
    private String shippingCountryCode;

    @Column(name = "order_tracking_number", length = 100)
    private String orderTrackingNumber;

    @Column(name = "estimated_delivery_date")
    private LocalDateTime estimatedDeliveryDate;

    @Column(name = "order_cancellation_reason", columnDefinition = "TEXT")
    private String orderCancellationReason;

    @Column(name = "admin_order_notes", columnDefinition = "TEXT")
    private String adminOrderNotes;

    @OneToMany(mappedBy = "customerOrder", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<AdminOrderLineItem> orderLineItems = new HashSet<>();

    @CreationTimestamp
    @Column(name = "order_created_timestamp")
    private LocalDateTime orderCreatedTimestamp;

    @UpdateTimestamp
    @Column(name = "order_updated_timestamp")
    private LocalDateTime orderUpdatedTimestamp;

    @Column(name = "order_completed_timestamp")
    private LocalDateTime orderCompletedTimestamp;

    public enum OrderProcessingStatus {
        PENDING_CONFIRMATION, CONFIRMED, PROCESSING, PACKAGING, SHIPPED, OUT_FOR_DELIVERY, DELIVERED, CANCELLED,
        RETURNED, REFUNDED
    }

    public enum PaymentProcessingStatus {
        PAYMENT_PENDING, PAYMENT_AUTHORIZED, PAYMENT_CAPTURED, PAYMENT_FAILED, PAYMENT_CANCELLED, REFUND_PENDING,
        REFUND_COMPLETED
    }
}