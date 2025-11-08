package com.hospital.service;

import com.hospital.dto.response.*;
import com.hospital.entity.Appointment;
import com.hospital.entity.Department;
import com.hospital.entity.DoctorDepartment;
import com.hospital.entity.Review;
import com.hospital.entity.Visit;
import com.hospital.enums.AppointmentStatus;
import com.hospital.enums.DoctorStatus;
import com.hospital.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AdminStatsService {

        @Autowired
        private DoctorRepository doctorRepository;

        @Autowired
        private PatientRepository patientRepository;

        @Autowired
        private AppointmentRepository appointmentRepository;

        @Autowired
        private VisitRepository visitRepository;

        @Autowired
        private ReviewRepository reviewRepository;

        @Autowired
        private DepartmentRepository departmentRepository;

        @Autowired
        private DoctorDepartmentRepository doctorDepartmentRepository;

        /**
         * 获取总体统计数据
         */
        public StatsOverviewResponse getOverview() {
                // 医生统计
                long totalDoctors = doctorRepository.count();
                long onDutyDoctors = doctorRepository.findAll().stream()
                                .filter(doctor -> doctor.getDeletedAt() == null
                                                && doctor.getStatus() == DoctorStatus.ON_DUTY)
                                .count();
                long offDutyDoctors = totalDoctors - onDutyDoctors;

                // 今日预约数
                LocalDateTime todayStart = LocalDate.now().atStartOfDay();
                LocalDateTime todayEnd = LocalDate.now().atTime(23, 59, 59);
                long todayAppointments = appointmentRepository.findAll().stream()
                                .filter(apt -> !apt.getCreatedAt().isBefore(todayStart)
                                                && !apt.getCreatedAt().isAfter(todayEnd))
                                .count();

                // 今日就诊数
                long todayVisits = visitRepository.findAll().stream()
                                .filter(visit -> !visit.getVisitAt().isBefore(todayStart)
                                                && !visit.getVisitAt().isAfter(todayEnd))
                                .count();

                // 患者总数
                long totalPatients = patientRepository.count();

                return new StatsOverviewResponse(
                                totalDoctors,
                                onDutyDoctors,
                                offDutyDoctors,
                                todayAppointments,
                                todayVisits,
                                totalPatients);
        }

        /**
         * 获取每日预约统计
         */
        public List<DailyAppointmentStatsResponse> getDailyAppointments(LocalDate startDate, LocalDate endDate) {
                LocalDateTime startTime = startDate.atStartOfDay();
                LocalDateTime endTime = endDate.atTime(23, 59, 59);

                // 获取日期范围内的所有预约
                List<Appointment> appointments = appointmentRepository.findAll().stream()
                                .filter(apt -> !apt.getCreatedAt().isBefore(startTime)
                                                && !apt.getCreatedAt().isAfter(endTime))
                                .collect(Collectors.toList());

                // 按日期分组统计
                Map<LocalDate, List<Appointment>> groupedByDate = appointments.stream()
                                .collect(Collectors.groupingBy(apt -> apt.getCreatedAt().toLocalDate()));

                List<DailyAppointmentStatsResponse> result = new ArrayList<>();
                for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
                        List<Appointment> dayAppointments = groupedByDate.getOrDefault(date, new ArrayList<>());

                        long total = dayAppointments.size();
                        long pending = dayAppointments.stream()
                                        .filter(apt -> apt.getStatus() == AppointmentStatus.PENDING).count();
                        long visited = dayAppointments.stream()
                                        .filter(apt -> apt.getStatus() == AppointmentStatus.VISITED).count();
                        long cancelled = dayAppointments.stream()
                                        .filter(apt -> apt.getStatus() == AppointmentStatus.CANCELLED)
                                        .count();

                        result.add(new DailyAppointmentStatsResponse(date, total, pending, visited, cancelled));
                }

                return result;
        }

        /**
         * 获取每日就诊统计
         */
        public List<DailyVisitStatsResponse> getDailyVisits(LocalDate startDate, LocalDate endDate) {
                LocalDateTime startTime = startDate.atStartOfDay();
                LocalDateTime endTime = endDate.atTime(23, 59, 59);

                // 获取日期范围内的所有就诊记录
                List<Visit> visits = visitRepository.findAll().stream()
                                .filter(visit -> !visit.getVisitAt().isBefore(startTime)
                                                && !visit.getVisitAt().isAfter(endTime))
                                .collect(Collectors.toList());

                // 按日期分组统计
                Map<LocalDate, List<Visit>> groupedByDate = visits.stream()
                                .collect(Collectors.groupingBy(visit -> visit.getVisitAt().toLocalDate()));

                List<DailyVisitStatsResponse> result = new ArrayList<>();
                for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
                        List<Visit> dayVisits = groupedByDate.getOrDefault(date, new ArrayList<>());

                        long total = dayVisits.size();
                        BigDecimal totalFee = dayVisits.stream()
                                        .map(Visit::getTotalFee)
                                        .reduce(BigDecimal.ZERO, BigDecimal::add);

                        result.add(new DailyVisitStatsResponse(date, total, totalFee));
                }

                return result;
        }

        /**
         * 获取医生评分排行
         */
        public List<DoctorRankingResponse> getDoctorRankings(int limit) {
                // 使用原生SQL或JPQL会更高效，这里为简化使用Stream
                var reviews = reviewRepository.findAll();

                // 按医生分组并计算平均分
                Map<Long, List<Byte>> doctorScores = reviews.stream()
                                .filter(review -> review.getDoctor() != null)
                                .collect(Collectors.groupingBy(
                                                review -> review.getDoctor().getId(),
                                                Collectors.mapping(Review::getScore, Collectors.toList())));

                List<DoctorRankingResponse> rankings = new ArrayList<>();
                for (Map.Entry<Long, List<Byte>> entry : doctorScores.entrySet()) {
                        Long doctorId = entry.getKey();
                        List<Byte> scores = entry.getValue();

                        double avgScore = scores.stream().mapToInt(Byte::intValue).average().orElse(0.0);
                        long reviewCount = scores.size();

                        doctorRepository.findById(doctorId).ifPresent(doctor -> {
                                rankings.add(new DoctorRankingResponse(doctorId, doctor.getName(), avgScore,
                                                reviewCount));
                        });
                }

                // 按平均分降序排序，取前limit个
                return rankings.stream()
                                .sorted((a, b) -> Double.compare(b.getAvgScore(), a.getAvgScore()))
                                .limit(limit)
                                .collect(Collectors.toList());
        }

        /**
         * 获取科室评分排行
         */
        public List<DepartmentRankingResponse> getDepartmentRankings(int limit) {
                var reviews = reviewRepository.findAll();

                // 按科室分组并计算平均分
                Map<Long, List<Byte>> departmentScores = reviews.stream()
                                .filter(review -> review.getDepartment() != null)
                                .collect(Collectors.groupingBy(
                                                review -> review.getDepartment().getId(),
                                                Collectors.mapping(Review::getScore, Collectors.toList())));

                List<DepartmentRankingResponse> rankings = new ArrayList<>();
                for (Map.Entry<Long, List<Byte>> entry : departmentScores.entrySet()) {
                        Long departmentId = entry.getKey();
                        List<Byte> scores = entry.getValue();

                        double avgScore = scores.stream().mapToInt(Byte::intValue).average().orElse(0.0);
                        long reviewCount = scores.size();

                        departmentRepository.findById(departmentId).ifPresent(department -> {
                                rankings.add(new DepartmentRankingResponse(departmentId, department.getName(), avgScore,
                                                reviewCount));
                        });
                }

                // 按平均分降序排序，取前limit个
                return rankings.stream()
                                .sorted((a, b) -> Double.compare(b.getAvgScore(), a.getAvgScore()))
                                .limit(limit)
                                .collect(Collectors.toList());
        }

        /**
         * 获取科室统计分布
         */
        public List<DepartmentStatsResponse> getDepartmentStats() {
                // 获取所有科室
                List<Department> departments = departmentRepository.findAll();

                // 获取所有预约
                List<Appointment> allAppointments = appointmentRepository.findAll();

                // 获取所有医生科室关联
                List<DoctorDepartment> allDoctorDepartments = doctorDepartmentRepository.findAll();

                return departments.stream()
                                .filter(dept -> dept.getEnabled() != null && dept.getEnabled())
                                .map(dept -> {
                                        // 统计该科室的预约数
                                        long appointmentCount = allAppointments.stream()
                                                        .filter(apt -> dept.getId().equals(apt.getDepartmentId()))
                                                        .count();

                                        // 统计该科室的医生数
                                        long doctorCount = allDoctorDepartments.stream()
                                                        .filter(dd -> dept.getId().equals(dd.getDepartmentId()))
                                                        .map(DoctorDepartment::getDoctorId)
                                                        .distinct()
                                                        .count();

                                        return new DepartmentStatsResponse(
                                                        dept.getId(),
                                                        dept.getName(),
                                                        appointmentCount,
                                                        doctorCount);
                                })
                                .collect(Collectors.toList());
        }
}
