package com.carboncalc.controller;

import com.carboncalc.entity.AdminProductCatalog;
import com.carboncalc.entity.MarketplaceItem;
import com.carboncalc.repository.AdminProductCatalogRepository;
import com.carboncalc.repository.MarketplaceItemRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Public read-only catalog endpoints that expose admin products
 * with the linked marketplace item id for user operations.
 */
@RestController
@RequestMapping("/api/catalog")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:5173" })
public class CatalogController {

    private final AdminProductCatalogRepository productRepository;
    private final MarketplaceItemRepository marketplaceItemRepository;

    @GetMapping("/products")
    public ResponseEntity<List<Map<String, Object>>> getActiveProducts() {
        List<AdminProductCatalog> products = productRepository
                .findByCatalogStatus(AdminProductCatalog.ProductCatalogStatus.ACTIVE);

        List<Map<String, Object>> mapped = products.stream().map(p -> {
            Long marketplaceItemId = marketplaceItemRepository
                    .findByAdminCatalogProductId(p.getCatalogProductId())
                    .map(MarketplaceItem::getId)
                    .orElse(null);

            java.util.Map<String, Object> m = new java.util.HashMap<>();
            m.put("id", p.getCatalogProductId());
            m.put("marketplaceItemId", marketplaceItemId);
            m.put("name", p.getProductDisplayName());
            m.put("description", p.getProductDetailedDescription());
            m.put("price", p.getProductSellingPrice());
            m.put("category", p.getProductCategoryType());
            m.put("image", p.getProductImagePath()); // Changed from imageUrl to image
            m.put("stock", p.getAvailableInventoryCount());
            m.put("carbonOffset", p.getCo2EmissionOffset());
            m.put("seller", p.getProductVendorName());
            m.put("featured", p.getFeaturedProductFlag());
            return m;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(mapped);
    }

    @GetMapping("/products/{id}")
    public ResponseEntity<Map<String, Object>> getProduct(@PathVariable Long id) {
        return productRepository.findById(id)
                .map(p -> {
                    Long marketplaceItemId = marketplaceItemRepository
                            .findByAdminCatalogProductId(p.getCatalogProductId())
                            .map(MarketplaceItem::getId)
                            .orElse(null);
                    java.util.Map<String, Object> m = new java.util.HashMap<>();
                    m.put("id", p.getCatalogProductId());
                    m.put("marketplaceItemId", marketplaceItemId);
                    m.put("name", p.getProductDisplayName());
                    m.put("description", p.getProductDetailedDescription());
                    m.put("price", p.getProductSellingPrice());
                    m.put("category", p.getProductCategoryType());
                    m.put("image", p.getProductImagePath()); // Changed from imageUrl to image
                    m.put("stock", p.getAvailableInventoryCount());
                    m.put("carbonOffset", p.getCo2EmissionOffset());
                    m.put("seller", p.getProductVendorName());
                    m.put("featured", p.getFeaturedProductFlag());
                    return m;
                })
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
