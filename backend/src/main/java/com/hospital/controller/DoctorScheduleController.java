package com.hospital.controller;

import com.hospital.dto.request.ScheduleRequest;
import com.hospital.dto.response.ApiResponse;
import com.hospital.dto.response.ScheduleResponse;
import com.hospital.enums.DoctorStatus;
import com.hospital.service.DoctorScheduleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/doctor")
@Tag(name = "医生时段接口", description = "医生端在岗时段管理相关接口")
@SecurityRequirement(name = "Bearer Authentication")
public class DoctorScheduleController {

    @Autowired
    private DoctorScheduleService doctorScheduleService;

    @Operation(summary = "查询我的时段列表", description = "查询当前医生的所有在岗时段")
    @GetMapping("/schedules")
    public ApiResponse<List<ScheduleResponse>> getMySchedules(Authentication auth) {
        Long doctorId = Long.parseLong(auth.getName());
        List<ScheduleResponse> schedules = doctorScheduleService.getMySchedules(doctorId);
        return ApiResponse.success(schedules);
    }

    @Operation(summary = "添加时段", description = "添加新的在岗时段")
    @PostMapping("/schedules")
    public ApiResponse<ScheduleResponse> createSchedule(
            @Valid @RequestBody ScheduleRequest request,
            Authentication auth) {
        Long doctorId = Long.parseLong(auth.getName());
        ScheduleResponse schedule = doctorScheduleService.createSchedule(doctorId, request);
        return ApiResponse.success(schedule);
    }

    @Operation(summary = "更新时段状态", description = "更新时段的在岗状态")
    @PutMapping("/schedules/{id}")
    public ApiResponse<ScheduleResponse> updateScheduleStatus(
            @PathVariable Long id,
            @RequestParam DoctorStatus status,
            Authentication auth) {
        Long doctorId = Long.parseLong(auth.getName());
        ScheduleResponse schedule = doctorScheduleService.updateScheduleStatus(id, doctorId, status);
        return ApiResponse.success(schedule);
    }
}
