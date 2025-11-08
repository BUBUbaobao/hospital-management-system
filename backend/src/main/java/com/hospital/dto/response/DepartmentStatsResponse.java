package com.hospital.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DepartmentStatsResponse {
    private Long departmentId;
    private String departmentName;
    private Long appointmentCount; // 该科室的预约数
    private Long doctorCount; // 该科室的医生数
}
