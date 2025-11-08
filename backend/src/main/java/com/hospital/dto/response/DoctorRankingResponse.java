package com.hospital.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DoctorRankingResponse {
    private Long doctorId;
    private String doctorName;
    private Double avgScore; // 平均分
    private Long reviewCount; // 评价数
}
