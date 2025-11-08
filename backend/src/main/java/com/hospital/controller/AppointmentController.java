package com.hospital.controller;

import com.hospital.dto.request.AppointmentRequest;
import com.hospital.dto.response.ApiResponse;
import com.hospital.dto.response.AppointmentResponse;
import com.hospital.service.AppointmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/appointments")
@Tag(name = "预约接口", description = "患者预约相关接口")
@SecurityRequirement(name = "Bearer Authentication")
public class AppointmentController {
    
    @Autowired
    private AppointmentService appointmentService;
    
    @Operation(summary = "创建预约", description = "患者创建新的预约记录")
    @PostMapping
    public ApiResponse<AppointmentResponse> createAppointment(
            @Valid @RequestBody AppointmentRequest request,
            Authentication authentication) {
        
        Long patientId = Long.parseLong(authentication.getName());
        AppointmentResponse response = appointmentService.createAppointment(patientId, request);
        return ApiResponse.success(response);
    }
    
    @Operation(summary = "查询我的预约", description = "查询当前患者的所有预约记录")
    @GetMapping("/mine")
    public ApiResponse<List<AppointmentResponse>> getMyAppointments(Authentication authentication) {
        Long patientId = Long.parseLong(authentication.getName());
        List<AppointmentResponse> appointments = appointmentService.getMyAppointments(patientId);
        return ApiResponse.success(appointments);
    }
    
    @Operation(summary = "退号", description = "取消指定的预约")
    @DeleteMapping("/{id}")
    public ApiResponse<String> cancelAppointment(
            @PathVariable Long id,
            Authentication authentication) {
        
        Long patientId = Long.parseLong(authentication.getName());
        appointmentService.cancelAppointment(id, patientId);
        return ApiResponse.success("退号成功");
    }
}

