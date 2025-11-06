package com.skyeats.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.skyeats.model.InventoryItem;
import com.skyeats.service.FirestoreService;
import com.skyeats.service.InventoryService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CartController.class)
@DisplayName("Cart Controller Tests")
class CartControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private FirestoreService firestoreService;

    @MockBean
    private InventoryService inventoryService;

    private InventoryItem testItem;
    private Map<String, Object> testCart;

    @BeforeEach
    void setUp() {
        testItem = createTestItem("1", "Fresh Apples", "Fruits", new BigDecimal("120.00"), 50);
        testCart = createTestCart();
    }

    @Test
    @WithMockUser(username = "test-user")
    @DisplayName("Should get user cart successfully")
    void shouldGetUserCartSuccessfully() throws Exception {
        // Given
        when(firestoreService.getUserCart("test-user")).thenReturn(testCart);

        // When & Then
        mockMvc.perform(get("/api/cart"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId").value("test-user"))
                .andExpect(jsonPath("$.items").exists());

        verify(firestoreService).getUserCart("test-user");
    }

    @Test
    @DisplayName("Should return unauthorized when not authenticated")
    void shouldReturnUnauthorizedWhenNotAuthenticated() throws Exception {
        // When & Then
        mockMvc.perform(get("/api/cart"))
                .andExpect(status().isUnauthorized());

        verify(firestoreService, never()).getUserCart(anyString());
    }

    @Test
    @WithMockUser(username = "test-user")
    @DisplayName("Should add item to cart successfully")
    void shouldAddItemToCartSuccessfully() throws Exception {
        // Given
        Map<String, Object> request = Map.of(
            "itemId", "1",
            "quantity", 2
        );
        
        when(inventoryService.getItemById("1")).thenReturn(Optional.of(testItem));
        when(inventoryService.isItemInStock("1", 2)).thenReturn(true);
        when(firestoreService.getUserCart("test-user")).thenReturn(new HashMap<>());
        when(inventoryService.reserveStock("1", 2)).thenReturn(true);

        // When & Then
        mockMvc.perform(post("/api/cart/add")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").exists())
                .andExpect(jsonPath("$.totalQuantity").value(2));

        verify(inventoryService).getItemById("1");
        verify(inventoryService).isItemInStock("1", 2);
        verify(inventoryService).reserveStock("1", 2);
        verify(firestoreService).addToCart(eq("test-user"), eq("1"), any());
    }

    @Test
    @WithMockUser(username = "test-user")
    @DisplayName("Should fail to add item when product not found")
    void shouldFailToAddItemWhenProductNotFound() throws Exception {
        // Given
        Map<String, Object> request = Map.of(
            "itemId", "999",
            "quantity", 2
        );
        
        when(inventoryService.getItemById("999")).thenReturn(Optional.empty());

        // When & Then
        mockMvc.perform(post("/api/cart/add")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Product not found"));

        verify(inventoryService).getItemById("999");
        verify(firestoreService, never()).addToCart(anyString(), anyString(), any());
    }

    @Test
    @WithMockUser(username = "test-user")
    @DisplayName("Should fail to add item when out of stock")
    void shouldFailToAddItemWhenOutOfStock() throws Exception {
        // Given
        InventoryItem outOfStockItem = createTestItem("1", "Fresh Apples", "Fruits", new BigDecimal("120.00"), 0);
        Map<String, Object> request = Map.of(
            "itemId", "1",
            "quantity", 2
        );
        
        when(inventoryService.getItemById("1")).thenReturn(Optional.of(outOfStockItem));

        // When & Then
        mockMvc.perform(post("/api/cart/add")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Product is out of stock"));

        verify(inventoryService).getItemById("1");
        verify(firestoreService, never()).addToCart(anyString(), anyString(), any());
    }

    @Test
    @WithMockUser(username = "test-user")
    @DisplayName("Should fail to add item when insufficient stock")
    void shouldFailToAddItemWhenInsufficientStock() throws Exception {
        // Given
        Map<String, Object> request = Map.of(
            "itemId", "1",
            "quantity", 60 // More than available (50)
        );
        
        when(inventoryService.getItemById("1")).thenReturn(Optional.of(testItem));
        when(inventoryService.isItemInStock("1", 60)).thenReturn(false);

        // When & Then
        mockMvc.perform(post("/api/cart/add")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Insufficient stock. Only 50 items available"));

        verify(inventoryService).getItemById("1");
        verify(inventoryService).isItemInStock("1", 60);
        verify(firestoreService, never()).addToCart(anyString(), anyString(), any());
    }

    @Test
    @WithMockUser(username = "test-user")
    @DisplayName("Should update cart item successfully")
    void shouldUpdateCartItemSuccessfully() throws Exception {
        // Given
        Map<String, Object> request = Map.of(
            "itemId", "1",
            "quantity", 3
        );
        
        Map<String, Object> existingCart = createTestCartWithItem("1", 2);
        when(firestoreService.getUserCart("test-user")).thenReturn(existingCart);
        when(inventoryService.getItemById("1")).thenReturn(Optional.of(testItem));
        when(inventoryService.reserveStock("1", 1)).thenReturn(true); // Difference: 3 - 2 = 1

        // When & Then
        mockMvc.perform(put("/api/cart/update")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.quantity").value(3));

        verify(firestoreService).getUserCart("test-user");
        verify(inventoryService).getItemById("1");
        verify(inventoryService).reserveStock("1", 1);
        verify(firestoreService).updateCartItemQuantity("test-user", "1", 3);
    }

    @Test
    @WithMockUser(username = "test-user")
    @DisplayName("Should remove item when quantity is zero")
    void shouldRemoveItemWhenQuantityIsZero() throws Exception {
        // Given
        Map<String, Object> request = Map.of(
            "itemId", "1",
            "quantity", 0
        );
        
        Map<String, Object> existingCart = createTestCartWithItem("1", 2);
        when(firestoreService.getUserCart("test-user")).thenReturn(existingCart);

        // When & Then
        mockMvc.perform(put("/api/cart/update")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().string("Item removed from cart"));

        verify(firestoreService).getUserCart("test-user");
        verify(inventoryService).releaseReservedStock("1", 2);
        verify(firestoreService).removeFromCart("test-user", "1");
    }

    @Test
    @WithMockUser(username = "test-user")
    @DisplayName("Should remove item from cart successfully")
    void shouldRemoveItemFromCartSuccessfully() throws Exception {
        // Given
        Map<String, Object> existingCart = createTestCartWithItem("1", 2);
        when(firestoreService.getUserCart("test-user")).thenReturn(existingCart);

        // When & Then
        mockMvc.perform(delete("/api/cart/remove/1")
                .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(content().string("Item removed from cart successfully"));

        verify(firestoreService).getUserCart("test-user");
        verify(inventoryService).releaseReservedStock("1", 2);
        verify(firestoreService).removeFromCart("test-user", "1");
    }

    @Test
    @WithMockUser(username = "test-user")
    @DisplayName("Should clear cart successfully")
    void shouldClearCartSuccessfully() throws Exception {
        // Given
        Map<String, Object> existingCart = createTestCartWithMultipleItems();
        when(firestoreService.getUserCart("test-user")).thenReturn(existingCart);

        // When & Then
        mockMvc.perform(delete("/api/cart/clear")
                .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(content().string("Cart cleared successfully"));

        verify(firestoreService).getUserCart("test-user");
        verify(inventoryService).releaseReservedStock("1", 2);
        verify(inventoryService).releaseReservedStock("2", 1);
        verify(firestoreService).clearCart("test-user");
    }

    @Test
    @WithMockUser(username = "test-user")
    @DisplayName("Should get cart summary successfully")
    void shouldGetCartSummarySuccessfully() throws Exception {
        // Given
        Map<String, Object> cartWithItems = createTestCartWithMultipleItems();
        when(firestoreService.getUserCart("test-user")).thenReturn(cartWithItems);
        when(inventoryService.isItemInStock("1", 2)).thenReturn(true);
        when(inventoryService.isItemInStock("2", 1)).thenReturn(true);

        // When & Then
        mockMvc.perform(get("/api/cart/summary"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalItems").value(3)) // 2 + 1
                .andExpect(jsonPath("$.totalAmount").value(300.0)) // 240 + 60
                .andExpect(jsonPath("$.allInStock").value(true))
                .andExpect(jsonPath("$.itemCount").value(2));

        verify(firestoreService).getUserCart("test-user");
        verify(inventoryService).isItemInStock("1", 2);
        verify(inventoryService).isItemInStock("2", 1);
    }

    @Test
    @WithMockUser(username = "test-user")
    @DisplayName("Should handle invalid quantity in add request")
    void shouldHandleInvalidQuantityInAddRequest() throws Exception {
        // Given
        Map<String, Object> request = Map.of(
            "itemId", "1",
            "quantity", -1 // Invalid quantity
        );

        // When & Then
        mockMvc.perform(post("/api/cart/add")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Invalid quantity"));

        verify(inventoryService, never()).getItemById(anyString());
    }

    // Helper methods
    private InventoryItem createTestItem(String id, String name, String category, BigDecimal price, Integer stock) {
        InventoryItem item = new InventoryItem();
        item.setId(id);
        item.setName(name);
        item.setCategory(category);
        item.setPrice(price);
        item.setStockQuantity(stock);
        item.setUnit("kg");
        item.setImageUrl("https://example.com/image.jpg");
        item.setDescription("Test description");
        item.setIsActive(true);
        item.setCreatedAt(LocalDateTime.now());
        item.setUpdatedAt(LocalDateTime.now());
        return item;
    }

    private Map<String, Object> createTestCart() {
        Map<String, Object> cart = new HashMap<>();
        cart.put("userId", "test-user");
        cart.put("items", new HashMap<>());
        cart.put("updatedAt", LocalDateTime.now());
        return cart;
    }

    private Map<String, Object> createTestCartWithItem(String itemId, Integer quantity) {
        Map<String, Object> cart = new HashMap<>();
        cart.put("userId", "test-user");
        
        Map<String, Object> items = new HashMap<>();
        Map<String, Object> item = new HashMap<>();
        item.put("itemId", itemId);
        item.put("quantity", quantity);
        item.put("name", "Fresh Apples");
        item.put("price", 120.0);
        item.put("totalPrice", 120.0 * quantity);
        items.put(itemId, item);
        
        cart.put("items", items);
        cart.put("updatedAt", LocalDateTime.now());
        return cart;
    }

    private Map<String, Object> createTestCartWithMultipleItems() {
        Map<String, Object> cart = new HashMap<>();
        cart.put("userId", "test-user");
        
        Map<String, Object> items = new HashMap<>();
        
        // Item 1
        Map<String, Object> item1 = new HashMap<>();
        item1.put("itemId", "1");
        item1.put("quantity", 2);
        item1.put("name", "Fresh Apples");
        item1.put("price", 120.0);
        item1.put("totalPrice", 240.0);
        items.put("1", item1);
        
        // Item 2
        Map<String, Object> item2 = new HashMap<>();
        item2.put("itemId", "2");
        item2.put("quantity", 1);
        item2.put("name", "Fresh Bananas");
        item2.put("price", 60.0);
        item2.put("totalPrice", 60.0);
        items.put("2", item2);
        
        cart.put("items", items);
        cart.put("updatedAt", LocalDateTime.now());
        return cart;
    }
}