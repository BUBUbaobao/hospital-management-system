package com.hospital.controller;

import com.hospital.dto.response.ApiResponse;
import com.hospital.dto.response.DoctorResponse;
import com.hospital.service.DoctorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/doctors")
@Tag(name = "医生接口", description = "医生查询相关接口")
public class DoctorController {
    
    @Autowired
    private DoctorService doctorService;
    
    @Operation(summary = "查询医生列表", description = "查询所有医生或按科室筛选医生")
    @GetMapping
    public ApiResponse<List<DoctorResponse>> getDoctors(
            @Parameter(description = "科室ID（可选）") @RequestParam(required = false) Long departmentId) {
        
        List<DoctorResponse> doctors;
        if (departmentId != null) {
            doctors = doctorService.getDoctorsByDepartment(departmentId);
        } else {
            doctors = doctorService.getAllDoctors();
        }
        
        return ApiResponse.success(doctors);
    }
}

