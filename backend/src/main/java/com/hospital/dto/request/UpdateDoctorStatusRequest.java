package com.hospital.dto.request;

import com.hospital.enums.DoctorStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateDoctorStatusRequest {
    
    @NotNull(message = "状态不能为空")
    private DoctorStatus status;
}

