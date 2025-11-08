package com.hospital.controller;

import com.hospital.dto.request.CompleteConsultationRequest;
import com.hospital.dto.response.ApiResponse;
import com.hospital.dto.response.DoctorAppointmentResponse;
import com.hospital.service.DoctorAppointmentService;
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
@Tag(name = "医生预约接口", description = "医生端预约管理相关接口")
@SecurityRequirement(name = "Bearer Authentication")
public class DoctorAppointmentController {

    @Autowired
    private DoctorAppointmentService doctorAppointmentService;

    @Operation(summary = "查询我的预约列表", description = "查询当前医生的所有预约记录")
    @GetMapping("/appointments")
    public ApiResponse<List<DoctorAppointmentResponse>> getMyAppointments(Authentication auth) {
        Long doctorId = Long.parseLong(auth.getName());
        List<DoctorAppointmentResponse> appointments = doctorAppointmentService.getMyAppointments(doctorId);
        return ApiResponse.success(appointments);
    }

    @Operation(summary = "查询预约详情", description = "查询指定预约的详细信息")
    @GetMapping("/appointments/{id}")
    public ApiResponse<DoctorAppointmentResponse> getAppointmentDetail(
            @PathVariable Long id,
            Authentication auth) {
        Long doctorId = Long.parseLong(auth.getName());
        DoctorAppointmentResponse appointment = doctorAppointmentService.getAppointmentDetail(id, doctorId);
        return ApiResponse.success(appointment);
    }

    @Operation(summary = "完成会诊", description = "完成会诊，填写医生建议和药品服务")
    @PostMapping("/appointments/{id}/complete")
    public ApiResponse<String> completeConsultation(
            @PathVariable Long id,
            @Valid @RequestBody CompleteConsultationRequest request,
            Authentication auth) {
        Long doctorId = Long.parseLong(auth.getName());
        Long visitId = doctorAppointmentService.completeConsultation(id, doctorId, request);
        return ApiResponse.success("会诊完成，就诊记录ID: " + visitId);
    }
}
