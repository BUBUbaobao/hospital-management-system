package com.hospital.controller;

import com.hospital.dto.response.ApiResponse;
import com.hospital.dto.response.DepartmentResponse;
import com.hospital.service.DepartmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/departments")
@Tag(name = "科室接口", description = "科室查询相关接口")
public class DepartmentController {
    
    @Autowired
    private DepartmentService departmentService;
    
    @Operation(summary = "查询所有启用的科室", description = "获取所有启用状态的科室列表")
    @GetMapping
    public ApiResponse<List<DepartmentResponse>> getAllDepartments() {
        List<DepartmentResponse> departments = departmentService.getAllEnabledDepartments();
        return ApiResponse.success(departments);
    }
}

