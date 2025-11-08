package com.hospital.dto.response;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class VisitResponse {
    private Long id;
    private Long doctorId;
    private String doctorName;
    private Long departmentId;
    private String departmentName;
    private LocalDateTime visitAt;
    private BigDecimal totalFee;
    private String doctorAdvice;
    private List<VisitItemResponse> items;
    private LocalDateTime createdAt;
}
