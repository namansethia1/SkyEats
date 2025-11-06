package com.skyeats.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Pexels Service Tests")
class PexelsServiceTest {

    @Mock
    private RestTemplate restTemplate;

    @InjectMocks
    private PexelsService pexelsService;

    @BeforeEach
    void setUp() {
        // Inject the mocked RestTemplate
        ReflectionTestUtils.setField(pexelsService, "restTemplate", restTemplate);
    }

    @Test
    @DisplayName("Should return Pexels image URL for valid product")
    void shouldReturnPexelsImageUrlForValidProduct() {
        // Given
        String productName = "Fresh Apples";
        String category = "Fruits";
        String expectedImageUrl = "https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&h=350";
        
        Map<String, Object> mockResponse = createMockPexelsResponse(expectedImageUrl);
        ResponseEntity<Map> responseEntity = new ResponseEntity<>(mockResponse, HttpStatus.OK);
        
        when(restTemplate.exchange(anyString(), eq(HttpMethod.GET), any(HttpEntity.class), eq(Map.class)))
            .thenReturn(responseEntity);

        // When
        String result = pexelsService.getProductImage(productName, category);

        // Then
        assertThat(result).isEqualTo(expectedImageUrl);
        verify(restTemplate).exchange(anyString(), eq(HttpMethod.GET), any(HttpEntity.class), eq(Map.class));
    }

    @Test
    @DisplayName("Should return cached image URL for repeated requests")
    void shouldReturnCachedImageUrlForRepeatedRequests() {
        // Given
        String productName = "Fresh Apples";
        String category = "Fruits";
        String expectedImageUrl = "https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&h=350";
        
        Map<String, Object> mockResponse = createMockPexelsResponse(expectedImageUrl);
        ResponseEntity<Map> responseEntity = new ResponseEntity<>(mockResponse, HttpStatus.OK);
        
        when(restTemplate.exchange(anyString(), eq(HttpMethod.GET), any(HttpEntity.class), eq(Map.class)))
            .thenReturn(responseEntity);

        // When - First call
        String result1 = pexelsService.getProductImage(productName, category);
        
        // When - Second call (should use cache)
        String result2 = pexelsService.getProductImage(productName, category);

        // Then
        assertThat(result1).isEqualTo(expectedImageUrl);
        assertThat(result2).isEqualTo(expectedImageUrl);
        
        // Verify API was called only once (second call used cache)
        verify(restTemplate, times(1)).exchange(anyString(), eq(HttpMethod.GET), any(HttpEntity.class), eq(Map.class));
    }

    @Test
    @DisplayName("Should return fallback image when Pexels API fails")
    void shouldReturnFallbackImageWhenPexelsApiFails() {
        // Given
        String productName = "Fresh Apples";
        String category = "Fruits";
        
        when(restTemplate.exchange(anyString(), eq(HttpMethod.GET), any(HttpEntity.class), eq(Map.class)))
            .thenThrow(new RestClientException("API Error"));

        // When
        String result = pexelsService.getProductImage(productName, category);

        // Then
        assertThat(result).isNotNull();
        assertThat(result).startsWith("https://images.unsplash.com/"); // Should be fallback URL
        verify(restTemplate).exchange(anyString(), eq(HttpMethod.GET), any(HttpEntity.class), eq(Map.class));
    }

    @Test
    @DisplayName("Should return fallback image when Pexels returns empty response")
    void shouldReturnFallbackImageWhenPexelsReturnsEmptyResponse() {
        // Given
        String productName = "Fresh Apples";
        String category = "Fruits";
        
        Map<String, Object> emptyResponse = new HashMap<>();
        emptyResponse.put("photos", List.of()); // Empty photos array
        ResponseEntity<Map> responseEntity = new ResponseEntity<>(emptyResponse, HttpStatus.OK);
        
        when(restTemplate.exchange(anyString(), eq(HttpMethod.GET), any(HttpEntity.class), eq(Map.class)))
            .thenReturn(responseEntity);

        // When
        String result = pexelsService.getProductImage(productName, category);

        // Then
        assertThat(result).isNotNull();
        assertThat(result).startsWith("https://images.unsplash.com/"); // Should be fallback URL
        verify(restTemplate).exchange(anyString(), eq(HttpMethod.GET), any(HttpEntity.class), eq(Map.class));
    }

    @Test
    @DisplayName("Should build correct search query for different categories")
    void shouldBuildCorrectSearchQueryForDifferentCategories() {
        // Given
        Map<String, String> testCases = Map.of(
            "Fruits", "apple fresh fruits",
            "Vegetables", "carrot fresh vegetables", 
            "Dairy", "milk dairy products",
            "Bakery", "bread bakery",
            "Unknown", "test unknown"
        );

        String expectedImageUrl = "https://images.pexels.com/test.jpg";
        Map<String, Object> mockResponse = createMockPexelsResponse(expectedImageUrl);
        ResponseEntity<Map> responseEntity = new ResponseEntity<>(mockResponse, HttpStatus.OK);
        
        when(restTemplate.exchange(anyString(), eq(HttpMethod.GET), any(HttpEntity.class), eq(Map.class)))
            .thenReturn(responseEntity);

        // When & Then
        testCases.forEach((category, expectedQuery) -> {
            String productName = category.equals("Unknown") ? "Test" : category.substring(0, category.length() - 1); // Remove 's' for singular
            String result = pexelsService.getProductImage(productName, category);
            
            assertThat(result).isEqualTo(expectedImageUrl);
        });

        verify(restTemplate, times(testCases.size()))
            .exchange(anyString(), eq(HttpMethod.GET), any(HttpEntity.class), eq(Map.class));
    }

    @Test
    @DisplayName("Should handle special characters in product names")
    void shouldHandleSpecialCharactersInProductNames() {
        // Given
        String productName = "Organic Apple's & Pear's (Fresh!)";
        String category = "Fruits";
        String expectedImageUrl = "https://images.pexels.com/test.jpg";
        
        Map<String, Object> mockResponse = createMockPexelsResponse(expectedImageUrl);
        ResponseEntity<Map> responseEntity = new ResponseEntity<>(mockResponse, HttpStatus.OK);
        
        when(restTemplate.exchange(anyString(), eq(HttpMethod.GET), any(HttpEntity.class), eq(Map.class)))
            .thenReturn(responseEntity);

        // When
        String result = pexelsService.getProductImage(productName, category);

        // Then
        assertThat(result).isEqualTo(expectedImageUrl);
        verify(restTemplate).exchange(anyString(), eq(HttpMethod.GET), any(HttpEntity.class), eq(Map.class));
    }

    @Test
    @DisplayName("Should return category-specific fallback for unknown categories")
    void shouldReturnCategorySpecificFallbackForUnknownCategories() {
        // Given
        String productName = "Unknown Product";
        String category = "UnknownCategory";
        
        when(restTemplate.exchange(anyString(), eq(HttpMethod.GET), any(HttpEntity.class), eq(Map.class)))
            .thenThrow(new RestClientException("API Error"));

        // When
        String result = pexelsService.getProductImage(productName, category);

        // Then
        assertThat(result).isNotNull();
        assertThat(result).contains("unsplash.com"); // Should be generic fallback
        verify(restTemplate).exchange(anyString(), eq(HttpMethod.GET), any(HttpEntity.class), eq(Map.class));
    }

    @Test
    @DisplayName("Should clear cache successfully")
    void shouldClearCacheSuccessfully() {
        // Given
        String productName = "Fresh Apples";
        String category = "Fruits";
        String expectedImageUrl = "https://images.pexels.com/test.jpg";
        
        Map<String, Object> mockResponse = createMockPexelsResponse(expectedImageUrl);
        ResponseEntity<Map> responseEntity = new ResponseEntity<>(mockResponse, HttpStatus.OK);
        
        when(restTemplate.exchange(anyString(), eq(HttpMethod.GET), any(HttpEntity.class), eq(Map.class)))
            .thenReturn(responseEntity);

        // When - Add item to cache
        pexelsService.getProductImage(productName, category);
        int cacheSize = pexelsService.getCacheSize();
        
        // Clear cache
        pexelsService.clearImageCache();
        int cacheSizeAfterClear = pexelsService.getCacheSize();

        // Then
        assertThat(cacheSize).isGreaterThan(0);
        assertThat(cacheSizeAfterClear).isEqualTo(0);
    }

    @Test
    @DisplayName("Should return correct cache size")
    void shouldReturnCorrectCacheSize() {
        // Given
        String expectedImageUrl = "https://images.pexels.com/test.jpg";
        Map<String, Object> mockResponse = createMockPexelsResponse(expectedImageUrl);
        ResponseEntity<Map> responseEntity = new ResponseEntity<>(mockResponse, HttpStatus.OK);
        
        when(restTemplate.exchange(anyString(), eq(HttpMethod.GET), any(HttpEntity.class), eq(Map.class)))
            .thenReturn(responseEntity);

        // When
        int initialSize = pexelsService.getCacheSize();
        
        pexelsService.getProductImage("Apple", "Fruits");
        int sizeAfterOne = pexelsService.getCacheSize();
        
        pexelsService.getProductImage("Banana", "Fruits");
        int sizeAfterTwo = pexelsService.getCacheSize();
        
        // Same product again (should use cache)
        pexelsService.getProductImage("Apple", "Fruits");
        int sizeAfterRepeat = pexelsService.getCacheSize();

        // Then
        assertThat(initialSize).isEqualTo(0);
        assertThat(sizeAfterOne).isEqualTo(1);
        assertThat(sizeAfterTwo).isEqualTo(2);
        assertThat(sizeAfterRepeat).isEqualTo(2); // No increase for cached item
    }

    @Test
    @DisplayName("Should handle null or empty product names gracefully")
    void shouldHandleNullOrEmptyProductNamesGracefully() {
        // Given
        String category = "Fruits";
        String expectedImageUrl = "https://images.pexels.com/test.jpg";
        
        Map<String, Object> mockResponse = createMockPexelsResponse(expectedImageUrl);
        ResponseEntity<Map> responseEntity = new ResponseEntity<>(mockResponse, HttpStatus.OK);
        
        when(restTemplate.exchange(anyString(), eq(HttpMethod.GET), any(HttpEntity.class), eq(Map.class)))
            .thenReturn(responseEntity);

        // When & Then
        String result1 = pexelsService.getProductImage(null, category);
        String result2 = pexelsService.getProductImage("", category);
        String result3 = pexelsService.getProductImage("   ", category);

        assertThat(result1).isNotNull();
        assertThat(result2).isNotNull();
        assertThat(result3).isNotNull();
    }

    // Helper method to create mock Pexels API response
    private Map<String, Object> createMockPexelsResponse(String imageUrl) {
        Map<String, Object> src = new HashMap<>();
        src.put("medium", imageUrl);
        src.put("large", "https://images.pexels.com/large.jpg");
        src.put("small", "https://images.pexels.com/small.jpg");

        Map<String, Object> photo = new HashMap<>();
        photo.put("id", 102104);
        photo.put("src", src);
        photo.put("photographer", "Test Photographer");

        Map<String, Object> response = new HashMap<>();
        response.put("photos", List.of(photo));
        response.put("total_results", 1);
        response.put("page", 1);
        response.put("per_page", 1);

        return response;
    }
}