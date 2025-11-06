package com.skyeats.service;

import com.skyeats.model.InventoryItem;
import com.skyeats.repository.InventoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Inventory Service Tests")
class InventoryServiceTest {

    @Mock
    private InventoryRepository inventoryRepository;



    @InjectMocks
    private InventoryService inventoryService;

    private InventoryItem testItem;
    private List<InventoryItem> testItems;

    @BeforeEach
    void setUp() {
        testItem = createTestItem("1", "Fresh Apples", "Fruits", new BigDecimal("120.00"), 50);
        
        InventoryItem item2 = createTestItem("2", "Fresh Bananas", "Fruits", new BigDecimal("60.00"), 30);
        InventoryItem item3 = createTestItem("3", "Whole Milk", "Dairy", new BigDecimal("55.00"), 25);
        
        testItems = Arrays.asList(testItem, item2, item3);
    }

    @Test
    @DisplayName("Should return all active items")
    void shouldReturnAllActiveItems() {
        // Given
        when(inventoryRepository.findByIsActiveTrue()).thenReturn(testItems);

        // When
        List<InventoryItem> result = inventoryService.getAllActiveItems();

        // Then
        assertThat(result).hasSize(3);
        assertThat(result.get(0).getImageUrl()).isEqualTo("https://example.com/original-image.jpg");
        
        verify(inventoryRepository).findByIsActiveTrue();
    }

    @Test
    @DisplayName("Should return items by category")
    void shouldReturnItemsByCategory() {
        // Given
        List<InventoryItem> fruitsItems = Arrays.asList(testItem, testItems.get(1));
        when(inventoryRepository.findByCategoryIgnoreCaseAndIsActiveTrue("Fruits"))
            .thenReturn(fruitsItems);

        // When
        List<InventoryItem> result = inventoryService.getItemsByCategory("Fruits");

        // Then
        assertThat(result).hasSize(2);
        assertThat(result).allMatch(item -> "Fruits".equals(item.getCategory()));
        assertThat(result.get(0).getImageUrl()).isEqualTo("https://example.com/original-image.jpg");
        
        verify(inventoryRepository).findByCategoryIgnoreCaseAndIsActiveTrue("Fruits");
    }

    @Test
    @DisplayName("Should return all items when category is 'all'")
    void shouldReturnAllItemsWhenCategoryIsAll() {
        // Given
        when(inventoryRepository.findByIsActiveTrue()).thenReturn(testItems);

        // When
        List<InventoryItem> result = inventoryService.getItemsByCategory("all");

        // Then
        assertThat(result).hasSize(3);
        verify(inventoryRepository).findByIsActiveTrue();
    }

    @Test
    @DisplayName("Should return item by ID")
    void shouldReturnItemById() {
        // Given
        when(inventoryRepository.findById("1")).thenReturn(Optional.of(testItem));

        // When
        Optional<InventoryItem> result = inventoryService.getItemById("1");

        // Then
        assertThat(result).isPresent();
        assertThat(result.get().getName()).isEqualTo("Fresh Apples");
        assertThat(result.get().getImageUrl()).isEqualTo("https://example.com/original-image.jpg");
        
        verify(inventoryRepository).findById("1");
    }

    @Test
    @DisplayName("Should return empty when item not found")
    void shouldReturnEmptyWhenItemNotFound() {
        // Given
        when(inventoryRepository.findById("999")).thenReturn(Optional.empty());

        // When
        Optional<InventoryItem> result = inventoryService.getItemById("999");

        // Then
        assertThat(result).isEmpty();
        verify(inventoryRepository).findById("999");
    }

    @Test
    @DisplayName("Should update stock successfully")
    void shouldUpdateStockSuccessfully() {
        // Given
        when(inventoryRepository.findById("1")).thenReturn(Optional.of(testItem));
        when(inventoryRepository.save(any(InventoryItem.class))).thenReturn(testItem);

        // When
        boolean result = inventoryService.updateStock("1", 75);

        // Then
        assertThat(result).isTrue();
        assertThat(testItem.getStockQuantity()).isEqualTo(75);
        assertThat(testItem.getUpdatedAt()).isNotNull();
        
        verify(inventoryRepository).findById("1");
        verify(inventoryRepository).save(testItem);
    }

    @Test
    @DisplayName("Should fail to update stock when item not found")
    void shouldFailToUpdateStockWhenItemNotFound() {
        // Given
        when(inventoryRepository.findById("999")).thenReturn(Optional.empty());

        // When
        boolean result = inventoryService.updateStock("999", 75);

        // Then
        assertThat(result).isFalse();
        verify(inventoryRepository).findById("999");
        verify(inventoryRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should reduce stock when sufficient quantity available")
    void shouldReduceStockWhenSufficientQuantityAvailable() {
        // Given
        when(inventoryRepository.findById("1")).thenReturn(Optional.of(testItem));
        when(inventoryRepository.save(any(InventoryItem.class))).thenReturn(testItem);

        // When
        boolean result = inventoryService.reduceStock("1", 10);

        // Then
        assertThat(result).isTrue();
        assertThat(testItem.getStockQuantity()).isEqualTo(40); // 50 - 10
        
        verify(inventoryRepository).findById("1");
        verify(inventoryRepository).save(testItem);
    }

    @Test
    @DisplayName("Should fail to reduce stock when insufficient quantity")
    void shouldFailToReduceStockWhenInsufficientQuantity() {
        // Given
        when(inventoryRepository.findById("1")).thenReturn(Optional.of(testItem));

        // When
        boolean result = inventoryService.reduceStock("1", 60); // More than available (50)

        // Then
        assertThat(result).isFalse();
        assertThat(testItem.getStockQuantity()).isEqualTo(50); // Unchanged
        
        verify(inventoryRepository).findById("1");
        verify(inventoryRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should increase stock successfully")
    void shouldIncreaseStockSuccessfully() {
        // Given
        when(inventoryRepository.findById("1")).thenReturn(Optional.of(testItem));
        when(inventoryRepository.save(any(InventoryItem.class))).thenReturn(testItem);

        // When
        boolean result = inventoryService.increaseStock("1", 25);

        // Then
        assertThat(result).isTrue();
        assertThat(testItem.getStockQuantity()).isEqualTo(75); // 50 + 25
        
        verify(inventoryRepository).findById("1");
        verify(inventoryRepository).save(testItem);
    }

    @Test
    @DisplayName("Should check stock availability correctly")
    void shouldCheckStockAvailabilityCorrectly() {
        // Given
        when(inventoryRepository.findById("1")).thenReturn(Optional.of(testItem));

        // When & Then
        assertThat(inventoryService.isItemInStock("1", 30)).isTrue();  // 30 <= 50
        assertThat(inventoryService.isItemInStock("1", 50)).isTrue();  // 50 <= 50
        assertThat(inventoryService.isItemInStock("1", 60)).isFalse(); // 60 > 50
        
        verify(inventoryRepository, times(3)).findById("1");
    }

    @Test
    @DisplayName("Should return false for stock check when item not found")
    void shouldReturnFalseForStockCheckWhenItemNotFound() {
        // Given
        when(inventoryRepository.findById("999")).thenReturn(Optional.empty());

        // When
        boolean result = inventoryService.isItemInStock("999", 10);

        // Then
        assertThat(result).isFalse();
        verify(inventoryRepository).findById("999");
    }

    @Test
    @DisplayName("Should search items")
    void shouldSearchItems() {
        // Given
        List<InventoryItem> searchResults = Arrays.asList(testItem);
        when(inventoryRepository.findByNameContainingIgnoreCaseAndIsActiveTrue("apple"))
            .thenReturn(searchResults);

        // When
        List<InventoryItem> result = inventoryService.searchItems("apple");

        // Then
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getName()).isEqualTo("Fresh Apples");
        assertThat(result.get(0).getImageUrl()).isEqualTo("https://example.com/original-image.jpg");
        
        verify(inventoryRepository).findByNameContainingIgnoreCaseAndIsActiveTrue("apple");
    }

    // Helper method to create test items
    private InventoryItem createTestItem(String id, String name, String category, BigDecimal price, Integer stock) {
        InventoryItem item = new InventoryItem();
        item.setId(id);
        item.setName(name);
        item.setCategory(category);
        item.setPrice(price);
        item.setStockQuantity(stock);
        item.setUnit("kg");
        item.setImageUrl("https://example.com/original-image.jpg");
        item.setDescription("Test description for " + name);
        item.setIsActive(true);
        item.setCreatedAt(LocalDateTime.now());
        item.setUpdatedAt(LocalDateTime.now());
        return item;
    }
}