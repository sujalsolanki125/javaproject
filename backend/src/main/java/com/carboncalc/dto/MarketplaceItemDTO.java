package com.carboncalc.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MarketplaceItemDTO {
    private Long id;
    private String name;
    private String description;
    private Double price;
    private String carbonOffset;
    private String category;
    private String imageUrl;
    private Integer stock;
    private Boolean isActive;
}
