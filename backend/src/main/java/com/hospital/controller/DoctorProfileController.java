package com.hospital.controller;

import com.hospital.dto.request.UpdateDoctorProfileRequest;
import com.hospital.dto.response.ApiResponse;
import com.hospital.dto.response.DepartmentResponse;
import com.hospital.dto.response.DoctorProfileResponse;
import com.hospital.entity.Doctor;
import com.hospital.entity.DoctorDepartment;
import com.hospital.exception.BusinessException;
import com.hospital.repository.DepartmentRepository;
import com.hospital.repository.DoctorDepartmentRepository;
import com.hospital.repository.DoctorRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/doctor")
@Tag(name = "医生个人信息接口", description = "医生端个人信息管理相关接口")
@SecurityRequirement(name = "Bearer Authentication")
public class DoctorProfileController {

        @Autowired
        private DoctorRepository doctorRepository;

        @Autowired
        private DoctorDepartmentRepository doctorDepartmentRepository;

        @Autowired
        private DepartmentRepository departmentRepository;

        @Operation(summary = "查询个人信息", description = "获取当前医生的个人信息")
        @GetMapping("/me")
        public ApiResponse<DoctorProfileResponse> getMyProfile(Authentication auth) {
                Long doctorId = Long.parseLong(auth.getName());
                Doctor doctor = doctorRepository.findById(doctorId)
                                .orElseThrow(() -> new BusinessException("医生不存在"));

                // 查询医生的科室
                List<DoctorDepartment> doctorDepartments = doctorDepartmentRepository.findByDoctorId(doctorId);
                List<Long> departmentIds = doctorDepartments.stream()
                                .map(DoctorDepartment::getDepartmentId)
                                .collect(Collectors.toList());

                List<DepartmentResponse> departments = departmentRepository.findAllById(departmentIds).stream()
                                .map(dept -> new DepartmentResponse(dept.getId(), dept.getName(), dept.getDescription(),
                                                dept.getEnabled()))
                                .collect(Collectors.toList());

                DoctorProfileResponse response = new DoctorProfileResponse(
                                doctor.getId(),
                                doctor.getAccount(),
                                doctor.getName(),
                                doctor.getStatus(),
                                doctor.getAvatarUrl(),
                                departments);

                return ApiResponse.success(response);
        }

        @Operation(summary = "更新个人信息", description = "更新医生的姓名、擅长科室、头像")
        @PutMapping("/me")
        @Transactional
        public ApiResponse<DoctorProfileResponse> updateMyProfile(
                        @Valid @RequestBody UpdateDoctorProfileRequest request,
                        Authentication auth) {
                Long doctorId = Long.parseLong(auth.getName());
                Doctor doctor = doctorRepository.findById(doctorId)
                                .orElseThrow(() -> new BusinessException("医生不存在"));

                // 更新基本信息
                if (request.getName() != null && !request.getName().isEmpty()) {
                        doctor.setName(request.getName());
                }
                if (request.getAvatarUrl() != null) {
                        doctor.setAvatarUrl(request.getAvatarUrl());
                }

                doctor = doctorRepository.save(doctor);

                // 更新科室关联（如果提供了科室ID列表）
                if (request.getDepartmentIds() != null) {
                        // 获取当前的科室ID列表
                        List<DoctorDepartment> currentDepartments = doctorDepartmentRepository.findByDoctorId(doctorId);
                        List<Long> currentDeptIds = currentDepartments.stream()
                                        .map(DoctorDepartment::getDepartmentId)
                                        .collect(Collectors.toList());

                        List<Long> newDeptIds = request.getDepartmentIds().stream()
                                        .distinct()
                                        .collect(Collectors.toList());

                        // 找出需要删除的（在旧列表中但不在新列表中）
                        List<DoctorDepartment> toDelete = currentDepartments.stream()
                                        .filter(dd -> !newDeptIds.contains(dd.getDepartmentId()))
                                        .collect(Collectors.toList());

                        // 找出需要添加的（在新列表中但不在旧列表中）
                        List<Long> toAdd = newDeptIds.stream()
                                        .filter(deptId -> !currentDeptIds.contains(deptId))
                                        .collect(Collectors.toList());

                        // 删除不需要的关联
                        if (!toDelete.isEmpty()) {
                                doctorDepartmentRepository.deleteAll(toDelete);
                        }

                        // 添加新的关联
                        if (!toAdd.isEmpty()) {
                                List<DoctorDepartment> newDepartments = toAdd.stream()
                                                .map(deptId -> {
                                                        DoctorDepartment dd = new DoctorDepartment();
                                                        dd.setDoctorId(doctorId);
                                                        dd.setDepartmentId(deptId);
                                                        return dd;
                                                })
                                                .collect(Collectors.toList());
                                doctorDepartmentRepository.saveAll(newDepartments);
                        }
                }

                // 查询最新的科室信息
                List<DoctorDepartment> doctorDepartments = doctorDepartmentRepository.findByDoctorId(doctorId);
                List<Long> departmentIds = doctorDepartments.stream()
                                .map(DoctorDepartment::getDepartmentId)
                                .collect(Collectors.toList());

                List<DepartmentResponse> departments = departmentRepository.findAllById(departmentIds).stream()
                                .map(dept -> new DepartmentResponse(dept.getId(), dept.getName(), dept.getDescription(),
                                                dept.getEnabled()))
                                .collect(Collectors.toList());

                DoctorProfileResponse response = new DoctorProfileResponse(
                                doctor.getId(),
                                doctor.getAccount(),
                                doctor.getName(),
                                doctor.getStatus(),
                                doctor.getAvatarUrl(),
                                departments);

                return ApiResponse.success(response);
        }
}
