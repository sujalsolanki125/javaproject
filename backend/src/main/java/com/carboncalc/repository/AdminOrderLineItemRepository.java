package com.carboncalc.repository;

import com.carboncalc.entity.AdminOrderLineItem;
import com.carboncalc.entity.AdminCustomerOrder;
import com.carboncalc.entity.AdminProductCatalog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AdminOrderLineItemRepository extends JpaRepository<AdminOrderLineItem, Long> {

    List<AdminOrderLineItem> findByCustomerOrder(AdminCustomerOrder customerOrder);

    List<AdminOrderLineItem> findByProductCatalog(AdminProductCatalog productCatalog);

    List<AdminOrderLineItem> findByItemFulfillmentStatus(
            AdminOrderLineItem.ItemFulfillmentStatus itemFulfillmentStatus);

    @Query("SELECT oli FROM AdminOrderLineItem oli WHERE " +
            "oli.customerOrder.orderCreatedTimestamp BETWEEN :startDate AND :endDate")
    List<AdminOrderLineItem> findByOrderDateRange(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    @Query("SELECT oli.productCatalog, SUM(oli.orderedQuantityCount) as totalSold, " +
            "SUM(oli.lineItemTotalPrice) as totalRevenue " +
            "FROM AdminOrderLineItem oli " +
            "WHERE oli.customerOrder.orderCreatedTimestamp BETWEEN :startDate AND :endDate " +
            "GROUP BY oli.productCatalog " +
            "ORDER BY totalSold DESC")
    List<Object[]> findTopSellingProductsByDateRange(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    @Query("SELECT SUM(oli.orderedQuantityCount) FROM AdminOrderLineItem oli WHERE oli.productCatalog = :product")
    Long getTotalQuantitySoldForProduct(@Param("product") AdminProductCatalog product);

    @Query("SELECT SUM(oli.lineItemTotalPrice) FROM AdminOrderLineItem oli WHERE " +
            "oli.productCatalog = :product AND " +
            "oli.customerOrder.paymentProcessingStatus = 'PAYMENT_CAPTURED'")
    Double getTotalRevenueForProduct(@Param("product") AdminProductCatalog product);

    @Query("SELECT oli FROM AdminOrderLineItem oli " +
            "WHERE oli.customerOrder.orderProcessingStatus IN ('SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED')")
    List<AdminOrderLineItem> findShippedItems();
}