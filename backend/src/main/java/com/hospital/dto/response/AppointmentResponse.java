package com.hospital.dto.response;

import com.hospital.enums.AppointmentStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentResponse {
    private Long id;
    private String doctorName;
    private String departmentName;
    private LocalDateTime visitAt;
    private AppointmentStatus status;
    private String illnessDesc;
    private LocalDateTime createdAt;
}

