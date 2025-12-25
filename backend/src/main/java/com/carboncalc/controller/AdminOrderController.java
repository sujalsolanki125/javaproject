package com.carboncalc.controller;

import com.carboncalc.entity.AdminCustomerOrder;
import com.carboncalc.entity.AdminOrderLineItem;
import com.carboncalc.service.AdminOrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "http://localhost:5173")
public class AdminOrderController {

    private final AdminOrderService orderService;

    @GetMapping
    public ResponseEntity<List<AdminCustomerOrder>> getAllOrders() {
        log.info("GET /api/admin/orders - Fetching all orders");
        List<AdminCustomerOrder> orders = orderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AdminCustomerOrder> getOrderById(@PathVariable Long id) {
        log.info("GET /api/admin/orders/{} - Fetching order by ID", id);
        Optional<AdminCustomerOrder> order = orderService.getOrderById(id);
        return order.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/reference/{reference}")
    public ResponseEntity<AdminCustomerOrder> getOrderByReference(@PathVariable String reference) {
        log.info("GET /api/admin/orders/reference/{} - Fetching order by reference", reference);
        Optional<AdminCustomerOrder> order = orderService.getOrderByReference(reference);
        return order.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<AdminCustomerOrder>> getOrdersByStatus(
            @PathVariable AdminCustomerOrder.OrderProcessingStatus status) {
        log.info("GET /api/admin/orders/status/{} - Fetching orders by status", status);
        List<AdminCustomerOrder> orders = orderService.getOrdersByStatus(status);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/payment-status/{paymentStatus}")
    public ResponseEntity<List<AdminCustomerOrder>> getOrdersByPaymentStatus(
            @PathVariable AdminCustomerOrder.PaymentProcessingStatus paymentStatus) {
        log.info("GET /api/admin/orders/payment-status/{} - Fetching orders by payment status", paymentStatus);
        List<AdminCustomerOrder> orders = orderService.getOrdersByPaymentStatus(paymentStatus);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/search")
    public ResponseEntity<List<AdminCustomerOrder>> searchOrders(@RequestParam String term) {
        log.info("GET /api/admin/orders/search?term={} - Searching orders", term);
        List<AdminCustomerOrder> orders = orderService.searchOrders(term);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<AdminCustomerOrder>> getOrdersByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        log.info("GET /api/admin/orders/date-range?startDate={}&endDate={} - Fetching orders by date range",
                startDate, endDate);
        List<AdminCustomerOrder> orders = orderService.getOrdersByDateRange(startDate, endDate);
        return ResponseEntity.ok(orders);
    }

    @PostMapping
    public ResponseEntity<AdminCustomerOrder> createOrder(@RequestBody AdminCustomerOrder order) {
        log.info("POST /api/admin/orders - Creating new order");
        try {
            AdminCustomerOrder createdOrder = orderService.createOrder(order);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdOrder);
        } catch (Exception e) {
            log.error("Error creating order: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<AdminCustomerOrder> updateOrder(
            @PathVariable Long id, @RequestBody AdminCustomerOrder order) {
        log.info("PUT /api/admin/orders/{} - Updating order", id);
        try {
            AdminCustomerOrder updatedOrder = orderService.updateOrder(id, order);
            return ResponseEntity.ok(updatedOrder);
        } catch (RuntimeException e) {
            log.error("Error updating order: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        log.info("DELETE /api/admin/orders/{} - Deleting order", id);
        try {
            orderService.deleteOrder(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            log.error("Error deleting order: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<AdminCustomerOrder> updateOrderStatus(
            @PathVariable Long id,
            @RequestParam AdminCustomerOrder.OrderProcessingStatus status) {
        log.info("PATCH /api/admin/orders/{}/status - Updating order status to: {}", id, status);
        try {
            AdminCustomerOrder updatedOrder = orderService.updateOrderStatus(id, status);
            return ResponseEntity.ok(updatedOrder);
        } catch (RuntimeException e) {
            log.error("Error updating order status: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{id}/payment-status")
    public ResponseEntity<AdminCustomerOrder> updatePaymentStatus(
            @PathVariable Long id,
            @RequestParam AdminCustomerOrder.PaymentProcessingStatus paymentStatus) {
        log.info("PATCH /api/admin/orders/{}/payment-status - Updating payment status to: {}", id, paymentStatus);
        try {
            AdminCustomerOrder updatedOrder = orderService.updatePaymentStatus(id, paymentStatus);
            return ResponseEntity.ok(updatedOrder);
        } catch (RuntimeException e) {
            log.error("Error updating payment status: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/tracking")
    public ResponseEntity<AdminCustomerOrder> addTrackingNumber(
            @PathVariable Long id,
            @RequestParam String trackingNumber) {
        log.info("POST /api/admin/orders/{}/tracking - Adding tracking number: {}", id, trackingNumber);
        try {
            AdminCustomerOrder updatedOrder = orderService.addTrackingNumber(id, trackingNumber);
            return ResponseEntity.ok(updatedOrder);
        } catch (RuntimeException e) {
            log.error("Error adding tracking number: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}/line-items")
    public ResponseEntity<List<AdminOrderLineItem>> getOrderLineItems(@PathVariable Long id) {
        log.info("GET /api/admin/orders/{}/line-items - Fetching line items for order", id);
        try {
            List<AdminOrderLineItem> lineItems = orderService.getOrderLineItems(id);
            return ResponseEntity.ok(lineItems);
        } catch (RuntimeException e) {
            log.error("Error fetching line items: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/amount-range")
    public ResponseEntity<List<AdminCustomerOrder>> getOrdersByAmountRange(
            @RequestParam double minAmount,
            @RequestParam double maxAmount) {
        log.info("GET /api/admin/orders/amount-range?minAmount={}&maxAmount={} - Fetching orders by amount range",
                minAmount, maxAmount);
        List<AdminCustomerOrder> orders = orderService.getOrdersByAmountRange(minAmount, maxAmount);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> getOrderAnalytics(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        log.info("GET /api/admin/orders/analytics - Fetching order analytics");

        if (startDate == null) {
            startDate = LocalDateTime.now().minusDays(30);
        }
        if (endDate == null) {
            endDate = LocalDateTime.now();
        }

        Map<String, Object> analytics = new HashMap<>();
        analytics.put("totalRevenue", orderService.calculateRevenue(startDate, endDate));
        analytics.put("totalOrders", orderService.getOrdersCount(startDate));
        analytics.put("averageOrderValue", orderService.getAverageOrderValue());
        analytics.put("dateRange", Map.of("startDate", startDate, "endDate", endDate));

        return ResponseEntity.ok(analytics);
    }
}