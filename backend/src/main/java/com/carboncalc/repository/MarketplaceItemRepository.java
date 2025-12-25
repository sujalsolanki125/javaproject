package com.carboncalc.repository;

import com.carboncalc.entity.MarketplaceItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MarketplaceItemRepository extends JpaRepository<MarketplaceItem, Long> {
    List<MarketplaceItem> findByIsActiveTrue();

    List<MarketplaceItem> findByCategoryAndIsActiveTrue(String category);

    List<MarketplaceItem> findByPriceBetweenAndIsActiveTrue(Double minPrice, Double maxPrice);

    List<MarketplaceItem> findByCategoryAndPriceBetweenAndIsActiveTrue(
            String category, Double minPrice, Double maxPrice);

    List<MarketplaceItem> findByIsActiveTrueAndAdminCatalogProductIdIsNotNull();

    List<MarketplaceItem> findByCategoryAndIsActiveTrueAndAdminCatalogProductIdIsNotNull(String category);

    Optional<MarketplaceItem> findByAdminCatalogProductId(Long adminCatalogProductId);
}
