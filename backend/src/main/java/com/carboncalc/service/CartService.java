package com.carboncalc.service;

import com.carboncalc.dto.CartItemDTO;
import com.carboncalc.entity.CartItem;
import com.carboncalc.entity.MarketplaceItem;
import com.carboncalc.entity.User;
import com.carboncalc.repository.CartItemRepository;
import com.carboncalc.repository.MarketplaceItemRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final MarketplaceItemRepository marketplaceItemRepository;

    /**
     * Get all cart items for user
     */
    public List<CartItemDTO> getCartItems(User user) {
        return cartItemRepository.findByUser(user)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Add item to cart
     */
    @Transactional
    public CartItemDTO addToCart(User user, Long marketplaceItemId, Integer quantity) {
        MarketplaceItem item = marketplaceItemRepository.findById(marketplaceItemId)
                .orElseThrow(() -> new RuntimeException("Marketplace item not found"));

        // Check if item already in cart
        CartItem cartItem = cartItemRepository.findByUserAndMarketplaceItemId(user, marketplaceItemId)
                .orElse(null);

        if (cartItem != null) {
            // Update quantity
            cartItem.setQuantity(cartItem.getQuantity() + quantity);
        } else {
            // Create new cart item
            cartItem = new CartItem();
            cartItem.setUser(user);
            cartItem.setMarketplaceItem(item);
            cartItem.setQuantity(quantity);
        }

        CartItem saved = cartItemRepository.save(cartItem);
        log.info("Added {} x {} to cart for user {}", quantity, item.getName(), user.getUsername());
        return convertToDTO(saved);
    }

    /**
     * Update cart item quantity
     */
    @Transactional
    public CartItemDTO updateQuantity(User user, Long cartItemId, Integer quantity) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        if (!cartItem.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access to cart item");
        }

        if (quantity <= 0) {
            cartItemRepository.delete(cartItem);
            log.info("Removed cart item {} for user {}", cartItemId, user.getUsername());
            return null;
        }

        cartItem.setQuantity(quantity);
        CartItem updated = cartItemRepository.save(cartItem);
        log.info("Updated cart item {} quantity to {}", cartItemId, quantity);
        return convertToDTO(updated);
    }

    /**
     * Remove item from cart
     */
    @Transactional
    public void removeFromCart(User user, Long cartItemId) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        if (!cartItem.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access to cart item");
        }

        cartItemRepository.delete(cartItem);
        log.info("Removed cart item {} for user {}", cartItemId, user.getUsername());
    }

    /**
     * Clear entire cart
     */
    @Transactional
    public void clearCart(User user) {
        cartItemRepository.deleteByUser(user);
        log.info("Cleared cart for user {}", user.getUsername());
    }

    /**
     * Get cart item count
     */
    public Long getCartCount(User user) {
        return cartItemRepository.countByUser(user);
    }

    /**
     * Get cart total price
     */
    public Double getCartTotal(User user) {
        return cartItemRepository.findByUser(user)
                .stream()
                .mapToDouble(CartItem::getTotalPrice)
                .sum();
    }

    /**
     * Convert entity to DTO
     */
    private CartItemDTO convertToDTO(CartItem cartItem) {
        MarketplaceItem item = cartItem.getMarketplaceItem();
        return new CartItemDTO(
                cartItem.getId(),
                item.getId(),
                item.getName(),
                item.getDescription(),
                item.getPrice(),
                item.getCarbonOffset(),
                item.getImageUrl(),
                cartItem.getQuantity(),
                cartItem.getTotalPrice());
    }
}
