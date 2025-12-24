package com.carboncalc.repository;

import com.carboncalc.entity.CartItem;
import com.carboncalc.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    List<CartItem> findByUser(User user);

    Optional<CartItem> findByUserAndMarketplaceItemId(User user, Long marketplaceItemId);

    void deleteByUser(User user);

    Long countByUser(User user);
}
