package com.carboncalc.controller;

import com.carboncalc.dto.CartItemDTO;
import com.carboncalc.entity.User;
import com.carboncalc.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:5173" })
public class CartController {

    private final CartService cartService;

    /**
     * Get current user's cart
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getCart(@AuthenticationPrincipal User user) {
        List<CartItemDTO> items = cartService.getCartItems(user);
        Double total = cartService.getCartTotal(user);
        Long count = cartService.getCartCount(user);

        Map<String, Object> response = new HashMap<>();
        response.put("items", items);
        response.put("total", total);
        response.put("count", count);

        return ResponseEntity.ok(response);
    }

    /**
     * Add item to cart
     */
    @PostMapping("/items")
    public ResponseEntity<CartItemDTO> addToCart(
            @AuthenticationPrincipal User user,
            @RequestParam Long marketplaceItemId,
            @RequestParam(defaultValue = "1") Integer quantity) {

        CartItemDTO cartItem = cartService.addToCart(user, marketplaceItemId, quantity);
        return ResponseEntity.ok(cartItem);
    }

    /**
     * Update cart item quantity
     */
    @PutMapping("/items/{id}")
    public ResponseEntity<CartItemDTO> updateCartItem(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @RequestParam Integer quantity) {

        CartItemDTO updated = cartService.updateQuantity(user, id, quantity);
        return ResponseEntity.ok(updated);
    }

    /**
     * Remove item from cart
     */
    @DeleteMapping("/items/{id}")
    public ResponseEntity<Void> removeFromCart(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {

        cartService.removeFromCart(user, id);
        return ResponseEntity.ok().build();
    }

    /**
     * Clear entire cart
     */
    @DeleteMapping
    public ResponseEntity<Void> clearCart(@AuthenticationPrincipal User user) {
        cartService.clearCart(user);
        return ResponseEntity.ok().build();
    }

    /**
     * Get cart count
     */
    @GetMapping("/count")
    public ResponseEntity<Map<String, Long>> getCartCount(@AuthenticationPrincipal User user) {
        Long count = cartService.getCartCount(user);
        Map<String, Long> response = new HashMap<>();
        response.put("count", count);
        return ResponseEntity.ok(response);
    }
}
