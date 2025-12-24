package com.carboncalc.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartItemDTO {
    private Long id;
    private Long marketplaceItemId;
    private String itemName;
    private String itemDescription;
    private Double itemPrice;
    private String carbonOffset;
    private String imageUrl;
    private Integer quantity;
    private Double totalPrice;
}
