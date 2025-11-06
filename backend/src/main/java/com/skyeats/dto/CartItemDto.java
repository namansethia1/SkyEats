package com.skyeats.dto;

import java.math.BigDecimal;

public class CartItemDto {
    private String itemId;
    private String name;
    private String category;
    private BigDecimal price;
    private Integer quantity;
    private String imageUrl;
    private String unit;
    private BigDecimal totalPrice;
    private Boolean inStock;

    // Constructors
    public CartItemDto() {}

    public CartItemDto(String itemId, String name, String category, BigDecimal price, 
                      Integer quantity, String imageUrl, String unit, Boolean inStock) {
        this.itemId = itemId;
        this.name = name;
        this.category = category;
        this.price = price;
        this.quantity = quantity;
        this.imageUrl = imageUrl;
        this.unit = unit;
        this.inStock = inStock;
        this.totalPrice = price.multiply(BigDecimal.valueOf(quantity));
    }

    // Getters and Setters
    public String getItemId() { return itemId; }
    public void setItemId(String itemId) { this.itemId = itemId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { 
        this.price = price;
        if (this.quantity != null) {
            this.totalPrice = price.multiply(BigDecimal.valueOf(quantity));
        }
    }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { 
        this.quantity = quantity;
        if (this.price != null) {
            this.totalPrice = price.multiply(BigDecimal.valueOf(quantity));
        }
    }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public BigDecimal getTotalPrice() { return totalPrice; }
    public void setTotalPrice(BigDecimal totalPrice) { this.totalPrice = totalPrice; }

    public Boolean getInStock() { return inStock; }
    public void setInStock(Boolean inStock) { this.inStock = inStock; }
}