package com.hospital.repository;

import com.hospital.entity.DoctorDepartment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DoctorDepartmentRepository extends JpaRepository<DoctorDepartment, Long> {
    List<DoctorDepartment> findByDoctorId(Long doctorId);
    List<DoctorDepartment> findByDepartmentId(Long departmentId);
}

