package com.hospital.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class DepartmentRequest {
    
    @NotBlank(message = "科室名称不能为空")
    @Size(max = 64, message = "科室名称不能超过64个字符")
    private String name;
    
    @Size(max = 500, message = "科室描述不能超过500个字符")
    private String description;
    
    private Boolean enabled;
}

