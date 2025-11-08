package com.hospital.dto.response;

import com.hospital.enums.AppointmentStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminAppointmentResponse {
    private Long id;
    private Long patientId;
    private String patientName; // 新增患者姓名
    private Long doctorId;
    private String doctorName;
    private Long departmentId;
    private String departmentName;
    private LocalDateTime visitAt;
    private AppointmentStatus status;
    private String illnessDesc;
    private LocalDateTime createdAt;
}
