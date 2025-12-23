package com.carboncalc.service;

import com.carboncalc.entity.MarketplaceItem;
import com.carboncalc.repository.MarketplaceItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MarketplaceService {

    @Autowired
    private MarketplaceItemRepository marketplaceItemRepository;

    public List<MarketplaceItem> getAllItems() {
        return marketplaceItemRepository.findAll();
    }

    public List<MarketplaceItem> getAvailableItems() {
        return marketplaceItemRepository.findByAvailableTrue();
    }

    public List<MarketplaceItem> getItemsByCategory(String category) {
        return marketplaceItemRepository.findByCategory(category);
    }

    public MarketplaceItem getItemById(Long id) {
        return marketplaceItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found"));
    }

    public MarketplaceItem createItem(MarketplaceItem item) {
        return marketplaceItemRepository.save(item);
    }

    public MarketplaceItem updateItem(Long id, MarketplaceItem itemDetails) {
        MarketplaceItem item = getItemById(id);

        item.setName(itemDetails.getName());
        item.setDescription(itemDetails.getDescription());
        item.setCategory(itemDetails.getCategory());
        item.setPrice(itemDetails.getPrice());
        item.setStock(itemDetails.getStock());
        item.setAvailable(itemDetails.getAvailable());

        return marketplaceItemRepository.save(item);
    }

    public void deleteItem(Long id) {
        marketplaceItemRepository.deleteById(id);
    }

    public void updateStock(Long itemId, Integer quantity) {
        MarketplaceItem item = getItemById(itemId);
        item.setStock(item.getStock() - quantity);
        if (item.getStock() <= 0) {
            item.setAvailable(false);
        }
        marketplaceItemRepository.save(item);
    }
}
