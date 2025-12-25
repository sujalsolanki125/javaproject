package com.carboncalc.controller;

import com.carboncalc.entity.AdminProductCatalog;
import com.carboncalc.service.AdminProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/products")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "http://localhost:5173")
public class AdminProductController {

    private final AdminProductService productService;

    @GetMapping
    public ResponseEntity<List<AdminProductCatalog>> getAllProducts() {
        log.info("GET /api/admin/products - Fetching all products");
        List<AdminProductCatalog> products = productService.getAllProducts();
        return ResponseEntity.ok(products);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AdminProductCatalog> getProductById(@PathVariable Long id) {
        log.info("GET /api/admin/products/{} - Fetching product by ID", id);
        Optional<AdminProductCatalog> product = productService.getProductById(id);
        return product.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/active")
    public ResponseEntity<List<AdminProductCatalog>> getActiveProducts() {
        log.info("GET /api/admin/products/active - Fetching active products");
        List<AdminProductCatalog> products = productService.getActiveProducts();
        return ResponseEntity.ok(products);
    }

    @GetMapping("/category/{categoryType}")
    public ResponseEntity<List<AdminProductCatalog>> getProductsByCategory(@PathVariable String categoryType) {
        log.info("GET /api/admin/products/category/{} - Fetching products by category", categoryType);
        List<AdminProductCatalog> products = productService.getProductsByCategory(categoryType);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/search")
    public ResponseEntity<List<AdminProductCatalog>> searchProducts(@RequestParam String term) {
        log.info("GET /api/admin/products/search?term={} - Searching products", term);
        List<AdminProductCatalog> products = productService.searchProducts(term);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/featured")
    public ResponseEntity<List<AdminProductCatalog>> getFeaturedProducts() {
        log.info("GET /api/admin/products/featured - Fetching featured products");
        List<AdminProductCatalog> products = productService.getFeaturedProducts();
        return ResponseEntity.ok(products);
    }

    @PostMapping
    public ResponseEntity<AdminProductCatalog> createProduct(@RequestBody AdminProductCatalog product) {
        log.info("POST /api/admin/products - Creating new product: {}", product.getProductDisplayName());
        try {
            AdminProductCatalog createdProduct = productService.createProduct(product);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdProduct);
        } catch (Exception e) {
            log.error("Error creating product: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<AdminProductCatalog> updateProduct(
            @PathVariable Long id, @RequestBody AdminProductCatalog product) {
        log.info("PUT /api/admin/products/{} - Updating product", id);
        try {
            AdminProductCatalog updatedProduct = productService.updateProduct(id, product);
            return ResponseEntity.ok(updatedProduct);
        } catch (RuntimeException e) {
            log.error("Error updating product: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        log.info("DELETE /api/admin/products/{} - Deleting product", id);
        try {
            productService.deleteProduct(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            log.error("Error deleting product: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<AdminProductCatalog> updateProductStatus(
            @PathVariable Long id,
            @RequestParam AdminProductCatalog.ProductCatalogStatus status) {
        log.info("PATCH /api/admin/products/{}/status - Updating product status to: {}", id, status);
        try {
            AdminProductCatalog updatedProduct = productService.updateProductStatus(id, status);
            return ResponseEntity.ok(updatedProduct);
        } catch (RuntimeException e) {
            log.error("Error updating product status: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{id}/inventory")
    public ResponseEntity<AdminProductCatalog> updateInventory(
            @PathVariable Long id,
            @RequestParam int inventoryCount) {
        log.info("PATCH /api/admin/products/{}/inventory - Updating inventory to: {}", id, inventoryCount);
        try {
            AdminProductCatalog updatedProduct = productService.updateInventory(id, inventoryCount);
            return ResponseEntity.ok(updatedProduct);
        } catch (RuntimeException e) {
            log.error("Error updating inventory: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/low-stock")
    public ResponseEntity<List<AdminProductCatalog>> getLowStockProducts(
            @RequestParam(defaultValue = "10") int threshold) {
        log.info("GET /api/admin/products/low-stock?threshold={} - Fetching low stock products", threshold);
        List<AdminProductCatalog> products = productService.getLowStockProducts(threshold);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/price-range")
    public ResponseEntity<List<AdminProductCatalog>> getProductsByPriceRange(
            @RequestParam double minPrice,
            @RequestParam double maxPrice) {
        log.info("GET /api/admin/products/price-range?minPrice={}&maxPrice={} - Fetching products by price range",
                minPrice, maxPrice);
        List<AdminProductCatalog> products = productService.getProductsByPriceRange(minPrice, maxPrice);
        return ResponseEntity.ok(products);
    }

    @PostMapping("/sync-marketplace")
    public ResponseEntity<Void> syncMarketplace() {
        log.info("POST /api/admin/products/sync-marketplace - Syncing admin products to marketplace");
        productService.syncAllProductsToMarketplace();
        return ResponseEntity.ok().build();
    }
}