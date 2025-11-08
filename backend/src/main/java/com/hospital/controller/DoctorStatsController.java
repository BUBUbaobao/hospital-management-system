package com.hospital.controller;

import com.hospital.dto.response.ApiResponse;
import com.hospital.dto.response.DailyConsultationStatsResponse;
import com.hospital.dto.response.DoctorStatsResponse;
import com.hospital.service.DoctorStatsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/doctor")
@Tag(name = "医生统计接口", description = "医生端工作统计相关接口")
@SecurityRequirement(name = "Bearer Authentication")
public class DoctorStatsController {

    @Autowired
    private DoctorStatsService doctorStatsService;

    @Operation(summary = "获取工作统计概览", description = "获取医生的工作统计数据")
    @GetMapping("/stats/overview")
    public ApiResponse<DoctorStatsResponse> getStats(Authentication auth) {
        Long doctorId = Long.parseLong(auth.getName());
        DoctorStatsResponse stats = doctorStatsService.getDoctorStats(doctorId);
        return ApiResponse.success(stats);
    }

    @Operation(summary = "获取最近7天会诊趋势", description = "获取医生最近7天的会诊数据")
    @GetMapping("/stats/daily-consultations")
    public ApiResponse<List<DailyConsultationStatsResponse>> getDailyConsultations(Authentication auth) {
        Long doctorId = Long.parseLong(auth.getName());
        List<DailyConsultationStatsResponse> stats = doctorStatsService.getDailyConsultations(doctorId);
        return ApiResponse.success(stats);
    }
}
