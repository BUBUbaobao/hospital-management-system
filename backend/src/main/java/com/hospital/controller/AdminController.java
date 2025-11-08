package com.hospital.controller;

import com.hospital.dto.request.AddDoctorRequest;
import com.hospital.dto.request.DepartmentRequest;
import com.hospital.dto.response.*;
import com.hospital.enums.AppointmentStatus;
import com.hospital.service.AdminDepartmentService;
import com.hospital.service.AdminDoctorService;
import com.hospital.service.AdminRecordService;
import com.hospital.service.AdminStatsService;
import com.hospital.service.DoctorScheduleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
@Tag(name = "管理员接口", description = "管理员管理相关接口")
@SecurityRequirement(name = "Bearer Authentication")
public class AdminController {

    @Autowired
    private AdminDepartmentService adminDepartmentService;

    @Autowired
    private AdminDoctorService adminDoctorService;

    @Autowired
    private DoctorScheduleService doctorScheduleService;

    @Autowired
    private AdminStatsService adminStatsService;

    @Autowired
    private AdminRecordService adminRecordService;

    // ==================== 科室管理 ====================

    @Operation(summary = "查询所有科室", description = "获取所有科室列表（包括已禁用的）")
    @GetMapping("/departments")
    public ApiResponse<List<DepartmentResponse>> getAllDepartments() {
        List<DepartmentResponse> departments = adminDepartmentService.getAllDepartments();
        return ApiResponse.success(departments);
    }

    @Operation(summary = "添加科室", description = "添加新的科室")
    @PostMapping("/departments")
    public ApiResponse<DepartmentResponse> addDepartment(@Valid @RequestBody DepartmentRequest request) {
        DepartmentResponse response = adminDepartmentService.addDepartment(request);
        return ApiResponse.success(response);
    }

    @Operation(summary = "更新科室", description = "更新科室信息")
    @PutMapping("/departments/{id}")
    public ApiResponse<DepartmentResponse> updateDepartment(
            @PathVariable Long id,
            @Valid @RequestBody DepartmentRequest request) {
        DepartmentResponse response = adminDepartmentService.updateDepartment(id, request);
        return ApiResponse.success(response);
    }

    @Operation(summary = "删除科室", description = "删除指定科室")
    @DeleteMapping("/departments/{id}")
    public ApiResponse<String> deleteDepartment(@PathVariable Long id) {
        adminDepartmentService.deleteDepartment(id);
        return ApiResponse.success("删除成功");
    }

    // ==================== 医生管理 ====================

    @Operation(summary = "查询所有医生", description = "获取所有医生列表及其擅长科室")
    @GetMapping("/doctors")
    public ApiResponse<List<AdminDoctorResponse>> getAllDoctors() {
        List<AdminDoctorResponse> doctors = adminDoctorService.getAllDoctors();
        return ApiResponse.success(doctors);
    }

    @Operation(summary = "添加医生", description = "添加新的医生账号")
    @PostMapping("/doctors")
    public ApiResponse<AdminDoctorResponse> addDoctor(@Valid @RequestBody AddDoctorRequest request) {
        AdminDoctorResponse response = adminDoctorService.addDoctor(request);
        return ApiResponse.success(response);
    }

    @Operation(summary = "修改医生状态", description = "修改医生的在岗状态")
    @PutMapping("/doctors/{id}/status")
    public ApiResponse<AdminDoctorResponse> updateDoctorStatus(
            @PathVariable Long id,
            @RequestBody com.hospital.dto.request.UpdateDoctorStatusRequest request) {
        AdminDoctorResponse response = adminDoctorService.updateDoctorStatus(id, request.getStatus());
        return ApiResponse.success(response);
    }

    @Operation(summary = "删除医生", description = "删除指定医生（物理删除）")
    @DeleteMapping("/doctors/{id}")
    public ApiResponse<String> deleteDoctor(@PathVariable Long id) {
        adminDoctorService.deleteDoctor(id);
        return ApiResponse.success("删除成功");
    }

    @Operation(summary = "查看医生的时段设置", description = "管理员查看指定医生的所有在岗时段设置")
    @GetMapping("/doctors/{id}/schedules")
    public ApiResponse<List<ScheduleResponse>> getDoctorSchedules(@PathVariable Long id) {
        List<ScheduleResponse> schedules = doctorScheduleService.getDoctorSchedules(id);
        return ApiResponse.success(schedules);
    }

    // ==================== 统计分析 ====================

    @Operation(summary = "获取总体统计数据", description = "获取医生数、预约数、就诊数等总体统计")
    @GetMapping("/stats/overview")
    public ApiResponse<StatsOverviewResponse> getStatsOverview() {
        StatsOverviewResponse stats = adminStatsService.getOverview();
        return ApiResponse.success(stats);
    }

    @Operation(summary = "获取每日预约统计", description = "获取指定日期范围内的每日预约数据")
    @GetMapping("/stats/daily-appointments")
    public ApiResponse<List<DailyAppointmentStatsResponse>> getDailyAppointments(
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate) {
        List<DailyAppointmentStatsResponse> stats = adminStatsService.getDailyAppointments(startDate, endDate);
        return ApiResponse.success(stats);
    }

    @Operation(summary = "获取每日就诊统计", description = "获取指定日期范围内的每日就诊数据")
    @GetMapping("/stats/daily-visits")
    public ApiResponse<List<DailyVisitStatsResponse>> getDailyVisits(
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate) {
        List<DailyVisitStatsResponse> stats = adminStatsService.getDailyVisits(startDate, endDate);
        return ApiResponse.success(stats);
    }

    // ==================== 评分排行 ====================

    @Operation(summary = "获取医生评分排行", description = "获取医生评分排行榜，按平均分降序")
    @GetMapping("/rankings/doctors")
    public ApiResponse<List<DoctorRankingResponse>> getDoctorRankings(
            @RequestParam(defaultValue = "10") int limit) {
        List<DoctorRankingResponse> rankings = adminStatsService.getDoctorRankings(limit);
        return ApiResponse.success(rankings);
    }

    @Operation(summary = "获取科室评分排行", description = "获取科室评分排行榜，按平均分降序")
    @GetMapping("/rankings/departments")
    public ApiResponse<List<DepartmentRankingResponse>> getDepartmentRankings(
            @RequestParam(defaultValue = "10") int limit) {
        List<DepartmentRankingResponse> rankings = adminStatsService.getDepartmentRankings(limit);
        return ApiResponse.success(rankings);
    }

    @Operation(summary = "获取科室统计分布", description = "获取各科室的预约数和医生数统计")
    @GetMapping("/stats/departments")
    public ApiResponse<List<DepartmentStatsResponse>> getDepartmentStats() {
        List<DepartmentStatsResponse> stats = adminStatsService.getDepartmentStats();
        return ApiResponse.success(stats);
    }

    // ==================== 预约就诊信息查询 ====================

    @Operation(summary = "查询所有预约记录", description = "查询所有预约记录，支持按状态筛选和分页")
    @GetMapping("/appointments")
    public ApiResponse<Page<AdminAppointmentResponse>> getAllAppointments(
            @RequestParam(required = false) AppointmentStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<AdminAppointmentResponse> appointments = adminRecordService.getAllAppointments(status, pageable);
        return ApiResponse.success(appointments);
    }

    @Operation(summary = "查询所有就诊记录", description = "查询所有就诊记录，支持分页")
    @GetMapping("/visits")
    public ApiResponse<Page<AdminVisitResponse>> getAllVisits(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "visitAt"));
        Page<AdminVisitResponse> visits = adminRecordService.getAllVisits(pageable);
        return ApiResponse.success(visits);
    }

    @Operation(summary = "查询就诊详情", description = "查询指定就诊记录的详细信息")
    @GetMapping("/visits/{id}")
    public ApiResponse<AdminVisitDetailResponse> getVisitDetail(@PathVariable Long id) {
        AdminVisitDetailResponse detail = adminRecordService.getVisitDetail(id);
        return ApiResponse.success(detail);
    }
}
