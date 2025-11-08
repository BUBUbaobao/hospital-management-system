package com.hospital.repository;

import com.hospital.entity.Review;
import com.hospital.enums.ReviewTarget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    @Query("SELECT r FROM Review r WHERE r.patient.id = :patientId ORDER BY r.createdAt DESC")
    List<Review> findByPatientId(Long patientId);

    @Query("SELECT r FROM Review r WHERE r.doctor.id = :doctorId AND r.target = 'DOCTOR' ORDER BY r.createdAt DESC")
    List<Review> findByDoctorId(Long doctorId);

    @Query("SELECT r FROM Review r WHERE r.department.id = :departmentId AND r.target = 'DEPARTMENT' ORDER BY r.createdAt DESC")
    List<Review> findByDepartmentId(Long departmentId);

    @Query("SELECT AVG(r.score) FROM Review r WHERE r.doctor.id = :doctorId AND r.target = 'DOCTOR'")
    Double findAvgScoreByDoctorId(Long doctorId);

    @Query("SELECT AVG(r.score) FROM Review r WHERE r.department.id = :departmentId AND r.target = 'DEPARTMENT'")
    Double findAvgScoreByDepartmentId(Long departmentId);

    boolean existsByVisitIdAndTarget(Long visitId, ReviewTarget target);
}
