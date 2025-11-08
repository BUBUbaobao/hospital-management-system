package com.hospital.dto.response;

import com.hospital.enums.ItemType;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ItemResponse {
    private Long id;
    private String name;
    private ItemType type;
    private BigDecimal price;
    private String unit;
}
