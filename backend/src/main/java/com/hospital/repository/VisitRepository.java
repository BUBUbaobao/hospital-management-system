package com.hospital.repository;

import com.hospital.entity.Visit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VisitRepository extends JpaRepository<Visit, Long> {

    @Query("SELECT v FROM Visit v WHERE v.patient.id = :patientId ORDER BY v.visitAt DESC")
    List<Visit> findByPatientId(Long patientId);

    @Query("SELECT v FROM Visit v WHERE v.doctor.id = :doctorId ORDER BY v.visitAt DESC")
    List<Visit> findByDoctorId(Long doctorId);
}
