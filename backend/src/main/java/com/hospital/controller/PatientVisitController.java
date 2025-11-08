package com.hospital.controller;

import com.hospital.dto.request.CreateReviewRequest;
import com.hospital.dto.response.ApiResponse;
import com.hospital.dto.response.VisitResponse;
import com.hospital.service.PatientVisitService;
import com.hospital.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/patient")
@Tag(name = "患者就诊接口", description = "患者端就诊记录和评价相关接口")
@SecurityRequirement(name = "Bearer Authentication")
public class PatientVisitController {

    @Autowired
    private PatientVisitService patientVisitService;

    @Autowired
    private ReviewService reviewService;

    @Operation(summary = "查询我的就诊记录", description = "查询当前患者的所有就诊记录")
    @GetMapping("/visits")
    public ApiResponse<List<VisitResponse>> getMyVisits(Authentication auth) {
        Long patientId = Long.parseLong(auth.getName());
        List<VisitResponse> visits = patientVisitService.getMyVisits(patientId);
        return ApiResponse.success(visits);
    }

    @Operation(summary = "查询就诊详情", description = "查询指定就诊记录的详细信息")
    @GetMapping("/visits/{id}")
    public ApiResponse<VisitResponse> getVisitDetail(
            @PathVariable Long id,
            Authentication auth) {
        Long patientId = Long.parseLong(auth.getName());
        VisitResponse visit = patientVisitService.getVisitDetail(id, patientId);
        return ApiResponse.success(visit);
    }

    @Operation(summary = "提交评价", description = "对医生或科室进行评价")
    @PostMapping("/reviews")
    public ApiResponse<String> createReview(
            @Valid @RequestBody CreateReviewRequest request,
            Authentication auth) {
        Long patientId = Long.parseLong(auth.getName());
        reviewService.createReview(patientId, request);
        return ApiResponse.success("评价成功");
    }
}
