package com.skyeats.controller;

import com.skyeats.dto.CartItemDto;
import com.skyeats.dto.OrderDto;
import com.skyeats.model.InventoryItem;
import com.skyeats.service.FirestoreService;
import com.skyeats.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private FirestoreService firestoreService;

    @Autowired
    private InventoryService inventoryService;

    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(@RequestBody Map<String, Object> request, Authentication authentication) {
        try {
            String userId = authentication.getName();
            String deliveryAddress = (String) request.get("deliveryAddress");
            String paymentMethod = (String) request.getOrDefault("paymentMethod", "Online Payment");

            // Get user cart
            Map<String, Object> cart = firestoreService.getUserCart(userId);
            @SuppressWarnings("unchecked")
            Map<String, Object> items = (Map<String, Object>) cart.getOrDefault("items", new HashMap<>());

            if (items.isEmpty()) {
                return ResponseEntity.badRequest().body("Cart is empty");
            }

            // Validate stock and prepare order items
            List<CartItemDto> orderItems = new ArrayList<>();
            List<String> outOfStockItems = new ArrayList<>();
            List<String> unavailableItems = new ArrayList<>();
            BigDecimal totalAmount = BigDecimal.ZERO;

            for (Map.Entry<String, Object> entry : items.entrySet()) {
                @SuppressWarnings("unchecked")
                Map<String, Object> itemData = (Map<String, Object>) entry.getValue();
                
                String itemId = (String) itemData.get("itemId");
                Integer quantity = ((Long) itemData.get("quantity")).intValue();
                String itemName = (String) itemData.get("name");
                
                // Get current item details from inventory
                Optional<InventoryItem> itemOpt = inventoryService.getItemById(itemId);
                if (itemOpt.isEmpty()) {
                    unavailableItems.add(itemName + " - Product not found");
                    continue;
                }
                
                InventoryItem currentItem = itemOpt.get();
                
                // Check if item is still active
                if (!currentItem.getIsActive()) {
                    unavailableItems.add(itemName + " - Product no longer available");
                    continue;
                }
                
                // Check stock availability with current inventory
                if (currentItem.getStockQuantity() <= 0) {
                    outOfStockItems.add(itemName + " - Out of stock");
                    continue;
                }
                
                if (!inventoryService.isItemInStock(itemId, quantity)) {
                    outOfStockItems.add(itemName + " - Only " + currentItem.getStockQuantity() + " available, requested " + quantity);
                    continue;
                }

                // Use current price from inventory (in case price changed)
                CartItemDto orderItem = new CartItemDto();
                orderItem.setItemId(itemId);
                orderItem.setName(currentItem.getName());
                orderItem.setCategory(currentItem.getCategory());
                orderItem.setPrice(currentItem.getPrice());
                orderItem.setQuantity(quantity);
                orderItem.setImageUrl(currentItem.getImageUrl());
                orderItem.setUnit(currentItem.getUnit());
                orderItem.setTotalPrice(currentItem.getPrice().multiply(BigDecimal.valueOf(quantity)));
                orderItem.setInStock(true);

                orderItems.add(orderItem);
                totalAmount = totalAmount.add(orderItem.getTotalPrice());
            }

            // If any items are out of stock or unavailable, return error
            if (!outOfStockItems.isEmpty() || !unavailableItems.isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("error", "Some items in your cart are not available");
                
                List<String> allIssues = new ArrayList<>();
                allIssues.addAll(outOfStockItems);
                allIssues.addAll(unavailableItems);
                
                response.put("issues", allIssues);
                response.put("outOfStockItems", outOfStockItems);
                response.put("unavailableItems", unavailableItems);
                
                return ResponseEntity.badRequest().body(response);
            }

            // Create order
            OrderDto order = new OrderDto();
            order.setUserId(userId);
            order.setItems(orderItems);
            order.setTotalAmount(totalAmount);
            order.setStatus("CONFIRMED");
            order.setOrderDate(LocalDateTime.now());
            order.setDeliveryAddress(deliveryAddress);
            order.setPaymentMethod(paymentMethod);
            order.setTrackingId("SKY" + System.currentTimeMillis());

            // Save order to Firestore
            String orderId = firestoreService.createOrder(order);
            order.setOrderId(orderId);

            // Clear user cart without releasing stock (stock stays reduced for the order)
            firestoreService.clearCartWithoutStockRelease(userId);

            // Return success response
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Order placed successfully");
            response.put("orderId", orderId);
            response.put("trackingId", order.getTrackingId());
            response.put("totalAmount", totalAmount);

            return ResponseEntity.ok(response);

        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.internalServerError().body("Error processing checkout: " + e.getMessage());
        }
    }

    @GetMapping("/history")
    public ResponseEntity<?> getOrderHistory(Authentication authentication) {
        try {
            String userId = authentication.getName();
            System.out.println("Fetching order history for user: " + userId);
            
            List<OrderDto> orders = firestoreService.getUserOrders(userId);
            System.out.println("Found " + orders.size() + " orders for user: " + userId);
            
            return ResponseEntity.ok(orders);

        } catch (Exception e) {
            System.err.println("Error fetching order history: " + e.getMessage());
            e.printStackTrace();
            // Return empty list instead of 500 error to allow UI to work
            return ResponseEntity.ok(new ArrayList<>());
        }
    }



    @GetMapping("/{orderId}")
    public ResponseEntity<?> getOrderDetails(@PathVariable String orderId, Authentication authentication) {
        try {
            String userId = authentication.getName();
            Optional<OrderDto> orderOpt = firestoreService.getOrderById(orderId);

            if (orderOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            OrderDto order = orderOpt.get();
            
            // Verify order belongs to user
            if (!order.getUserId().equals(userId)) {
                return ResponseEntity.status(403).body("Access denied");
            }

            return ResponseEntity.ok(order);

        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.internalServerError().body("Error fetching order details: " + e.getMessage());
        }
    }

    @PutMapping("/{orderId}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable String orderId, @RequestBody Map<String, String> request) {
        try {
            String status = request.get("status");
            firestoreService.updateOrderStatus(orderId, status);
            return ResponseEntity.ok("Order status updated successfully");

        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.internalServerError().body("Error updating order status: " + e.getMessage());
        }
    }

    @GetMapping("/track/{trackingId}")
    public ResponseEntity<?> trackOrder(@PathVariable String trackingId, Authentication authentication) {
        try {
            String userId = authentication.getName();
            List<OrderDto> orders = firestoreService.getUserOrders(userId);
            
            Optional<OrderDto> order = orders.stream()
                    .filter(o -> trackingId.equals(o.getTrackingId()))
                    .findFirst();

            if (order.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Map<String, Object> trackingInfo = new HashMap<>();
            trackingInfo.put("trackingId", trackingId);
            trackingInfo.put("status", order.get().getStatus());
            trackingInfo.put("orderDate", order.get().getOrderDate());
            trackingInfo.put("deliveryDate", order.get().getDeliveryDate());
            trackingInfo.put("isDelivered", "DELIVERED".equals(order.get().getStatus()));

            return ResponseEntity.ok(trackingInfo);

        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.internalServerError().body("Error tracking order: " + e.getMessage());
        }
    }
}