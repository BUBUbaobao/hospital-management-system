package com.hospital.service;

import com.hospital.dto.request.CompleteConsultationRequest;
import com.hospital.dto.response.DoctorAppointmentResponse;
import com.hospital.entity.*;
import com.hospital.enums.AppointmentStatus;
import com.hospital.enums.VisitStatus;
import com.hospital.exception.BusinessException;
import com.hospital.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DoctorAppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private VisitRepository visitRepository;

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private VisitItemRepository visitItemRepository;

    public List<DoctorAppointmentResponse> getMyAppointments(Long doctorId) {
        List<Appointment> appointments = appointmentRepository.findByDoctorId(doctorId);

        return appointments.stream().map(this::convertToResponse).collect(Collectors.toList());
    }

    public DoctorAppointmentResponse getAppointmentDetail(Long appointmentId, Long doctorId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new BusinessException("预约记录不存在"));

        if (!appointment.getDoctorId().equals(doctorId)) {
            throw new BusinessException("无权查看该预约记录");
        }

        return convertToResponse(appointment);
    }

    @Transactional
    public Long completeConsultation(Long appointmentId, Long doctorId, CompleteConsultationRequest request) {
        // 1. 查询预约记录
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new BusinessException("预约记录不存在"));

        // 2. 校验
        if (!appointment.getDoctorId().equals(doctorId)) {
            throw new BusinessException("无权操作该预约记录");
        }

        if (appointment.getStatus() != AppointmentStatus.PENDING) {
            throw new BusinessException("该预约不是待就诊状态，无法会诊");
        }

        // 3. 查询关联实体
        Patient patient = patientRepository.findById(appointment.getPatientId())
                .orElseThrow(() -> new BusinessException("患者不存在"));
        Doctor doctor = doctorRepository.findById(appointment.getDoctorId())
                .orElseThrow(() -> new BusinessException("医生不存在"));
        Department department = departmentRepository.findById(appointment.getDepartmentId())
                .orElseThrow(() -> new BusinessException("科室不存在"));

        // 4. 创建就诊记录
        Visit visit = new Visit();
        visit.setPatient(patient);
        visit.setDoctor(doctor);
        visit.setDepartment(department);
        visit.setAppointment(appointment);
        visit.setVisitAt(LocalDateTime.now());
        visit.setDoctorAdvice(request.getAdvice());
        visit.setStatus(VisitStatus.COMPLETED);

        // 5. 计算总费用并创建就诊项目
        BigDecimal totalFee = BigDecimal.ZERO;

        for (CompleteConsultationRequest.ItemRequest itemReq : request.getItems()) {
            Item item = itemRepository.findById(itemReq.getItemId())
                    .orElseThrow(() -> new BusinessException("药品/服务项目不存在: " + itemReq.getItemId()));

            BigDecimal itemTotal = item.getPrice().multiply(new BigDecimal(itemReq.getQuantity()));
            totalFee = totalFee.add(itemTotal);

            VisitItem visitItem = new VisitItem();
            visitItem.setVisit(visit);
            visitItem.setItem(item);
            visitItem.setItemName(item.getName());
            visitItem.setQuantity(itemReq.getQuantity());
            visitItem.setUnitPrice(item.getPrice());
            visitItem.setTotalAmount(itemTotal);

            visit.getVisitItems().add(visitItem);
        }

        visit.setTotalFee(totalFee);

        // 6. 保存就诊记录
        visitRepository.save(visit);

        // 7. 更新预约状态
        appointment.setStatus(AppointmentStatus.VISITED);
        appointmentRepository.save(appointment);

        return visit.getId();
    }

    private DoctorAppointmentResponse convertToResponse(Appointment appointment) {
        DoctorAppointmentResponse response = new DoctorAppointmentResponse();
        response.setId(appointment.getId());

        // 查询患者信息
        Patient patient = patientRepository.findById(appointment.getPatientId())
                .orElseThrow(() -> new BusinessException("患者不存在"));
        response.setPatientName(patient.getRealName());
        response.setPatientAge(patient.getAge() != null ? patient.getAge().intValue() : null);
        response.setPatientPhone(patient.getPhone());

        response.setVisitAt(appointment.getVisitAt());
        response.setStatus(appointment.getStatus());
        response.setIllnessDesc(appointment.getIllnessDesc());
        response.setCreatedAt(appointment.getCreatedAt());

        // 使用预约中已存储的科室名称
        response.setDepartmentName(appointment.getDepartmentName());

        return response;
    }
}
