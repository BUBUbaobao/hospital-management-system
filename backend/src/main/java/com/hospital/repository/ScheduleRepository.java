package com.hospital.repository;

import com.hospital.entity.Schedule;
import com.hospital.enums.DoctorStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {

    List<Schedule> findByDoctorId(Long doctorId);

    @Query("SELECT s FROM Schedule s WHERE s.doctorId = :doctorId " +
            "AND s.startAt <= :time AND s.endAt >= :time " +
            "AND s.status = :status")
    List<Schedule> findByDoctorIdAndTimeRangeAndStatus(
            @Param("doctorId") Long doctorId,
            @Param("time") LocalDateTime time,
            @Param("status") DoctorStatus status);

    List<Schedule> findByDoctorIdAndStartAtBetween(Long doctorId, LocalDateTime start, LocalDateTime end);
}
