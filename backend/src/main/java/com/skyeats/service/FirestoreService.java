package com.skyeats.service;

import com.google.cloud.firestore.*;
import com.skyeats.dto.CartItemDto;
import com.skyeats.dto.OrderDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;
import com.google.cloud.Timestamp;

@Service
public class FirestoreService {

    @Autowired
    private Firestore firestore;

    // Cart Operations
    public Map<String, Object> getUserCart(String userId) throws ExecutionException, InterruptedException {
        DocumentReference cartRef = firestore.collection("carts").document(userId);
        DocumentSnapshot document = cartRef.get().get();
        
        if (document.exists()) {
            return document.getData();
        }
        return new HashMap<>();
    }

    public void addToCart(String userId, String itemId, CartItemDto cartItem) throws ExecutionException, InterruptedException {
        DocumentReference cartRef = firestore.collection("carts").document(userId);
        
        Map<String, Object> cartData = new HashMap<>();
        cartData.put("userId", userId);
        cartData.put("updatedAt", new Date());
        
        // Get existing cart
        DocumentSnapshot document = cartRef.get().get();
        Map<String, Object> existingCart = document.exists() ? document.getData() : new HashMap<>();
        
        @SuppressWarnings("unchecked")
        Map<String, Object> items = (Map<String, Object>) existingCart.getOrDefault("items", new HashMap<>());
        
        // Convert CartItemDto to Map
        Map<String, Object> itemData = new HashMap<>();
        itemData.put("itemId", cartItem.getItemId());
        itemData.put("name", cartItem.getName());
        itemData.put("category", cartItem.getCategory());
        itemData.put("price", cartItem.getPrice().doubleValue());
        itemData.put("quantity", cartItem.getQuantity());
        itemData.put("imageUrl", cartItem.getImageUrl());
        itemData.put("unit", cartItem.getUnit());
        itemData.put("totalPrice", cartItem.getTotalPrice().doubleValue());
        itemData.put("inStock", cartItem.getInStock());
        
        items.put(itemId, itemData);
        cartData.put("items", items);
        
        cartRef.set(cartData, SetOptions.merge());
    }

    public void updateCartItemQuantity(String userId, String itemId, Integer quantity) throws ExecutionException, InterruptedException {
        DocumentReference cartRef = firestore.collection("carts").document(userId);
        DocumentSnapshot document = cartRef.get().get();
        
        if (document.exists()) {
            @SuppressWarnings("unchecked")
            Map<String, Object> cartData = (Map<String, Object>) document.getData();
            @SuppressWarnings("unchecked")
            Map<String, Object> items = (Map<String, Object>) cartData.get("items");
            
            if (items != null && items.containsKey(itemId)) {
                @SuppressWarnings("unchecked")
                Map<String, Object> item = (Map<String, Object>) items.get(itemId);
                item.put("quantity", quantity);
                
                Double price = (Double) item.get("price");
                item.put("totalPrice", price * quantity);
                
                cartData.put("updatedAt", new Date());
                cartRef.set(cartData);
            }
        }
    }

    public void removeFromCart(String userId, String itemId) throws ExecutionException, InterruptedException {
        DocumentReference cartRef = firestore.collection("carts").document(userId);
        DocumentSnapshot document = cartRef.get().get();
        
        if (document.exists()) {
            @SuppressWarnings("unchecked")
            Map<String, Object> cartData = (Map<String, Object>) document.getData();
            @SuppressWarnings("unchecked")
            Map<String, Object> items = (Map<String, Object>) cartData.get("items");
            
            if (items != null) {
                items.remove(itemId);
                cartData.put("updatedAt", new Date());
                cartRef.set(cartData);
            }
        }
    }

    public void clearCart(String userId) throws ExecutionException, InterruptedException {
        DocumentReference cartRef = firestore.collection("carts").document(userId);
        Map<String, Object> cartData = new HashMap<>();
        cartData.put("userId", userId);
        cartData.put("items", new HashMap<>());
        cartData.put("updatedAt", new Date());
        cartRef.set(cartData);
    }

    public void clearCartWithoutStockRelease(String userId) throws ExecutionException, InterruptedException {
        // Same as clearCart but used to indicate stock should not be released
        clearCart(userId);
    }

    // Order Operations
    public String createOrder(OrderDto order) throws ExecutionException, InterruptedException {
        CollectionReference ordersRef = firestore.collection("orders");
        DocumentReference newOrderRef = ordersRef.document();
        
        Map<String, Object> orderData = new HashMap<>();
        orderData.put("orderId", newOrderRef.getId());
        orderData.put("userId", order.getUserId());
        orderData.put("items", convertCartItemsToMap(order.getItems()));
        orderData.put("totalAmount", order.getTotalAmount().doubleValue());
        orderData.put("status", order.getStatus());
        orderData.put("orderDate", Date.from(order.getOrderDate().atZone(ZoneId.systemDefault()).toInstant()));
        orderData.put("deliveryAddress", order.getDeliveryAddress());
        orderData.put("paymentMethod", order.getPaymentMethod());
        orderData.put("trackingId", order.getTrackingId());
        
        newOrderRef.set(orderData);
        return newOrderRef.getId();
    }

    public List<OrderDto> getUserOrders(String userId) throws ExecutionException, InterruptedException {
        System.out.println("Fetching orders for user: " + userId);
        
        try {
            CollectionReference ordersRef = firestore.collection("orders");
            // Use simple query without orderBy to avoid composite index requirement
            Query query = ordersRef.whereEqualTo("userId", userId);
            QuerySnapshot querySnapshot = query.get().get();
            
            List<OrderDto> userOrders = new ArrayList<>();
            for (QueryDocumentSnapshot document : querySnapshot.getDocuments()) {
                try {
                    OrderDto order = convertDocumentToOrder(document);
                    if (order != null) {
                        userOrders.add(order);
                    }
                } catch (Exception e) {
                    System.err.println("Error converting document to order: " + e.getMessage());
                    // Continue processing other orders
                }
            }
            
            // Sort orders by date in memory (most recent first)
            userOrders.sort((o1, o2) -> {
                if (o1.getOrderDate() == null && o2.getOrderDate() == null) return 0;
                if (o1.getOrderDate() == null) return 1;
                if (o2.getOrderDate() == null) return -1;
                return o2.getOrderDate().compareTo(o1.getOrderDate());
            });
            
            System.out.println("Successfully fetched " + userOrders.size() + " orders for user: " + userId);
            return userOrders;
            
        } catch (Exception e) {
            System.err.println("Error fetching orders for user " + userId + ": " + e.getMessage());
            e.printStackTrace();
            // Return empty list instead of throwing exception to prevent 500 error
            return new ArrayList<>();
        }
    }

    public Optional<OrderDto> getOrderById(String orderId) throws ExecutionException, InterruptedException {
        DocumentReference orderRef = firestore.collection("orders").document(orderId);
        DocumentSnapshot document = orderRef.get().get();
        
        if (document.exists()) {
            return Optional.of(convertDocumentToOrder(document));
        }
        return Optional.empty();
    }

    public void updateOrderStatus(String orderId, String status) throws ExecutionException, InterruptedException {
        DocumentReference orderRef = firestore.collection("orders").document(orderId);
        Map<String, Object> updates = new HashMap<>();
        updates.put("status", status);
        updates.put("updatedAt", new Date());
        
        if ("DELIVERED".equals(status)) {
            updates.put("deliveryDate", new Date());
        }
        
        orderRef.update(updates);
    }

    private List<Map<String, Object>> convertCartItemsToMap(List<CartItemDto> items) {
        return items.stream().map(item -> {
            Map<String, Object> itemMap = new HashMap<>();
            itemMap.put("itemId", item.getItemId());
            itemMap.put("name", item.getName());
            itemMap.put("category", item.getCategory());
            itemMap.put("price", item.getPrice().doubleValue());
            itemMap.put("quantity", item.getQuantity());
            itemMap.put("imageUrl", item.getImageUrl());
            itemMap.put("unit", item.getUnit());
            itemMap.put("totalPrice", item.getTotalPrice().doubleValue());
            return itemMap;
        }).collect(Collectors.toList());
    }

    private OrderDto convertDocumentToOrder(DocumentSnapshot document) {
        Map<String, Object> data = document.getData();
        
        if (data == null) {
            return null;
        }
        
        OrderDto order = new OrderDto();
        order.setOrderId(document.getId());
        order.setUserId((String) data.get("userId"));
        
        Object totalAmountObj = data.get("totalAmount");
        if (totalAmountObj != null) {
            order.setTotalAmount(BigDecimal.valueOf((Double) totalAmountObj));
        } else {
            order.setTotalAmount(BigDecimal.ZERO);
        }
        
        order.setStatus((String) data.get("status"));
        order.setDeliveryAddress((String) data.get("deliveryAddress"));
        order.setPaymentMethod((String) data.get("paymentMethod"));
        order.setTrackingId((String) data.get("trackingId"));
        
        // Convert dates
        // Convert dates - handle Firestore Timestamp or java.util.Date
        Object orderDateObj = data.get("orderDate");
        if (orderDateObj != null) {
            if (orderDateObj instanceof Date) {
                order.setOrderDate(LocalDateTime.ofInstant(((Date) orderDateObj).toInstant(), ZoneId.systemDefault()));
            } else if (orderDateObj instanceof Timestamp) {
                Date d = ((Timestamp) orderDateObj).toDate();
                order.setOrderDate(LocalDateTime.ofInstant(d.toInstant(), ZoneId.systemDefault()));
            }
        }

        Object deliveryDateObj = data.get("deliveryDate");
        if (deliveryDateObj != null) {
            if (deliveryDateObj instanceof Date) {
                order.setDeliveryDate(LocalDateTime.ofInstant(((Date) deliveryDateObj).toInstant(), ZoneId.systemDefault()));
            } else if (deliveryDateObj instanceof Timestamp) {
                Date d = ((Timestamp) deliveryDateObj).toDate();
                order.setDeliveryDate(LocalDateTime.ofInstant(d.toInstant(), ZoneId.systemDefault()));
            }
        }
        
        // Convert items
        // Items can be stored either as a List<Map<..>> or as a Map<itemId, Map<..>> depending on how cart/order was constructed.
        Object itemsObj = data.get("items");
        List<CartItemDto> items = new ArrayList<>();

        if (itemsObj instanceof List) {
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> itemsData = (List<Map<String, Object>>) itemsObj;
            for (Map<String, Object> itemData : itemsData) {
                if (itemData == null) continue;
                items.add(convertMapToCartItem(itemData));
            }
        } else if (itemsObj instanceof Map) {
            @SuppressWarnings("unchecked")
            Map<String, Object> itemsMap = (Map<String, Object>) itemsObj;
            for (Object v : itemsMap.values()) {
                if (v instanceof Map) {
                    @SuppressWarnings("unchecked")
                    Map<String, Object> itemData = (Map<String, Object>) v;
                    items.add(convertMapToCartItem(itemData));
                }
            }
        }

        order.setItems(items);
        
        return order;
    }

    private CartItemDto convertMapToCartItem(Map<String, Object> itemData) {
        CartItemDto item = new CartItemDto();
        
        item.setItemId((String) itemData.get("itemId"));
        item.setName((String) itemData.get("name"));
        item.setCategory((String) itemData.get("category"));
        
        Object priceObj = itemData.get("price");
        if (priceObj != null) {
            item.setPrice(BigDecimal.valueOf((Double) priceObj));
        } else {
            item.setPrice(BigDecimal.ZERO);
        }
        
        Object quantityObj = itemData.get("quantity");
        if (quantityObj instanceof Integer) {
            item.setQuantity((Integer) quantityObj);
        } else if (quantityObj instanceof Long) {
            item.setQuantity(((Long) quantityObj).intValue());
        } else {
            item.setQuantity(0);
        }
        
        item.setImageUrl((String) itemData.get("imageUrl"));
        item.setUnit((String) itemData.get("unit"));
        
        Object totalPriceObj = itemData.get("totalPrice");
        if (totalPriceObj != null) {
            item.setTotalPrice(BigDecimal.valueOf((Double) totalPriceObj));
        } else {
            item.setTotalPrice(BigDecimal.ZERO);
        }
        
        Object inStockObj = itemData.get("inStock");
        if (inStockObj instanceof Boolean) {
            item.setInStock((Boolean) inStockObj);
        } else {
            item.setInStock(true); // Default to true
        }
        
        return item;
    }
}