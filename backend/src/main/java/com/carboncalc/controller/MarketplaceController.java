package com.carboncalc.controller;

import com.carboncalc.entity.MarketplaceItem;
import com.carboncalc.service.MarketplaceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/marketplace")
@CrossOrigin(origins = "*")
public class MarketplaceController {

    @Autowired
    private MarketplaceService marketplaceService;

    @GetMapping
    public ResponseEntity<List<MarketplaceItem>> getAllItems() {
        return ResponseEntity.ok(marketplaceService.getAvailableItems());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MarketplaceItem> getItemById(@PathVariable Long id) {
        return ResponseEntity.ok(marketplaceService.getItemById(id));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<MarketplaceItem>> getItemsByCategory(@PathVariable String category) {
        return ResponseEntity.ok(marketplaceService.getItemsByCategory(category));
    }

    @PostMapping
    public ResponseEntity<MarketplaceItem> createItem(@RequestBody MarketplaceItem item) {
        return ResponseEntity.ok(marketplaceService.createItem(item));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MarketplaceItem> updateItem(@PathVariable Long id, @RequestBody MarketplaceItem item) {
        return ResponseEntity.ok(marketplaceService.updateItem(id, item));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteItem(@PathVariable Long id) {
        marketplaceService.deleteItem(id);
        return ResponseEntity.ok().build();
    }
}
