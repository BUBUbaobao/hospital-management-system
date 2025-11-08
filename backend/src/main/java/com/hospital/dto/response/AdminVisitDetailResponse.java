package com.hospital.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminVisitDetailResponse {
    private Long id;

    // 患者信息
    private Long patientId;
    private String patientName;
    private String patientPhone;
    private Short patientAge;
    private BigDecimal patientHeight;
    private BigDecimal patientWeight;

    // 医生和科室信息
    private Long doctorId;
    private String doctorName;
    private Long departmentId;
    private String departmentName;

    // 就诊信息
    private LocalDateTime visitAt;
    private String illnessDesc; // 病情描述（来自预约）
    private String doctorAdvice; // 医生建议
    private BigDecimal totalFee;

    // 药品/服务清单
    private List<VisitItemInfo> items;

    private LocalDateTime createdAt;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VisitItemInfo {
        private Long itemId;
        private String itemName;
        private Integer quantity;
        private BigDecimal unitPrice;
        private BigDecimal totalAmount;
    }
}
