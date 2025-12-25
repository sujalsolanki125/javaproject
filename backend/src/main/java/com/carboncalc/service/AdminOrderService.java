package com.carboncalc.service;

import com.carboncalc.entity.AdminCustomerOrder;
import com.carboncalc.entity.AdminOrderLineItem;
import com.carboncalc.entity.AdminUserProfile;
import com.carboncalc.repository.AdminCustomerOrderRepository;
import com.carboncalc.repository.AdminOrderLineItemRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AdminOrderService {

    private final AdminCustomerOrderRepository orderRepository;
    private final AdminOrderLineItemRepository orderLineItemRepository;

    public List<AdminCustomerOrder> getAllOrders() {
        log.info("Fetching all orders");
        return orderRepository.findAllOrderByCreatedDesc();
    }

    public Optional<AdminCustomerOrder> getOrderById(Long customerOrderId) {
        log.info("Fetching order with ID: {}", customerOrderId);
        return orderRepository.findById(customerOrderId);
    }

    public Optional<AdminCustomerOrder> getOrderByReference(String orderReferenceNumber) {
        log.info("Fetching order with reference: {}", orderReferenceNumber);
        return orderRepository.findByOrderReferenceNumber(orderReferenceNumber);
    }

    public List<AdminCustomerOrder> getOrdersByUser(AdminUserProfile customerProfile) {
        log.info("Fetching orders for user: {}", customerProfile.getUserPrimaryEmailAddress());
        return orderRepository.findByCustomerProfile(customerProfile);
    }

    public List<AdminCustomerOrder> getOrdersByStatus(
            AdminCustomerOrder.OrderProcessingStatus orderStatus) {
        log.info("Fetching orders with status: {}", orderStatus);
        return orderRepository.findByOrderProcessingStatus(orderStatus);
    }

    public List<AdminCustomerOrder> getOrdersByPaymentStatus(
            AdminCustomerOrder.PaymentProcessingStatus paymentStatus) {
        log.info("Fetching orders with payment status: {}", paymentStatus);
        return orderRepository.findByPaymentProcessingStatus(paymentStatus);
    }

    public List<AdminCustomerOrder> getOrdersByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        log.info("Fetching orders between {} and {}", startDate, endDate);
        return orderRepository.findOrdersByDateRange(startDate, endDate);
    }

    public List<AdminCustomerOrder> searchOrders(String searchTerm) {
        log.info("Searching orders with term: {}", searchTerm);
        return orderRepository.searchOrders(searchTerm);
    }

    public AdminCustomerOrder createOrder(AdminCustomerOrder order) {
        log.info("Creating new order for customer: {}",
                order.getCustomerProfile().getUserPrimaryEmailAddress());

        if (order.getOrderReferenceNumber() == null) {
            order.setOrderReferenceNumber(generateOrderReference());
        }

        if (order.getOrderCreatedTimestamp() == null) {
            order.setOrderCreatedTimestamp(LocalDateTime.now());
        }
        order.setOrderUpdatedTimestamp(LocalDateTime.now());

        return orderRepository.save(order);
    }

    public AdminCustomerOrder updateOrder(Long customerOrderId, AdminCustomerOrder updatedOrder) {
        log.info("Updating order with ID: {}", customerOrderId);

        return orderRepository.findById(customerOrderId)
                .map(existingOrder -> {
                    existingOrder.setOrderProcessingStatus(updatedOrder.getOrderProcessingStatus());
                    existingOrder.setPaymentProcessingStatus(updatedOrder.getPaymentProcessingStatus());
                    existingOrder.setShippingAddressLine1(updatedOrder.getShippingAddressLine1());
                    existingOrder.setShippingCityName(updatedOrder.getShippingCityName());
                    existingOrder.setOrderTrackingNumber(updatedOrder.getOrderTrackingNumber());
                    existingOrder.setAdminOrderNotes(updatedOrder.getAdminOrderNotes());
                    existingOrder.setOrderUpdatedTimestamp(LocalDateTime.now());

                    return orderRepository.save(existingOrder);
                })
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + customerOrderId));
    }

    public AdminCustomerOrder updateOrderStatus(Long customerOrderId,
            AdminCustomerOrder.OrderProcessingStatus status) {
        log.info("Updating order status for ID {} to: {}", customerOrderId, status);

        return orderRepository.findById(customerOrderId)
                .map(order -> {
                    order.setOrderProcessingStatus(status);
                    order.setOrderUpdatedTimestamp(LocalDateTime.now());
                    return orderRepository.save(order);
                })
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + customerOrderId));
    }

    public AdminCustomerOrder updatePaymentStatus(Long customerOrderId,
            AdminCustomerOrder.PaymentProcessingStatus paymentStatus) {
        log.info("Updating payment status for order ID {} to: {}", customerOrderId, paymentStatus);

        return orderRepository.findById(customerOrderId)
                .map(order -> {
                    order.setPaymentProcessingStatus(paymentStatus);
                    order.setOrderUpdatedTimestamp(LocalDateTime.now());
                    return orderRepository.save(order);
                })
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + customerOrderId));
    }

    public void deleteOrder(Long customerOrderId) {
        log.info("Deleting order with ID: {}", customerOrderId);

        if (!orderRepository.existsById(customerOrderId)) {
            throw new RuntimeException("Order not found with ID: " + customerOrderId);
        }

        orderRepository.deleteById(customerOrderId);
    }

    public List<AdminOrderLineItem> getOrderLineItems(Long customerOrderId) {
        log.info("Fetching line items for order ID: {}", customerOrderId);

        return orderRepository.findById(customerOrderId)
                .map(order -> orderLineItemRepository.findByCustomerOrder(order))
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + customerOrderId));
    }

    public Double calculateRevenue(LocalDateTime startDate, LocalDateTime endDate) {
        log.info("Calculating revenue between {} and {}", startDate, endDate);
        Double revenue = orderRepository.calculateRevenueByDateRange(startDate, endDate);
        return revenue != null ? revenue : 0.0;
    }

    public Long getOrdersCount(LocalDateTime sinceDate) {
        log.info("Counting orders since: {}", sinceDate);
        return orderRepository.countOrdersSince(sinceDate);
    }

    public Double getAverageOrderValue() {
        log.info("Calculating average order value");
        Double avgValue = orderRepository.calculateAverageOrderValue();
        return avgValue != null ? avgValue : 0.0;
    }

    public List<AdminCustomerOrder> getOrdersByAmountRange(double minAmount, double maxAmount) {
        log.info("Fetching orders with amount between {} and {}", minAmount, maxAmount);
        return orderRepository.findByOrderAmountRange(minAmount, maxAmount);
    }

    private String generateOrderReference() {
        return "ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    public AdminCustomerOrder addTrackingNumber(Long customerOrderId, String trackingNumber) {
        log.info("Adding tracking number {} to order ID: {}", trackingNumber, customerOrderId);

        return orderRepository.findById(customerOrderId)
                .map(order -> {
                    order.setOrderTrackingNumber(trackingNumber);
                    order.setOrderUpdatedTimestamp(LocalDateTime.now());
                    return orderRepository.save(order);
                })
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + customerOrderId));
    }
}