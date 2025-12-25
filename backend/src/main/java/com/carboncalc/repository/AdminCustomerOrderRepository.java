package com.carboncalc.repository;

import com.carboncalc.entity.AdminCustomerOrder;
import com.carboncalc.entity.AdminUserProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AdminCustomerOrderRepository extends JpaRepository<AdminCustomerOrder, Long> {

    Optional<AdminCustomerOrder> findByOrderReferenceNumber(String orderReferenceNumber);

    List<AdminCustomerOrder> findByCustomerProfile(AdminUserProfile customerProfile);

    List<AdminCustomerOrder> findByOrderProcessingStatus(
            AdminCustomerOrder.OrderProcessingStatus orderProcessingStatus);

    List<AdminCustomerOrder> findByPaymentProcessingStatus(
            AdminCustomerOrder.PaymentProcessingStatus paymentProcessingStatus);

    @Query("SELECT o FROM AdminCustomerOrder o WHERE o.orderCreatedTimestamp BETWEEN :startDate AND :endDate")
    List<AdminCustomerOrder> findOrdersByDateRange(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    @Query("SELECT o FROM AdminCustomerOrder o WHERE " +
            "o.orderReferenceNumber LIKE CONCAT('%', :searchTerm, '%') OR " +
            "LOWER(o.customerProfile.userFullDisplayName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(o.customerProfile.userPrimaryEmailAddress) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<AdminCustomerOrder> searchOrders(@Param("searchTerm") String searchTerm);

    @Query("SELECT o FROM AdminCustomerOrder o WHERE o.orderTotalAmount BETWEEN :minAmount AND :maxAmount")
    List<AdminCustomerOrder> findByOrderAmountRange(
            @Param("minAmount") Double minAmount,
            @Param("maxAmount") Double maxAmount);

    @Query("SELECT o FROM AdminCustomerOrder o ORDER BY o.orderCreatedTimestamp DESC")
    List<AdminCustomerOrder> findAllOrderByCreatedDesc();

    @Query("SELECT SUM(o.orderTotalAmount) FROM AdminCustomerOrder o WHERE " +
            "o.paymentProcessingStatus = 'PAYMENT_CAPTURED' AND " +
            "o.orderCreatedTimestamp BETWEEN :startDate AND :endDate")
    Double calculateRevenueByDateRange(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    @Query("SELECT COUNT(o) FROM AdminCustomerOrder o WHERE o.orderCreatedTimestamp >= :sinceDate")
    Long countOrdersSince(@Param("sinceDate") LocalDateTime sinceDate);

    @Query("SELECT AVG(o.orderTotalAmount) FROM AdminCustomerOrder o WHERE " +
            "o.paymentProcessingStatus = 'PAYMENT_CAPTURED'")
    Double calculateAverageOrderValue();

    List<AdminCustomerOrder> findByOrderTrackingNumber(String orderTrackingNumber);
}