package com.skyeats.service;

import com.skyeats.model.InventoryItem;
import com.skyeats.repository.InventoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

@Service
public class DataInitializationService implements CommandLineRunner {

    @Autowired
    private InventoryRepository inventoryRepository;

    @Override
    public void run(String... args) throws Exception {
        if (inventoryRepository.count() == 0) {
            initializeInventoryData();
        }
    }

    private void initializeInventoryData() {
        List<InventoryItem> items = Arrays.asList(
            // Fruits
            new InventoryItem("Apple", "Fresh red apples", "Fruits", new BigDecimal("120.00"), 100, "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300", "kg"),
            new InventoryItem("Banana", "Ripe yellow bananas", "Fruits", new BigDecimal("60.00"), 150, "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300", "dozen"),
            new InventoryItem("Mango", "Sweet mangoes", "Fruits", new BigDecimal("200.00"), 80, "https://images.unsplash.com/photo-1553279768-865429fa0078?w=300", "kg"),
            new InventoryItem("Grapes", "Fresh grapes", "Fruits", new BigDecimal("150.00"), 60, "https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=300", "kg"),
            new InventoryItem("Strawberries", "Fresh strawberries", "Fruits", new BigDecimal("300.00"), 40, "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=300", "pack"),
            new InventoryItem("Kiwi", "Fresh kiwi fruit", "Fruits", new BigDecimal("250.00"), 30, "https://images.unsplash.com/photo-1585059895524-72359e06133a?w=300", "kg"),
            new InventoryItem("Pineapple", "Fresh pineapple", "Fruits", new BigDecimal("80.00"), 25, "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=300", "piece"),
            new InventoryItem("Papaya", "Ripe papaya", "Fruits", new BigDecimal("40.00"), 50, "https://images.unsplash.com/photo-1617112848923-cc2234396a8d?w=300", "kg"),
            new InventoryItem("Guava", "Fresh guava", "Fruits", new BigDecimal("60.00"), 45, "https://images.unsplash.com/photo-1536511132770-e5058c4e1d63?w=300", "kg"),
            new InventoryItem("Pear", "Fresh pears", "Fruits", new BigDecimal("180.00"), 35, "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=300", "kg"),

            // Vegetables
            new InventoryItem("Tomato", "Fresh red tomatoes", "Vegetables", new BigDecimal("40.00"), 200, "https://images.unsplash.com/photo-1546470427-e5380e0e8b5a?w=300", "kg"),
            new InventoryItem("Potato", "Fresh potatoes", "Vegetables", new BigDecimal("25.00"), 250, "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=300", "kg"),
            new InventoryItem("Onion", "Fresh onions", "Vegetables", new BigDecimal("30.00"), 180, "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=300", "kg"),
            new InventoryItem("Carrot", "Fresh carrots", "Vegetables", new BigDecimal("50.00"), 100, "https://images.unsplash.com/photo-1445282768818-728615cc910a?w=300", "kg"),
            new InventoryItem("Cucumber", "Fresh cucumbers", "Vegetables", new BigDecimal("35.00"), 120, "https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=300", "kg"),
            new InventoryItem("Spinach", "Fresh green spinach", "Vegetables", new BigDecimal("35.00"), 80, "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=300", "bunch"),
            new InventoryItem("Broccoli", "Fresh broccoli", "Vegetables", new BigDecimal("80.00"), 60, "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=300", "kg"),
            new InventoryItem("Cabbage", "Fresh cabbage", "Vegetables", new BigDecimal("25.00"), 90, "https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=300", "kg"),
            new InventoryItem("Garlic", "Fresh garlic", "Vegetables", new BigDecimal("200.00"), 50, "https://images.unsplash.com/photo-1471195696693-5f425d0c7b5b?w=300", "kg"),
            new InventoryItem("Ginger", "Fresh ginger", "Vegetables", new BigDecimal("150.00"), 40, "https://images.unsplash.com/photo-1471195696693-5f425d0c7b5b?w=300", "kg"),

            // Snacks
            new InventoryItem("Lays Chips", "Classic salted chips", "Snacks", new BigDecimal("20.00"), 100, "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=300", "pack"),
            new InventoryItem("Kurkure", "Crunchy corn snacks", "Snacks", new BigDecimal("15.00"), 80, "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=300", "pack"),
            new InventoryItem("Popcorn", "Butter popcorn", "Snacks", new BigDecimal("25.00"), 60, "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300", "pack"),
            new InventoryItem("Nachos", "Cheese nachos", "Snacks", new BigDecimal("30.00"), 50, "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=300", "pack"),
            new InventoryItem("Cookies", "Chocolate chip cookies", "Snacks", new BigDecimal("40.00"), 70, "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=300", "pack"),
            new InventoryItem("Chocolate Bar", "Dark chocolate bar", "Snacks", new BigDecimal("50.00"), 90, "https://images.unsplash.com/photo-1511381939415-e44015466834?w=300", "piece"),
            new InventoryItem("Peanuts", "Roasted peanuts", "Snacks", new BigDecimal("80.00"), 40, "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=300", "pack"),
            new InventoryItem("Trail Mix", "Mixed nuts and dried fruits", "Snacks", new BigDecimal("120.00"), 35, "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=300", "pack"),
            new InventoryItem("Namkeen", "Traditional Indian snacks", "Snacks", new BigDecimal("60.00"), 55, "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=300", "pack"),
            new InventoryItem("Bhujia", "Spicy sev bhujia", "Snacks", new BigDecimal("45.00"), 65, "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=300", "pack"),

            // Beverages
            new InventoryItem("Coca-Cola", "Classic Coke", "Beverages", new BigDecimal("40.00"), 100, "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=300", "bottle"),
            new InventoryItem("Pepsi", "Pepsi cola", "Beverages", new BigDecimal("40.00"), 95, "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=300", "bottle"),
            new InventoryItem("Mango Juice", "Fresh mango juice", "Beverages", new BigDecimal("60.00"), 70, "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=300", "bottle"),
            new InventoryItem("Iced Tea", "Lemon iced tea", "Beverages", new BigDecimal("35.00"), 80, "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=300", "bottle"),
            new InventoryItem("Lemonade", "Fresh lemonade", "Beverages", new BigDecimal("30.00"), 60, "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=300", "glass"),
            new InventoryItem("Buttermilk", "Traditional buttermilk", "Beverages", new BigDecimal("25.00"), 50, "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300", "glass"),
            new InventoryItem("Cold Coffee", "Iced coffee", "Beverages", new BigDecimal("80.00"), 45, "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300", "glass"),
            new InventoryItem("Energy Drink", "Sports energy drink", "Beverages", new BigDecimal("100.00"), 40, "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=300", "can"),
            new InventoryItem("Soda", "Lime soda", "Beverages", new BigDecimal("25.00"), 85, "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=300", "bottle"),

            // Dairy
            new InventoryItem("Milk", "Fresh whole milk", "Dairy", new BigDecimal("60.00"), 100, "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300", "liter"),
            new InventoryItem("Cheese", "Processed cheese", "Dairy", new BigDecimal("200.00"), 40, "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=300", "pack"),
            new InventoryItem("Yogurt", "Plain yogurt", "Dairy", new BigDecimal("80.00"), 60, "https://images.unsplash.com/photo-1571212515416-fca0bf4c5ac4?w=300", "cup"),
            new InventoryItem("Butter", "Fresh butter", "Dairy", new BigDecimal("120.00"), 50, "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=300", "pack"),
            new InventoryItem("Paneer", "Fresh paneer", "Dairy", new BigDecimal("300.00"), 30, "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=300", "kg"),
            new InventoryItem("Ghee", "Pure ghee", "Dairy", new BigDecimal("500.00"), 25, "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=300", "kg"),
            new InventoryItem("Cream", "Fresh cream", "Dairy", new BigDecimal("150.00"), 35, "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300", "pack"),
            new InventoryItem("Ice Cream", "Vanilla ice cream", "Dairy", new BigDecimal("200.00"), 40, "https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?w=300", "tub"),
            new InventoryItem("Lassi", "Sweet lassi", "Dairy", new BigDecimal("40.00"), 50, "https://images.unsplash.com/photo-1571212515416-fca0bf4c5ac4?w=300", "glass"),
            new InventoryItem("Flavored Milk", "Chocolate flavored milk", "Dairy", new BigDecimal("35.00"), 70, "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300", "bottle"),

            // Bakery
            new InventoryItem("Bread", "White bread loaf", "Bakery", new BigDecimal("35.00"), 50, "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300", "loaf"),
            new InventoryItem("Brown Bread", "Whole wheat bread", "Bakery", new BigDecimal("45.00"), 40, "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=300", "loaf"),
            new InventoryItem("Croissant", "Butter croissant", "Bakery", new BigDecimal("25.00"), 30, "https://images.unsplash.com/photo-1555507036-ab794f4afe5e?w=300", "piece"),
            new InventoryItem("Donut", "Glazed donut", "Bakery", new BigDecimal("40.00"), 35, "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=300", "piece"),
            new InventoryItem("Muffin", "Blueberry muffin", "Bakery", new BigDecimal("60.00"), 25, "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=300", "piece"),
            new InventoryItem("Cupcake", "Chocolate cupcake", "Bakery", new BigDecimal("50.00"), 40, "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=300", "piece"),
            new InventoryItem("Rusk", "Tea rusk", "Bakery", new BigDecimal("30.00"), 60, "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300", "pack"),
            new InventoryItem("Pizza Base", "Ready pizza base", "Bakery", new BigDecimal("80.00"), 20, "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300", "piece"),
            new InventoryItem("Pastry", "Chocolate pastry", "Bakery", new BigDecimal("120.00"), 15, "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300", "piece"),
            new InventoryItem("Garlic Bread", "Garlic bread sticks", "Bakery", new BigDecimal("100.00"), 25, "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300", "pack"),

            // Frozen
            new InventoryItem("Frozen Fries", "Crispy frozen fries", "Frozen", new BigDecimal("150.00"), 40, "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=300", "pack"),
            new InventoryItem("Frozen Pizza", "Margherita frozen pizza", "Frozen", new BigDecimal("300.00"), 20, "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300", "piece"),
            new InventoryItem("Frozen Nuggets", "Chicken nuggets", "Frozen", new BigDecimal("250.00"), 30, "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=300", "pack"),
            new InventoryItem("Frozen Cutlets", "Vegetable cutlets", "Frozen", new BigDecimal("200.00"), 25, "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=300", "pack"),
            new InventoryItem("Frozen Paneer", "Frozen paneer cubes", "Frozen", new BigDecimal("350.00"), 15, "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=300", "pack"),
            new InventoryItem("Frozen Peas", "Green peas", "Frozen", new BigDecimal("80.00"), 50, "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=300", "pack"),
            new InventoryItem("Frozen Berries", "Mixed berries", "Frozen", new BigDecimal("400.00"), 20, "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=300", "pack"),

            // Grains
            new InventoryItem("Rice", "Basmati rice", "Grains", new BigDecimal("120.00"), 100, "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300", "kg"),
            new InventoryItem("Wheat Flour", "Whole wheat flour", "Grains", new BigDecimal("40.00"), 150, "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300", "kg"),
            new InventoryItem("Oats", "Rolled oats", "Grains", new BigDecimal("200.00"), 60, "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300", "kg"),
            new InventoryItem("Cornflakes", "Breakfast cornflakes", "Grains", new BigDecimal("150.00"), 40, "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300", "pack"),
            new InventoryItem("Poha", "Flattened rice", "Grains", new BigDecimal("60.00"), 80, "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300", "kg"),
            new InventoryItem("Millets", "Mixed millets", "Grains", new BigDecimal("100.00"), 50, "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300", "kg"),
            new InventoryItem("Quinoa", "Organic quinoa", "Grains", new BigDecimal("400.00"), 25, "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300", "kg"),
            new InventoryItem("Barley", "Pearl barley", "Grains", new BigDecimal("80.00"), 45, "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300", "kg"),
            new InventoryItem("Rava", "Semolina", "Grains", new BigDecimal("50.00"), 70, "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300", "kg"),
            new InventoryItem("Basmati Rice", "Premium basmati rice", "Grains", new BigDecimal("180.00"), 60, "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300", "kg")
        );

        inventoryRepository.saveAll(items);
        System.out.println("Inventory data initialized with " + items.size() + " items");
    }
}