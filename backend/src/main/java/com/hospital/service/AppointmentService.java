package com.hospital.service;

import com.hospital.dto.request.AppointmentRequest;
import com.hospital.dto.response.AppointmentResponse;
import com.hospital.entity.Appointment;
import com.hospital.entity.Department;
import com.hospital.entity.Doctor;
import com.hospital.enums.AppointmentStatus;
import com.hospital.enums.DoctorStatus;
import com.hospital.exception.BusinessException;
import com.hospital.repository.AppointmentRepository;
import com.hospital.repository.DepartmentRepository;
import com.hospital.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private DoctorScheduleService doctorScheduleService;

    @Transactional
    public AppointmentResponse createAppointment(Long patientId, AppointmentRequest request) {
        // 验证就诊时间在1-7天范围内
        // 可以预约从明天0点开始到未来第7天的23:59:59
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime minTime = now.toLocalDate().plusDays(1).atStartOfDay(); // 明天0点
        LocalDateTime maxTime = now.toLocalDate().plusDays(7).atTime(23, 59, 59); // 7天后23:59:59

        if (request.getVisitAt().isBefore(minTime) || request.getVisitAt().isAfter(maxTime)) {
            throw new BusinessException("预约时间必须在未来1-7天范围内");
        }

        // 验证医生存在且未删除
        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new BusinessException("医生不存在"));

        if (doctor.getDeletedAt() != null) {
            throw new BusinessException("该医生已被删除");
        }

        // 验证科室存在
        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new BusinessException("科室不存在"));

        // 验证医生在该时段是否在岗（考虑管理员设置和时段设置的优先级）
        DoctorStatus actualStatus = doctorScheduleService.getDoctorActualStatus(request.getDoctorId(),
                request.getVisitAt());
        if (actualStatus == DoctorStatus.OFF_DUTY) {
            throw new BusinessException("该医生在该时段不在岗，无法预约");
        }

        // 创建预约记录
        Appointment appointment = new Appointment();
        appointment.setPatientId(patientId);
        appointment.setDoctorId(request.getDoctorId());
        appointment.setDepartmentId(request.getDepartmentId());
        appointment.setDoctorName(doctor.getName());
        appointment.setDepartmentName(department.getName());
        appointment.setVisitAt(request.getVisitAt());
        appointment.setIllnessDesc(request.getIllnessDesc());
        appointment.setStatus(AppointmentStatus.PENDING);

        appointment = appointmentRepository.save(appointment);

        return convertToResponse(appointment);
    }

    public List<AppointmentResponse> getMyAppointments(Long patientId) {
        return appointmentRepository.findByPatientIdOrderByCreatedAtDesc(patientId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void cancelAppointment(Long appointmentId, Long patientId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new BusinessException("预约记录不存在"));

        // 验证是否是患者自己的预约
        if (!appointment.getPatientId().equals(patientId)) {
            throw new BusinessException("无权操作他人的预约");
        }

        // 验证状态是否为待就诊
        if (appointment.getStatus() != AppointmentStatus.PENDING) {
            throw new BusinessException("只能退订待就诊的预约");
        }

        // 更新状态为已退号
        appointment.setStatus(AppointmentStatus.CANCELLED);
        appointmentRepository.save(appointment);
    }

    private AppointmentResponse convertToResponse(Appointment appointment) {
        return new AppointmentResponse(
                appointment.getId(),
                appointment.getDoctorName(),
                appointment.getDepartmentName(),
                appointment.getVisitAt(),
                appointment.getStatus(),
                appointment.getIllnessDesc(),
                appointment.getCreatedAt());
    }
}
