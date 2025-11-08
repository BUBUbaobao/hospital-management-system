package com.hospital.service;

import com.hospital.dto.response.DepartmentResponse;
import com.hospital.dto.response.DoctorResponse;
import com.hospital.entity.Doctor;
import com.hospital.entity.DoctorDepartment;
import com.hospital.enums.DoctorStatus;
import com.hospital.repository.DepartmentRepository;
import com.hospital.repository.DoctorDepartmentRepository;
import com.hospital.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private DoctorDepartmentRepository doctorDepartmentRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    public List<DoctorResponse> getDoctorsByDepartment(Long departmentId) {
        // 查找该科室的所有医生关联
        List<DoctorDepartment> doctorDepartments = doctorDepartmentRepository.findByDepartmentId(departmentId);

        // 获取医生ID列表
        List<Long> doctorIds = doctorDepartments.stream()
                .map(DoctorDepartment::getDoctorId)
                .collect(Collectors.toList());

        // 查询医生详情，只返回未删除且在岗的医生
        return doctorRepository.findAllById(doctorIds).stream()
                .filter(doctor -> doctor.getDeletedAt() == null && doctor.getStatus() == DoctorStatus.ON_DUTY)
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<DoctorResponse> getAllDoctors() {
        // 只返回未删除且在岗的医生
        return doctorRepository.findAll().stream()
                .filter(doctor -> doctor.getDeletedAt() == null && doctor.getStatus() == DoctorStatus.ON_DUTY)
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    private DoctorResponse convertToResponse(Doctor doctor) {
        // 查询医生的科室
        List<DoctorDepartment> doctorDepartments = doctorDepartmentRepository.findByDoctorId(doctor.getId());
        List<Long> departmentIds = doctorDepartments.stream()
                .map(DoctorDepartment::getDepartmentId)
                .collect(Collectors.toList());

        List<DepartmentResponse> departments = departmentRepository.findAllById(departmentIds).stream()
                .map(dept -> new DepartmentResponse(dept.getId(), dept.getName(), dept.getDescription(),
                        dept.getEnabled()))
                .collect(Collectors.toList());

        return new DoctorResponse(
                doctor.getId(),
                doctor.getName(),
                doctor.getStatus(),
                doctor.getAvatarUrl(),
                departments);
    }
}
