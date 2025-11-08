package com.hospital.dto.response;

import com.hospital.enums.AppointmentStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class DoctorAppointmentResponse {
    private Long id;
    private String patientName;
    private Integer patientAge;
    private String patientPhone;
    private LocalDateTime visitAt;
    private AppointmentStatus status;
    private String illnessDesc;
    private LocalDateTime createdAt;
    private String departmentName;
}
