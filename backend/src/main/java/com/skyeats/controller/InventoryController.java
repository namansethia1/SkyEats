package com.skyeats.controller;

import com.skyeats.model.InventoryItem;
import com.skyeats.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/inventory")
@CrossOrigin(origins = "*")
public class InventoryController {

    @Autowired
    private InventoryService inventoryService;

    @GetMapping("/items")
    public ResponseEntity<List<InventoryItem>> getAllItems() {
        List<InventoryItem> items = inventoryService.getAllActiveItems();
        return ResponseEntity.ok(items);
    }

    @GetMapping("/items/category/{category}")
    public ResponseEntity<List<InventoryItem>> getItemsByCategory(@PathVariable String category) {
        List<InventoryItem> items = inventoryService.getItemsByCategory(category);
        return ResponseEntity.ok(items);
    }

    @GetMapping("/categories")
    public ResponseEntity<List<String>> getAllCategories() {
        List<String> categories = inventoryService.getAllCategories();
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/items/{id}")
    public ResponseEntity<InventoryItem> getItemById(@PathVariable String id) {
        Optional<InventoryItem> item = inventoryService.getItemById(id);
        return item.map(ResponseEntity::ok)
                  .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public ResponseEntity<List<InventoryItem>> searchItems(@RequestParam String q) {
        List<InventoryItem> items = inventoryService.searchItems(q);
        return ResponseEntity.ok(items);
    }

    @PostMapping("/items")
    public ResponseEntity<InventoryItem> addItem(@RequestBody InventoryItem item) {
        InventoryItem savedItem = inventoryService.saveItem(item);
        return ResponseEntity.ok(savedItem);
    }

    @PutMapping("/items/{id}/stock")
    public ResponseEntity<String> updateStock(@PathVariable String id, @RequestParam Integer stock) {
        boolean updated = inventoryService.updateStock(id, stock);
        if (updated) {
            return ResponseEntity.ok("Stock updated successfully");
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/items/{id}/stock-check")
    public ResponseEntity<Boolean> checkStock(@PathVariable String id, @RequestParam Integer quantity) {
        boolean inStock = inventoryService.isItemInStock(id, quantity);
        return ResponseEntity.ok(inStock);
    }
}