package com.hospital.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DailyVisitStatsResponse {
    private LocalDate date;
    private Long totalVisits; // 当天就诊数
    private BigDecimal totalFee; // 当天总费用
}
