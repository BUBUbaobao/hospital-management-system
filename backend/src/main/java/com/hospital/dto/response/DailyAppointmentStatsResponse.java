package com.hospital.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DailyAppointmentStatsResponse {
    private LocalDate date;
    private Long totalAppointments; // 总预约数
    private Long pending; // 待就诊数
    private Long visited; // 已就诊数
    private Long cancelled; // 已退号数
}
