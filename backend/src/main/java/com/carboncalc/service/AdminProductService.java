package com.carboncalc.service;

import com.carboncalc.entity.AdminProductCatalog;
import com.carboncalc.entity.MarketplaceItem;
import com.carboncalc.repository.AdminProductCatalogRepository;
import com.carboncalc.repository.MarketplaceItemRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.annotation.PostConstruct;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AdminProductService {

    private final AdminProductCatalogRepository productRepository;
    private final MarketplaceItemRepository marketplaceItemRepository;

    /**
     * Ensure marketplace_items is backfilled from admin catalog on startup.
     */
    @PostConstruct
    public void ensureMarketplaceSyncedOnStartup() {
        try {
            log.info("Syncing admin catalog to marketplace_items on startup");
            syncAllProductsToMarketplace();
        } catch (Exception ex) {
            log.error("Failed to sync admin catalog to marketplace on startup", ex);
        }
    }

    public List<AdminProductCatalog> getAllProducts() {
        log.info("Fetching all products from admin catalog");
        return productRepository.findAllOrderByCreatedDesc();
    }

    public Optional<AdminProductCatalog> getProductById(Long catalogProductId) {
        log.info("Fetching product with ID: {}", catalogProductId);
        return productRepository.findById(catalogProductId);
    }

    public List<AdminProductCatalog> getActiveProducts() {
        log.info("Fetching active products");
        return productRepository.findByCatalogStatus(AdminProductCatalog.ProductCatalogStatus.ACTIVE);
    }

    public List<AdminProductCatalog> getProductsByCategory(String categoryType) {
        log.info("Fetching products by category: {}", categoryType);
        return productRepository.findByProductCategoryType(categoryType);
    }

    public List<AdminProductCatalog> searchProducts(String searchTerm) {
        log.info("Searching products with term: {}", searchTerm);
        return productRepository.searchByNameOrDescription(searchTerm);
    }

    public List<AdminProductCatalog> getFeaturedProducts() {
        log.info("Fetching featured products");
        return productRepository.findByFeaturedProductFlag(true);
    }

    public AdminProductCatalog createProduct(AdminProductCatalog product) {
        log.info("Creating new product: {}", product.getProductDisplayName());

        if (product.getCatalogCreatedTimestamp() == null) {
            product.setCatalogCreatedTimestamp(LocalDateTime.now());
        }
        product.setCatalogUpdatedTimestamp(LocalDateTime.now());

        AdminProductCatalog saved = productRepository.save(product);
        syncMarketplaceItem(saved);
        return saved;
    }

    public AdminProductCatalog updateProduct(Long catalogProductId, AdminProductCatalog updatedProduct) {
        log.info("Updating product with ID: {}", catalogProductId);

        return productRepository.findById(catalogProductId)
                .map(existingProduct -> {
                    existingProduct.setProductDisplayName(updatedProduct.getProductDisplayName());
                    existingProduct.setProductDetailedDescription(updatedProduct.getProductDetailedDescription());
                    existingProduct.setProductSellingPrice(updatedProduct.getProductSellingPrice());
                    existingProduct.setProductCategoryType(updatedProduct.getProductCategoryType());
                    existingProduct.setProductImagePath(updatedProduct.getProductImagePath());
                    existingProduct.setAvailableInventoryCount(updatedProduct.getAvailableInventoryCount());
                    existingProduct.setFeaturedProductFlag(updatedProduct.getFeaturedProductFlag());
                    existingProduct.setCatalogStatus(updatedProduct.getCatalogStatus());
                    existingProduct.setCatalogUpdatedTimestamp(LocalDateTime.now());

                    AdminProductCatalog saved = productRepository.save(existingProduct);
                    syncMarketplaceItem(saved);
                    return saved;
                })
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + catalogProductId));
    }

    public void deleteProduct(Long catalogProductId) {
        log.info("Deleting product with ID: {}", catalogProductId);

        if (!productRepository.existsById(catalogProductId)) {
            log.error("Product not found with ID: {}", catalogProductId);
            throw new RuntimeException("Product not found with ID: " + catalogProductId);
        }

        // First, remove linked marketplace item if it exists (to avoid foreign key
        // constraint)
        marketplaceItemRepository.findByAdminCatalogProductId(catalogProductId)
                .ifPresent(item -> {
                    log.info("Deleting linked marketplace item with ID: {}", item.getId());
                    marketplaceItemRepository.delete(item);
                });

        // Then delete the product from catalog
        productRepository.deleteById(catalogProductId);
        log.info("Successfully deleted product with ID: {}", catalogProductId);
    }

    public AdminProductCatalog updateProductStatus(Long catalogProductId,
            AdminProductCatalog.ProductCatalogStatus status) {
        log.info("Updating product status for ID {} to: {}", catalogProductId, status);

        return productRepository.findById(catalogProductId)
                .map(product -> {
                    product.setCatalogStatus(status);
                    product.setCatalogUpdatedTimestamp(LocalDateTime.now());
                    AdminProductCatalog saved = productRepository.save(product);
                    syncMarketplaceItem(saved);
                    return saved;
                })
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + catalogProductId));
    }

    public List<AdminProductCatalog> getLowStockProducts(int threshold) {
        log.info("Fetching products with low stock (threshold: {})", threshold);
        return productRepository.findByAvailableInventoryCountLessThanEqual(threshold);
    }

    public List<AdminProductCatalog> getProductsByPriceRange(double minPrice, double maxPrice) {
        log.info("Fetching products in price range: {} - {}", minPrice, maxPrice);
        return productRepository.findByPriceRange(minPrice, maxPrice);
    }

    public AdminProductCatalog updateInventory(Long catalogProductId, int newInventoryCount) {
        log.info("Updating inventory for product ID {} to: {}", catalogProductId, newInventoryCount);

        return productRepository.findById(catalogProductId)
                .map(product -> {
                    product.setAvailableInventoryCount(newInventoryCount);
                    product.setCatalogUpdatedTimestamp(LocalDateTime.now());
                    AdminProductCatalog saved = productRepository.save(product);
                    syncMarketplaceItem(saved);
                    return saved;
                })
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + catalogProductId));
    }

    /**
     * Backfill/synchronize all existing admin catalog products into
     * marketplace_items.
     */
    public void syncAllProductsToMarketplace() {
        log.info("Synchronizing all admin products to marketplace_items");
        productRepository.findAll().forEach(this::syncMarketplaceItem);
    }

    /**
     * Ensure there is a MarketplaceItem row that mirrors this admin catalog product
     * so the user marketplace shows the same products.
     */
    private void syncMarketplaceItem(AdminProductCatalog product) {
        MarketplaceItem item = marketplaceItemRepository
                .findByAdminCatalogProductId(product.getCatalogProductId())
                .orElseGet(MarketplaceItem::new);

        item.setAdminCatalogProductId(product.getCatalogProductId());
        item.setName(product.getProductDisplayName());
        item.setDescription(product.getProductDetailedDescription());
        item.setCategory(product.getProductCategoryType());
        item.setPrice(product.getProductSellingPrice());
        item.setCarbonOffset(product.getCo2EmissionOffset());
        item.setImageUrl(product.getProductImagePath());
        item.setStock(product.getAvailableInventoryCount());
        item.setSeller(product.getProductVendorName());
        // Map admin product category to marketplace item type
        String categoryType = product.getProductCategoryType();
        MarketplaceItem.ItemType itemType;
        if (categoryType == null) {
            itemType = MarketplaceItem.ItemType.eco_product;
        } else if (categoryType.equalsIgnoreCase("tree-planting")
                || categoryType.equalsIgnoreCase("tree planting")) {
            itemType = MarketplaceItem.ItemType.tree_planting;
        } else if (categoryType.equalsIgnoreCase("carbon-credits")
                || categoryType.equalsIgnoreCase("carbon credits")) {
            itemType = MarketplaceItem.ItemType.carbon_credit;
        } else if (categoryType.toLowerCase().contains("donation")) {
            itemType = MarketplaceItem.ItemType.donation;
        } else {
            itemType = MarketplaceItem.ItemType.eco_product;
        }
        item.setItemType(itemType);
        // Active if catalog is ACTIVE and there is stock
        boolean active = product.getCatalogStatus() == AdminProductCatalog.ProductCatalogStatus.ACTIVE
                && (product.getAvailableInventoryCount() == null
                        || product.getAvailableInventoryCount() > 0);
        item.setIsActive(active);

        marketplaceItemRepository.save(item);
    }
}