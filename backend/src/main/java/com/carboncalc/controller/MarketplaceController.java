package com.carboncalc.controller;

import com.carboncalc.entity.MarketplaceItem;
import com.carboncalc.service.MarketplaceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/marketplace")
@CrossOrigin(origins = "*")
public class MarketplaceController {

    @Autowired
    private MarketplaceService marketplaceService;

    @GetMapping("/products")
    public ResponseEntity<List<MarketplaceItem>> getAllProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice) {

        if (category != null || minPrice != null || maxPrice != null) {
            // Apply filters
            List<MarketplaceItem> allItems = marketplaceService.getAvailableItems();
            List<MarketplaceItem> filteredItems = allItems.stream()
                    .filter(item -> {
                        if (category == null || category.equals("all")) {
                            return true;
                        }
                        // Frontend sends category ids like 'tree-planting', 'carbon-credits', etc.
                        String cat = category.toLowerCase();
                        if (item.getItemType() != null) {
                            switch (item.getItemType()) {
                                case tree_planting:
                                    return cat.equals("tree-planting") || cat.equals("tree planting");
                                case carbon_credit:
                                    return cat.equals("carbon-credits") || cat.equals("carbon credits");
                                case donation:
                                    return cat.equals("donations") || cat.contains("donation");
                                case eco_product:
                                default:
                                    return cat.equals("eco-products") || cat.contains("eco");
                            }
                        }
                        // Fallback to legacy category string matching
                        return item.getCategory() != null
                                && item.getCategory().equalsIgnoreCase(category);
                    })
                    .filter(item -> minPrice == null || item.getPrice() >= minPrice)
                    .filter(item -> maxPrice == null || item.getPrice() <= maxPrice)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(filteredItems);
        }

        return ResponseEntity.ok(marketplaceService.getAvailableItems());
    }

    @GetMapping("/products/{id}")
    public ResponseEntity<MarketplaceItem> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(marketplaceService.getItemById(id));
    }

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

    @PostMapping("/seed")
    public ResponseEntity<String> seedSampleData() {
        try {
            // Check if data already exists
            List<MarketplaceItem> existing = marketplaceService.getAvailableItems();
            if (!existing.isEmpty()) {
                return ResponseEntity.ok("Sample data already exists. Found " + existing.size() + " items.");
            }

            // Create sample products
            MarketplaceItem item1 = new MarketplaceItem();
            item1.setName("Solar Panel Kit - 200W");
            item1.setDescription("Complete solar panel kit for home energy generation");
            item1.setCategory("Eco Products");
            item1.setPrice(299.99);
            item1.setCarbonOffset("-2kg CO2/month");
            item1.setImageUrl("/images/solar-panel.jpg");
            item1.setStock(50);
            item1.setSeller("EcoTech Solutions");
            item1.setIsActive(true);
            marketplaceService.createItem(item1);

            MarketplaceItem item2 = new MarketplaceItem();
            item2.setName("Tree Planting Offset - 10 Trees");
            item2.setDescription("Plant 10 trees to offset your carbon footprint");
            item2.setCategory("Tree Planting");
            item2.setPrice(25.00);
            item2.setCarbonOffset("-220kg CO2");
            item2.setImageUrl("/images/tree-planting.jpg");
            item2.setStock(100);
            item2.setSeller("Green Future Initiative");
            item2.setIsActive(true);
            marketplaceService.createItem(item2);

            MarketplaceItem item3 = new MarketplaceItem();
            item3.setName("Carbon Credits - 1 Tonne");
            item3.setDescription("Verified carbon credits from renewable energy projects");
            item3.setCategory("Carbon Credits");
            item3.setPrice(15.00);
            item3.setCarbonOffset("-1000kg CO2");
            item3.setImageUrl("/images/carbon-credits.jpg");
            item3.setStock(500);
            item3.setSeller("Global Carbon Exchange");
            item3.setIsActive(true);
            marketplaceService.createItem(item3);

            MarketplaceItem item4 = new MarketplaceItem();
            item4.setName("Reusable Water Bottle - Bamboo");
            item4.setDescription("Eco-friendly bamboo water bottle");
            item4.setCategory("Eco Products");
            item4.setPrice(19.99);
            item4.setCarbonOffset("-0.5kg CO2/year");
            item4.setImageUrl("/images/bamboo-bottle.jpg");
            item4.setStock(75);
            item4.setSeller("Sustainable Living Co");
            item4.setIsActive(true);
            marketplaceService.createItem(item4);

            MarketplaceItem item5 = new MarketplaceItem();
            item5.setName("LED Smart Bulb Pack - 6 Units");
            item5.setDescription("Energy-efficient smart LED bulbs");
            item5.setCategory("Eco Products");
            item5.setPrice(59.99);
            item5.setCarbonOffset("-15kg CO2/year");
            item5.setImageUrl("/images/led-bulbs.jpg");
            item5.setStock(30);
            item5.setSeller("Smart Home Solutions");
            item5.setIsActive(true);
            marketplaceService.createItem(item5);

            return ResponseEntity.ok("Sample data seeded successfully! Created 5 marketplace items.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error seeding data: " + e.getMessage());
        }
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
