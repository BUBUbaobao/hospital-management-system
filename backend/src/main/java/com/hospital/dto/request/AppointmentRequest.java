package com.hospital.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AppointmentRequest {
    
    @NotNull(message = "医生ID不能为空")
    private Long doctorId;
    
    @NotNull(message = "科室ID不能为空")
    private Long departmentId;
    
    @NotNull(message = "就诊时间不能为空")
    private LocalDateTime visitAt;
    
    @Size(max = 500, message = "病情描述不能超过500字")
    private String illnessDesc;
}

