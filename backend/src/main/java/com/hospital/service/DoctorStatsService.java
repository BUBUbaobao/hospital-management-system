package com.hospital.service;

import com.hospital.dto.response.DailyConsultationStatsResponse;
import com.hospital.dto.response.DoctorStatsResponse;
import com.hospital.entity.Appointment;
import com.hospital.entity.Review;
import com.hospital.enums.AppointmentStatus;
import com.hospital.repository.AppointmentRepository;
import com.hospital.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DoctorStatsService {

        @Autowired
        private AppointmentRepository appointmentRepository;

        @Autowired
        private ReviewRepository reviewRepository;

        /**
         * 获取医生工作统计概览
         */
        public DoctorStatsResponse getDoctorStats(Long doctorId) {
                // 今日预约数
                LocalDateTime todayStart = LocalDate.now().atStartOfDay();
                LocalDateTime todayEnd = LocalDate.now().atTime(23, 59, 59);

                List<Appointment> allAppointments = appointmentRepository.findByDoctorId(doctorId);

                long todayAppointments = allAppointments.stream()
                                .filter(apt -> !apt.getCreatedAt().isBefore(todayStart)
                                                && !apt.getCreatedAt().isAfter(todayEnd))
                                .count();

                // 本周会诊数（已就诊状态）
                LocalDateTime weekStart = LocalDate.now().minusDays(6).atStartOfDay();
                long weekConsultations = allAppointments.stream()
                                .filter(apt -> apt.getStatus() == AppointmentStatus.VISITED)
                                .filter(apt -> !apt.getCreatedAt().isBefore(weekStart))
                                .count();

                // 患者总数（去重）
                long totalPatients = allAppointments.stream()
                                .map(Appointment::getPatientId)
                                .distinct()
                                .count();

                // 平均评分
                List<Review> reviews = reviewRepository.findAll();
                double avgScore = reviews.stream()
                                .filter(review -> review.getDoctor() != null
                                                && review.getDoctor().getId().equals(doctorId))
                                .mapToInt(review -> review.getScore().intValue())
                                .average()
                                .orElse(0.0);

                // 待处理预约数
                long pendingAppointments = allAppointments.stream()
                                .filter(apt -> apt.getStatus() == AppointmentStatus.PENDING)
                                .count();

                return new DoctorStatsResponse(
                                todayAppointments,
                                weekConsultations,
                                totalPatients,
                                avgScore,
                                pendingAppointments);
        }

        /**
         * 获取最近7天预约趋势（包含所有状态）
         */
        public List<DailyConsultationStatsResponse> getDailyConsultations(Long doctorId) {
                LocalDate endDate = LocalDate.now();
                LocalDate startDate = endDate.minusDays(6);

                // 获取该医生所有预约（不过滤状态）
                List<Appointment> allAppointments = appointmentRepository.findByDoctorId(doctorId).stream()
                                .filter(apt -> {
                                        LocalDate aptDate = apt.getCreatedAt().toLocalDate();
                                        return !aptDate.isBefore(startDate) && !aptDate.isAfter(endDate);
                                })
                                .collect(Collectors.toList());

                // 按日期分组
                Map<LocalDate, List<Appointment>> groupedByDate = allAppointments.stream()
                                .collect(Collectors.groupingBy(apt -> apt.getCreatedAt().toLocalDate()));

                List<DailyConsultationStatsResponse> result = new ArrayList<>();
                for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
                        List<Appointment> dayAppointments = groupedByDate.getOrDefault(date, new ArrayList<>());

                        long total = dayAppointments.size();
                        long pending = dayAppointments.stream()
                                        .filter(apt -> apt.getStatus() == AppointmentStatus.PENDING)
                                        .count();
                        long visited = dayAppointments.stream()
                                        .filter(apt -> apt.getStatus() == AppointmentStatus.VISITED)
                                        .count();
                        long cancelled = dayAppointments.stream()
                                        .filter(apt -> apt.getStatus() == AppointmentStatus.CANCELLED)
                                        .count();

                        result.add(new DailyConsultationStatsResponse(date, total, pending, visited, cancelled));
                }

                return result;
        }
}
