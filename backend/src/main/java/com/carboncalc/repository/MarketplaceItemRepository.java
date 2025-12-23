package com.carboncalc.repository;

import com.carboncalc.entity.MarketplaceItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MarketplaceItemRepository extends JpaRepository<MarketplaceItem, Long> {
    List<MarketplaceItem> findByAvailableTrue();
    List<MarketplaceItem> findByCategory(String category);
}
