package com.skyeats.service;

import com.skyeats.model.InventoryItem;
import com.skyeats.repository.InventoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class InventoryService {

    @Autowired
    private InventoryRepository inventoryRepository;

    public List<InventoryItem> getAllActiveItems() {
        return inventoryRepository.findByIsActiveTrue();
    }

    public List<InventoryItem> getItemsByCategory(String category) {
        if ("all".equalsIgnoreCase(category)) {
            return getAllActiveItems();
        }
        return inventoryRepository.findByCategoryIgnoreCaseAndIsActiveTrue(category);
    }

    public List<String> getAllCategories() {
        return inventoryRepository.findByIsActiveTrue()
                .stream()
                .map(InventoryItem::getCategory)
                .distinct()
                .collect(Collectors.toList());
    }

    public Optional<InventoryItem> getItemById(String id) {
        return inventoryRepository.findById(id);
    }

    public InventoryItem saveItem(InventoryItem item) {
        item.setUpdatedAt(LocalDateTime.now());
        return inventoryRepository.save(item);
    }

    public boolean updateStock(String itemId, Integer newStock) {
        Optional<InventoryItem> itemOpt = inventoryRepository.findById(itemId);
        if (itemOpt.isPresent()) {
            InventoryItem item = itemOpt.get();
            item.setStockQuantity(newStock);
            item.setUpdatedAt(LocalDateTime.now());
            inventoryRepository.save(item);
            return true;
        }
        return false;
    }

    public boolean reduceStock(String itemId, Integer quantity) {
        Optional<InventoryItem> itemOpt = inventoryRepository.findById(itemId);
        if (itemOpt.isPresent()) {
            InventoryItem item = itemOpt.get();
            if (item.getStockQuantity() >= quantity) {
                item.setStockQuantity(item.getStockQuantity() - quantity);
                item.setUpdatedAt(LocalDateTime.now());
                inventoryRepository.save(item);
                return true;
            }
        }
        return false;
    }

    public boolean increaseStock(String itemId, Integer quantity) {
        Optional<InventoryItem> itemOpt = inventoryRepository.findById(itemId);
        if (itemOpt.isPresent()) {
            InventoryItem item = itemOpt.get();
            item.setStockQuantity(item.getStockQuantity() + quantity);
            item.setUpdatedAt(LocalDateTime.now());
            inventoryRepository.save(item);
            return true;
        }
        return false;
    }

    public boolean reserveStock(String itemId, Integer quantity) {
        // For now, we'll use the same logic as reduceStock
        // In a production system, you might want separate reserved stock tracking
        return reduceStock(itemId, quantity);
    }

    public boolean releaseReservedStock(String itemId, Integer quantity) {
        // Release reserved stock back to available stock
        return increaseStock(itemId, quantity);
    }

    public boolean isItemInStock(String itemId, Integer quantity) {
        Optional<InventoryItem> itemOpt = inventoryRepository.findById(itemId);
        return itemOpt.isPresent() && itemOpt.get().getStockQuantity() >= quantity;
    }

    public List<InventoryItem> searchItems(String searchTerm) {
        return inventoryRepository.findByNameContainingIgnoreCaseAndIsActiveTrue(searchTerm);
    }
}