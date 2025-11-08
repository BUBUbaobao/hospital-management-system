package com.hospital.controller;

import com.hospital.dto.request.DoctorLoginRequest;
import com.hospital.dto.request.LoginRequest;
import com.hospital.dto.request.PatientRegisterRequest;
import com.hospital.dto.response.ApiResponse;
import com.hospital.dto.response.LoginResponse;
import com.hospital.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "认证接口", description = "用户认证相关接口")
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    @Operation(summary = "患者注册", description = "患者注册新账号")
    @PostMapping("/patient/register")
    public ApiResponse<String> patientRegister(@Valid @RequestBody PatientRegisterRequest request) {
        authService.patientRegister(request);
        return ApiResponse.success("注册成功");
    }
    
    @Operation(summary = "患者登录", description = "患者登录系统")
    @PostMapping("/patient/login")
    public ApiResponse<LoginResponse> patientLogin(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.patientLogin(request);
        return ApiResponse.success(response);
    }
    
    @Operation(summary = "医生登录", description = "医生登录系统（需要校验码：Doctor）")
    @PostMapping("/doctor/login")
    public ApiResponse<LoginResponse> doctorLogin(@Valid @RequestBody DoctorLoginRequest request) {
        LoginResponse response = authService.doctorLogin(request);
        return ApiResponse.success(response);
    }
    
    @Operation(summary = "管理员登录", description = "管理员登录系统")
    @PostMapping("/admin/login")
    public ApiResponse<LoginResponse> adminLogin(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.adminLogin(request);
        return ApiResponse.success(response);
    }
    
    @Operation(summary = "退出登录", description = "用户退出登录")
    @PostMapping("/logout")
    public ApiResponse<String> logout() {
        // 前端清除token即可
        return ApiResponse.success("退出成功");
    }
}

