package com.hospital.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StatsOverviewResponse {
    private Long totalDoctors; // 医生总数
    private Long onDutyDoctors; // 在岗医生数
    private Long offDutyDoctors; // 不在岗医生数
    private Long todayAppointments; // 今日预约数
    private Long todayVisits; // 今日就诊数
    private Long totalPatients; // 患者总数
}
