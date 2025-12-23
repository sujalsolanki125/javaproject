package com.carboncalc.dto;

import lombok.Data;

@Data
public class BadgeDTO {
    private String name;
    private String icon;
    private String color;
    private Boolean unlocked;
}
