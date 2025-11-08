package com.hospital.dto.response;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class VisitItemResponse {
    private Long id;
    private String itemName;
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal totalAmount;
}
