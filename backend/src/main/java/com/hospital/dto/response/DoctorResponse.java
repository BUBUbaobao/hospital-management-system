package com.hospital.dto.response;

import com.hospital.enums.DoctorStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DoctorResponse {
    private Long id;
    private String name;
    private DoctorStatus status;
    private String avatarUrl;
    private List<DepartmentResponse> departments;
}

