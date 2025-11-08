package com.hospital.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DailyConsultationStatsResponse {
    private LocalDate date;
    private Long totalAppointments; // 预约总数
    private Long pending; // 待就诊
    private Long visited; // 已会诊
    private Long cancelled; // 已退号
}
