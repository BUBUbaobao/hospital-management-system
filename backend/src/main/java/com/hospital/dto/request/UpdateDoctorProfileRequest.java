package com.hospital.dto.request;

import lombok.Data;
import java.util.List;

@Data
public class UpdateDoctorProfileRequest {
    private String name;
    private List<Long> departmentIds;
    private String avatarUrl;
}
