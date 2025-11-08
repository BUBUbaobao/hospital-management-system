package com.hospital.dto.request;

import com.hospital.enums.DoctorStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ScheduleRequest {

    @NotNull(message = "开始时间不能为空")
    private LocalDateTime startAt;

    @NotNull(message = "结束时间不能为空")
    private LocalDateTime endAt;

    @NotNull(message = "状态不能为空")
    private DoctorStatus status;
}
