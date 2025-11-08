package com.hospital.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PatientProfileResponse {
    private Long id;
    private String account;
    private String realName;
    private String phone;
    private Short age;
    private BigDecimal height;
    private BigDecimal weight;
    private String avatarUrl;
}
