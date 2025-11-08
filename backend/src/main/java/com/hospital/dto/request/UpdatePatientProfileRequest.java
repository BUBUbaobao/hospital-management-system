package com.hospital.dto.request;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class UpdatePatientProfileRequest {
    private Short age;
    private BigDecimal height;
    private BigDecimal weight;
    private String avatarUrl;
}
