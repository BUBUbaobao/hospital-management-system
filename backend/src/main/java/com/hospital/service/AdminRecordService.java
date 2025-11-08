package com.hospital.service;

import com.hospital.dto.response.AdminAppointmentResponse;
import com.hospital.dto.response.AdminVisitDetailResponse;
import com.hospital.dto.response.AdminVisitResponse;
import com.hospital.entity.*;
import com.hospital.enums.AppointmentStatus;
import com.hospital.exception.BusinessException;
import com.hospital.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminRecordService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private VisitRepository visitRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private VisitItemRepository visitItemRepository;

    @Autowired
    private ItemRepository itemRepository;

    /**
     * 查询所有预约记录（分页）
     */
    public Page<AdminAppointmentResponse> getAllAppointments(AppointmentStatus status, Pageable pageable) {
        Page<Appointment> appointmentPage;

        if (status != null) {
            appointmentPage = appointmentRepository.findByStatus(status, pageable);
        } else {
            appointmentPage = appointmentRepository.findAll(pageable);
        }

        List<AdminAppointmentResponse> responses = appointmentPage.getContent().stream()
                .map(this::convertAppointmentToResponse)
                .collect(Collectors.toList());

        return new PageImpl<>(responses, pageable, appointmentPage.getTotalElements());
    }

    /**
     * 查询所有就诊记录（分页）
     */
    public Page<AdminVisitResponse> getAllVisits(Pageable pageable) {
        Page<Visit> visitPage = visitRepository.findAll(pageable);

        List<AdminVisitResponse> responses = visitPage.getContent().stream()
                .map(this::convertVisitToResponse)
                .collect(Collectors.toList());

        return new PageImpl<>(responses, pageable, visitPage.getTotalElements());
    }

    /**
     * 获取就诊详情
     */
    public AdminVisitDetailResponse getVisitDetail(Long visitId) {
        Visit visit = visitRepository.findById(visitId)
                .orElseThrow(() -> new BusinessException("就诊记录不存在"));

        // 获取关联的预约信息（获取病情描述）
        String illnessDesc = null;
        if (visit.getAppointment() != null) {
            illnessDesc = visit.getAppointment().getIllnessDesc();
        }

        // 获取就诊项目清单
        List<VisitItem> visitItems = visitItemRepository.findByVisitId(visitId);
        List<AdminVisitDetailResponse.VisitItemInfo> itemInfos = visitItems.stream()
                .map(vi -> {
                    Long itemId = vi.getItem() != null ? vi.getItem().getId() : null;
                    String itemName = vi.getItemName(); // 直接使用存储的itemName
                    return new AdminVisitDetailResponse.VisitItemInfo(
                            itemId,
                            itemName,
                            vi.getQuantity(),
                            vi.getUnitPrice(),
                            vi.getTotalAmount());
                })
                .collect(Collectors.toList());

        return new AdminVisitDetailResponse(
                visit.getId(),
                // 患者信息
                visit.getPatient() != null ? visit.getPatient().getId() : null,
                visit.getPatient() != null ? visit.getPatient().getRealName() : "未知",
                visit.getPatient() != null ? visit.getPatient().getPhone() : null,
                visit.getPatient() != null ? visit.getPatient().getAge() : null,
                visit.getPatient() != null ? visit.getPatient().getHeight() : null,
                visit.getPatient() != null ? visit.getPatient().getWeight() : null,
                // 医生和科室
                visit.getDoctor() != null ? visit.getDoctor().getId() : null,
                visit.getDoctor() != null ? visit.getDoctor().getName() : "未知",
                visit.getDepartment() != null ? visit.getDepartment().getId() : null,
                visit.getDepartment() != null ? visit.getDepartment().getName() : "未知",
                // 就诊信息
                visit.getVisitAt(),
                illnessDesc,
                visit.getDoctorAdvice(),
                visit.getTotalFee(),
                itemInfos,
                visit.getCreatedAt());
    }

    private AdminAppointmentResponse convertAppointmentToResponse(Appointment appointment) {
        // 获取患者姓名
        String patientName = "未知";
        if (appointment.getPatientId() != null) {
            Patient patient = patientRepository.findById(appointment.getPatientId()).orElse(null);
            if (patient != null) {
                patientName = patient.getRealName();
            }
        }

        return new AdminAppointmentResponse(
                appointment.getId(),
                appointment.getPatientId(),
                patientName, // 添加患者姓名
                appointment.getDoctorId(),
                appointment.getDoctorName(),
                appointment.getDepartmentId(),
                appointment.getDepartmentName(),
                appointment.getVisitAt(),
                appointment.getStatus(),
                appointment.getIllnessDesc(),
                appointment.getCreatedAt());
    }

    private AdminVisitResponse convertVisitToResponse(Visit visit) {
        return new AdminVisitResponse(
                visit.getId(),
                visit.getPatient() != null ? visit.getPatient().getId() : null,
                visit.getPatient() != null ? visit.getPatient().getRealName() : "未知",
                visit.getDoctor() != null ? visit.getDoctor().getId() : null,
                visit.getDoctor() != null ? visit.getDoctor().getName() : "未知",
                visit.getDepartment() != null ? visit.getDepartment().getId() : null,
                visit.getDepartment() != null ? visit.getDepartment().getName() : "未知",
                visit.getVisitAt(),
                visit.getTotalFee(),
                visit.getDoctorAdvice(),
                visit.getCreatedAt());
    }
}
