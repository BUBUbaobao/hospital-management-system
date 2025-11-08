package com.hospital.service;

import com.hospital.dto.request.AddDoctorRequest;
import com.hospital.dto.response.AdminDoctorResponse;
import com.hospital.dto.response.DepartmentResponse;
import com.hospital.entity.Department;
import com.hospital.entity.Doctor;
import com.hospital.entity.DoctorDepartment;
import com.hospital.enums.DoctorStatus;
import com.hospital.exception.BusinessException;
import com.hospital.repository.DepartmentRepository;
import com.hospital.repository.DoctorDepartmentRepository;
import com.hospital.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminDoctorService {
    
    @Autowired
    private DoctorRepository doctorRepository;
    
    @Autowired
    private DoctorDepartmentRepository doctorDepartmentRepository;
    
    @Autowired
    private DepartmentRepository departmentRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    public List<AdminDoctorResponse> getAllDoctors() {
        return doctorRepository.findAll().stream()
            .filter(doctor -> doctor.getDeletedAt() == null)
            .map(this::convertToResponse)
            .collect(Collectors.toList());
    }
    
    @Transactional
    public AdminDoctorResponse addDoctor(AddDoctorRequest request) {
        // 验证账号是否已存在
        if (doctorRepository.existsByAccount(request.getAccount())) {
            throw new BusinessException("账号已存在");
        }
        
        // 验证科室是否存在
        List<Department> departments = departmentRepository.findAllById(request.getDepartmentIds());
        if (departments.size() != request.getDepartmentIds().size()) {
            throw new BusinessException("部分科室不存在");
        }
        
        // 创建医生
        Doctor doctor = new Doctor();
        doctor.setAccount(request.getAccount());
        doctor.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        doctor.setName(request.getName());
        doctor.setAvatarUrl(request.getAvatarUrl());
        
        doctor = doctorRepository.save(doctor);
        
        // 创建医生科室关联
        final Long doctorId = doctor.getId();
        List<DoctorDepartment> doctorDepartments = request.getDepartmentIds().stream()
            .map(deptId -> {
                DoctorDepartment dd = new DoctorDepartment();
                dd.setDoctorId(doctorId);
                dd.setDepartmentId(deptId);
                return dd;
            })
            .collect(Collectors.toList());
        
        doctorDepartmentRepository.saveAll(doctorDepartments);
        
        return convertToResponse(doctor);
    }
    
    @Transactional
    public AdminDoctorResponse updateDoctorStatus(Long id, DoctorStatus status) {
        Doctor doctor = doctorRepository.findById(id)
            .orElseThrow(() -> new BusinessException("医生不存在"));
        
        if (doctor.getDeletedAt() != null) {
            throw new BusinessException("该医生已被删除");
        }
        
        doctor.setStatus(status);
        doctor = doctorRepository.save(doctor);
        
        return convertToResponse(doctor);
    }
    
    @Transactional
    public void deleteDoctor(Long id) {
        Doctor doctor = doctorRepository.findById(id)
            .orElseThrow(() -> new BusinessException("医生不存在"));
        
        // 物理删除
        doctorRepository.delete(doctor);
    }
    
    private AdminDoctorResponse convertToResponse(Doctor doctor) {
        // 查询医生的科室
        List<DoctorDepartment> doctorDepartments = doctorDepartmentRepository.findByDoctorId(doctor.getId());
        List<Long> departmentIds = doctorDepartments.stream()
            .map(DoctorDepartment::getDepartmentId)
            .collect(Collectors.toList());
        
        List<DepartmentResponse> departments = departmentRepository.findAllById(departmentIds).stream()
            .map(dept -> new DepartmentResponse(dept.getId(), dept.getName(), dept.getDescription(), dept.getEnabled()))
            .collect(Collectors.toList());
        
        return new AdminDoctorResponse(
            doctor.getId(),
            doctor.getAccount(),
            doctor.getName(),
            doctor.getStatus(),
            doctor.getAvatarUrl(),
            departments
        );
    }
}

