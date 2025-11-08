package com.hospital.dto.response;

import com.hospital.enums.DoctorStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ScheduleResponse {
    private Long id;
    private LocalDateTime startAt;
    private LocalDateTime endAt;
    private DoctorStatus status;
    private LocalDateTime createdAt;
}
