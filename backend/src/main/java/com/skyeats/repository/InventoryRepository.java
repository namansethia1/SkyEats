package com.skyeats.repository;

import com.skyeats.model.InventoryItem;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InventoryRepository extends MongoRepository<InventoryItem, String> {
    
    List<InventoryItem> findByCategoryAndIsActiveTrue(String category);
    
    List<InventoryItem> findByIsActiveTrue();
    
    @Query("{ 'category': { $regex: ?0, $options: 'i' }, 'isActive': true }")
    List<InventoryItem> findByCategoryIgnoreCaseAndIsActiveTrue(String category);
    
    @Query("{ 'name': { $regex: ?0, $options: 'i' }, 'isActive': true }")
    List<InventoryItem> findByNameContainingIgnoreCaseAndIsActiveTrue(String name);
    
    @Query(value = "{}", fields = "{ 'category': 1 }")
    List<InventoryItem> findDistinctCategories();
}