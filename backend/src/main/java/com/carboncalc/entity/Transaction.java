package com.carboncalc.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Transaction {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne
    @JoinColumn(name = "item_id", nullable = false)
    private MarketplaceItem item;
    
    @Column(nullable = false)
    private Integer quantity;
    
    @Column(nullable = false)
    private Double totalPrice;
    
    @Column(nullable = false)
    private String status; // PENDING, COMPLETED, CANCELLED
    
    @CreationTimestamp
    private LocalDateTime transactionDate;
}
