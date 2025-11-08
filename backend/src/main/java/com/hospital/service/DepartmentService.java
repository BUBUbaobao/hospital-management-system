package com.hospital.service;

import com.hospital.dto.response.DepartmentResponse;
import com.hospital.entity.Department;
import com.hospital.repository.DepartmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DepartmentService {
    
    @Autowired
    private DepartmentRepository departmentRepository;
    
    public List<DepartmentResponse> getAllEnabledDepartments() {
        return departmentRepository.findByEnabledTrue().stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
    }
    
    private DepartmentResponse convertToResponse(Department department) {
        return new DepartmentResponse(
            department.getId(),
            department.getName(),
            department.getDescription(),
            department.getEnabled()
        );
    }
}

