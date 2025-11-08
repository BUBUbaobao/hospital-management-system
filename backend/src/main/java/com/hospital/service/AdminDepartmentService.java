package com.hospital.service;

import com.hospital.dto.request.DepartmentRequest;
import com.hospital.dto.response.DepartmentResponse;
import com.hospital.entity.Department;
import com.hospital.exception.BusinessException;
import com.hospital.repository.DepartmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminDepartmentService {
    
    @Autowired
    private DepartmentRepository departmentRepository;
    
    public List<DepartmentResponse> getAllDepartments() {
        return departmentRepository.findAll().stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
    }
    
    @Transactional
    public DepartmentResponse addDepartment(DepartmentRequest request) {
        Department department = new Department();
        department.setName(request.getName());
        department.setDescription(request.getDescription());
        department.setEnabled(request.getEnabled() != null ? request.getEnabled() : true);
        
        department = departmentRepository.save(department);
        return convertToResponse(department);
    }
    
    @Transactional
    public DepartmentResponse updateDepartment(Long id, DepartmentRequest request) {
        Department department = departmentRepository.findById(id)
            .orElseThrow(() -> new BusinessException("科室不存在"));
        
        if (request.getName() != null) {
            department.setName(request.getName());
        }
        if (request.getDescription() != null) {
            department.setDescription(request.getDescription());
        }
        if (request.getEnabled() != null) {
            department.setEnabled(request.getEnabled());
        }
        
        department = departmentRepository.save(department);
        return convertToResponse(department);
    }
    
    @Transactional
    public void deleteDepartment(Long id) {
        if (!departmentRepository.existsById(id)) {
            throw new BusinessException("科室不存在");
        }
        departmentRepository.deleteById(id);
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

