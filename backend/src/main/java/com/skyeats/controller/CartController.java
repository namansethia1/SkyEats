package com.skyeats.controller;

import com.skyeats.dto.CartItemDto;
import com.skyeats.model.InventoryItem;
import com.skyeats.service.FirestoreService;
import com.skyeats.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.*;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
public class CartController {

    @Autowired
    private FirestoreService firestoreService;

    @Autowired
    private InventoryService inventoryService;

    @GetMapping
    public ResponseEntity<?> getCart(Authentication authentication) {
        try {
            String userId = authentication.getName();
            Map<String, Object> cart = firestoreService.getUserCart(userId);
            
            // Validate stock for all items in cart
            @SuppressWarnings("unchecked")
            Map<String, Object> items = (Map<String, Object>) cart.getOrDefault("items", new HashMap<>());
            
            for (Map.Entry<String, Object> entry : items.entrySet()) {
                try {
                    @SuppressWarnings("unchecked")
                    Map<String, Object> item = (Map<String, Object>) entry.getValue();
                    String itemId = (String) item.get("itemId");
                    
                    // Handle quantity conversion safely
                    Integer quantity = 0;
                    Object quantityObj = item.get("quantity");
                    if (quantityObj instanceof Integer) {
                        quantity = (Integer) quantityObj;
                    } else if (quantityObj instanceof Long) {
                        quantity = ((Long) quantityObj).intValue();
                    } else if (quantityObj instanceof Double) {
                        quantity = ((Double) quantityObj).intValue();
                    }
                    
                    boolean inStock = inventoryService.isItemInStock(itemId, quantity);
                    item.put("inStock", inStock);
                } catch (Exception e) {
                    System.err.println("Error processing cart item: " + e.getMessage());
                    // Continue processing other items
                }
            }
            
            return ResponseEntity.ok(cart);
        } catch (ExecutionException | InterruptedException e) {
            System.err.println("Error fetching cart: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error fetching cart: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("Unexpected error fetching cart: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Unexpected error fetching cart: " + e.getMessage());
        }
    }

    @PostMapping("/add")
    public ResponseEntity<?> addToCart(@RequestBody Map<String, Object> request, Authentication authentication) {
        try {
            String userId = authentication.getName();
            String itemId = (String) request.get("itemId");
            Integer quantity = (Integer) request.get("quantity");

            if (quantity == null || quantity <= 0) {
                return ResponseEntity.badRequest().body("Invalid quantity");
            }

            // Get item details from inventory
            Optional<InventoryItem> itemOpt = inventoryService.getItemById(itemId);
            if (itemOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Product not found");
            }

            InventoryItem item = itemOpt.get();
            
            // Check if item is active
            if (!item.getIsActive()) {
                return ResponseEntity.badRequest().body("Product is not available");
            }
            
            // Check stock availability
            if (item.getStockQuantity() <= 0) {
                return ResponseEntity.badRequest().body("Product is out of stock");
            }
            
            if (!inventoryService.isItemInStock(itemId, quantity)) {
                return ResponseEntity.badRequest().body("Insufficient stock. Only " + item.getStockQuantity() + " items available");
            }

            // Get current cart to check existing quantity
            Map<String, Object> currentCart = firestoreService.getUserCart(userId);
            @SuppressWarnings("unchecked")
            Map<String, Object> items = (Map<String, Object>) currentCart.getOrDefault("items", new HashMap<>());
            
            int existingQuantity = 0;
            if (items.containsKey(itemId)) {
                @SuppressWarnings("unchecked")
                Map<String, Object> existingItem = (Map<String, Object>) items.get(itemId);
                Object quantityObj = existingItem.get("quantity");
                if (quantityObj instanceof Integer) {
                    existingQuantity = (Integer) quantityObj;
                } else if (quantityObj instanceof Long) {
                    existingQuantity = ((Long) quantityObj).intValue();
                } else if (quantityObj instanceof Double) {
                    existingQuantity = ((Double) quantityObj).intValue();
                }
            }
            
            int totalQuantity = existingQuantity + quantity;
            
            // Check total quantity against stock
            if (!inventoryService.isItemInStock(itemId, totalQuantity)) {
                return ResponseEntity.badRequest().body("Cannot add " + quantity + " items. Only " + 
                    (item.getStockQuantity() - existingQuantity) + " more items can be added");
            }

            // Reserve the additional stock
            if (!inventoryService.reserveStock(itemId, quantity)) {
                return ResponseEntity.badRequest().body("Failed to reserve stock for the item");
            }

            // Create cart item
            CartItemDto cartItem = new CartItemDto(
                itemId,
                item.getName(),
                item.getCategory(),
                item.getPrice(),
                totalQuantity,
                item.getImageUrl(),
                item.getUnit(),
                true
            );

            firestoreService.addToCart(userId, itemId, cartItem);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Item added to cart successfully");
            response.put("totalQuantity", totalQuantity);
            
            return ResponseEntity.ok(response);

        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.internalServerError().body("Error adding to cart: " + e.getMessage());
        }
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateCartItem(@RequestBody Map<String, Object> request, Authentication authentication) {
        try {
            String userId = authentication.getName();
            String itemId = (String) request.get("itemId");
            Integer quantity = (Integer) request.get("quantity");

            if (quantity == null || quantity < 0) {
                return ResponseEntity.badRequest().body("Invalid quantity");
            }

            // Get current cart to check existing quantity
            Map<String, Object> currentCart = firestoreService.getUserCart(userId);
            @SuppressWarnings("unchecked")
            Map<String, Object> items = (Map<String, Object>) currentCart.getOrDefault("items", new HashMap<>());
            
            int currentQuantity = 0;
            if (items.containsKey(itemId)) {
                @SuppressWarnings("unchecked")
                Map<String, Object> existingItem = (Map<String, Object>) items.get(itemId);
                Object quantityObj = existingItem.get("quantity");
                if (quantityObj instanceof Integer) {
                    currentQuantity = (Integer) quantityObj;
                } else if (quantityObj instanceof Long) {
                    currentQuantity = ((Long) quantityObj).intValue();
                } else if (quantityObj instanceof Double) {
                    currentQuantity = ((Double) quantityObj).intValue();
                }
            }

            if (quantity == 0) {
                // Release all reserved stock for this item
                if (currentQuantity > 0) {
                    inventoryService.releaseReservedStock(itemId, currentQuantity);
                }
                firestoreService.removeFromCart(userId, itemId);
                return ResponseEntity.ok("Item removed from cart");
            }

            // Get item details from inventory
            Optional<InventoryItem> itemOpt = inventoryService.getItemById(itemId);
            if (itemOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Product not found");
            }

            InventoryItem item = itemOpt.get();
            
            // Check if item is active and available
            if (!item.getIsActive()) {
                return ResponseEntity.badRequest().body("Product is not available");
            }

            // Calculate the difference in quantity
            int quantityDifference = quantity - currentQuantity;
            
            if (quantityDifference > 0) {
                // Need to reserve more stock
                if (!inventoryService.isItemInStock(itemId, quantityDifference)) {
                    return ResponseEntity.badRequest().body("Insufficient stock. Only " + item.getStockQuantity() + " items available");
                }
                
                if (!inventoryService.reserveStock(itemId, quantityDifference)) {
                    return ResponseEntity.badRequest().body("Failed to reserve additional stock");
                }
            } else if (quantityDifference < 0) {
                // Need to release some reserved stock
                inventoryService.releaseReservedStock(itemId, Math.abs(quantityDifference));
            }

            firestoreService.updateCartItemQuantity(userId, itemId, quantity);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Cart updated successfully");
            response.put("quantity", quantity);
            
            return ResponseEntity.ok(response);

        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.internalServerError().body("Error updating cart: " + e.getMessage());
        }
    }

    @DeleteMapping("/remove/{itemId}")
    public ResponseEntity<?> removeFromCart(@PathVariable String itemId, Authentication authentication) {
        try {
            String userId = authentication.getName();
            
            // Get current cart to check existing quantity
            Map<String, Object> currentCart = firestoreService.getUserCart(userId);
            @SuppressWarnings("unchecked")
            Map<String, Object> items = (Map<String, Object>) currentCart.getOrDefault("items", new HashMap<>());
            
            if (items.containsKey(itemId)) {
                @SuppressWarnings("unchecked")
                Map<String, Object> existingItem = (Map<String, Object>) items.get(itemId);
                
                int currentQuantity = 0;
                Object quantityObj = existingItem.get("quantity");
                if (quantityObj instanceof Integer) {
                    currentQuantity = (Integer) quantityObj;
                } else if (quantityObj instanceof Long) {
                    currentQuantity = ((Long) quantityObj).intValue();
                } else if (quantityObj instanceof Double) {
                    currentQuantity = ((Double) quantityObj).intValue();
                }
                
                // Release reserved stock
                if (currentQuantity > 0) {
                    inventoryService.releaseReservedStock(itemId, currentQuantity);
                }
            }
            
            firestoreService.removeFromCart(userId, itemId);
            return ResponseEntity.ok("Item removed from cart successfully");

        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.internalServerError().body("Error removing from cart: " + e.getMessage());
        }
    }

    @DeleteMapping("/clear")
    public ResponseEntity<?> clearCart(Authentication authentication) {
        try {
            String userId = authentication.getName();
            
            // Get current cart to release all reserved stock
            Map<String, Object> currentCart = firestoreService.getUserCart(userId);
            @SuppressWarnings("unchecked")
            Map<String, Object> items = (Map<String, Object>) currentCart.getOrDefault("items", new HashMap<>());
            
            // Release reserved stock for all items
            for (Map.Entry<String, Object> entry : items.entrySet()) {
                try {
                    String itemId = entry.getKey();
                    @SuppressWarnings("unchecked")
                    Map<String, Object> itemData = (Map<String, Object>) entry.getValue();
                    
                    int quantity = 0;
                    Object quantityObj = itemData.get("quantity");
                    if (quantityObj instanceof Integer) {
                        quantity = (Integer) quantityObj;
                    } else if (quantityObj instanceof Long) {
                        quantity = ((Long) quantityObj).intValue();
                    } else if (quantityObj instanceof Double) {
                        quantity = ((Double) quantityObj).intValue();
                    }
                    
                    if (quantity > 0) {
                        inventoryService.releaseReservedStock(itemId, quantity);
                    }
                } catch (Exception e) {
                    System.err.println("Error releasing stock for item: " + e.getMessage());
                    // Continue processing other items
                }
            }
            
            firestoreService.clearCart(userId);
            return ResponseEntity.ok("Cart cleared successfully");

        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.internalServerError().body("Error clearing cart: " + e.getMessage());
        }
    }

    @GetMapping("/summary")
    public ResponseEntity<?> getCartSummary(Authentication authentication) {
        try {
            String userId = authentication.getName();
            Map<String, Object> cart = firestoreService.getUserCart(userId);
            
            @SuppressWarnings("unchecked")
            Map<String, Object> items = (Map<String, Object>) cart.getOrDefault("items", new HashMap<>());
            
            int totalItems = 0;
            double totalAmount = 0.0;
            boolean allInStock = true;
            
            for (Map.Entry<String, Object> entry : items.entrySet()) {
                try {
                    @SuppressWarnings("unchecked")
                    Map<String, Object> item = (Map<String, Object>) entry.getValue();
                    
                    // Handle quantity conversion safely
                    Integer quantity = 0;
                    Object quantityObj = item.get("quantity");
                    if (quantityObj instanceof Integer) {
                        quantity = (Integer) quantityObj;
                    } else if (quantityObj instanceof Long) {
                        quantity = ((Long) quantityObj).intValue();
                    } else if (quantityObj instanceof Double) {
                        quantity = ((Double) quantityObj).intValue();
                    }
                    
                    // Handle totalPrice conversion safely
                    Double totalPrice = 0.0;
                    Object totalPriceObj = item.get("totalPrice");
                    if (totalPriceObj instanceof Double) {
                        totalPrice = (Double) totalPriceObj;
                    } else if (totalPriceObj instanceof Integer) {
                        totalPrice = ((Integer) totalPriceObj).doubleValue();
                    } else if (totalPriceObj instanceof Long) {
                        totalPrice = ((Long) totalPriceObj).doubleValue();
                    }
                    
                    String itemId = (String) item.get("itemId");
                    
                    totalItems += quantity;
                    totalAmount += totalPrice;
                    
                    if (!inventoryService.isItemInStock(itemId, quantity)) {
                        allInStock = false;
                    }
                } catch (Exception e) {
                    System.err.println("Error processing cart summary item: " + e.getMessage());
                    // Continue processing other items
                }
            }
            
            Map<String, Object> summary = new HashMap<>();
            summary.put("totalItems", totalItems);
            summary.put("totalAmount", totalAmount);
            summary.put("allInStock", allInStock);
            summary.put("itemCount", items.size());
            
            return ResponseEntity.ok(summary);

        } catch (ExecutionException | InterruptedException e) {
            System.err.println("Error getting cart summary: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error getting cart summary: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("Unexpected error getting cart summary: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Unexpected error getting cart summary: " + e.getMessage());
        }
    }
}