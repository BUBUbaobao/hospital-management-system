package com.hospital.controller;

import com.hospital.dto.request.UpdatePatientProfileRequest;
import com.hospital.dto.response.ApiResponse;
import com.hospital.dto.response.PatientProfileResponse;
import com.hospital.dto.response.ReminderResponse;
import com.hospital.entity.Appointment;
import com.hospital.entity.Patient;
import com.hospital.exception.BusinessException;
import com.hospital.repository.AppointmentRepository;
import com.hospital.repository.PatientRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/v1/patient")
@Tag(name = "患者个人信息接口", description = "患者端个人信息管理和提醒相关接口")
@SecurityRequirement(name = "Bearer Authentication")
public class PatientProfileController {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Operation(summary = "查询个人信息", description = "获取当前患者的个人信息")
    @GetMapping("/me")
    public ApiResponse<PatientProfileResponse> getMyProfile(Authentication auth) {
        Long patientId = Long.parseLong(auth.getName());
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new BusinessException("患者不存在"));

        PatientProfileResponse response = new PatientProfileResponse(
                patient.getId(),
                patient.getAccount(),
                patient.getRealName(),
                patient.getPhone(),
                patient.getAge(),
                patient.getHeight(),
                patient.getWeight(),
                patient.getAvatarUrl());

        return ApiResponse.success(response);
    }

    @Operation(summary = "更新个人信息", description = "更新患者的年龄、身高、体重、头像")
    @PutMapping("/me")
    public ApiResponse<PatientProfileResponse> updateMyProfile(
            @Valid @RequestBody UpdatePatientProfileRequest request,
            Authentication auth) {
        Long patientId = Long.parseLong(auth.getName());
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new BusinessException("患者不存在"));

        if (request.getAge() != null) {
            patient.setAge(request.getAge());
        }
        if (request.getHeight() != null) {
            patient.setHeight(request.getHeight());
        }
        if (request.getWeight() != null) {
            patient.setWeight(request.getWeight());
        }
        if (request.getAvatarUrl() != null) {
            patient.setAvatarUrl(request.getAvatarUrl());
        }

        patient = patientRepository.save(patient);

        PatientProfileResponse response = new PatientProfileResponse(
                patient.getId(),
                patient.getAccount(),
                patient.getRealName(),
                patient.getPhone(),
                patient.getAge(),
                patient.getHeight(),
                patient.getWeight(),
                patient.getAvatarUrl());

        return ApiResponse.success(response);
    }

    @Operation(summary = "获取预约提醒", description = "判断预约时间是否临近（1小时内）")
    @GetMapping("/appointments/{id}/reminder")
    public ApiResponse<ReminderResponse> getAppointmentReminder(
            @PathVariable Long id,
            Authentication auth) {
        Long patientId = Long.parseLong(auth.getName());

        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new BusinessException("预约记录不存在"));

        // 验证是否是患者自己的预约
        if (!appointment.getPatientId().equals(patientId)) {
            throw new BusinessException("无权查看他人的预约");
        }

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime visitTime = appointment.getVisitAt();
        Duration duration = Duration.between(now, visitTime);

        boolean hasReminder = false;
        String message = "";

        // 如果在1小时内
        if (duration.toMinutes() > 0 && duration.toMinutes() <= 60) {
            hasReminder = true;
            message = String.format("您的预约即将开始（还有%d分钟）", duration.toMinutes());
        }

        return ApiResponse.success(new ReminderResponse(hasReminder, message));
    }
}
