package com.hospital.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DoctorStatsResponse {
    private Long todayAppointments; // 今日预约数
    private Long weekConsultations; // 本周会诊数
    private Long totalPatients; // 患者总数
    private Double avgScore; // 平均评分
    private Long pendingAppointments; // 待处理预约数
}
