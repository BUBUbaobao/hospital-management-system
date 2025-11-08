package com.hospital.service;

import com.hospital.dto.response.VisitItemResponse;
import com.hospital.dto.response.VisitResponse;
import com.hospital.entity.Visit;
import com.hospital.exception.BusinessException;
import com.hospital.repository.VisitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PatientVisitService {

    @Autowired
    private VisitRepository visitRepository;

    public List<VisitResponse> getMyVisits(Long patientId) {
        List<Visit> visits = visitRepository.findByPatientId(patientId);
        return visits.stream().map(this::convertToResponse).collect(Collectors.toList());
    }

    public VisitResponse getVisitDetail(Long visitId, Long patientId) {
        Visit visit = visitRepository.findById(visitId)
                .orElseThrow(() -> new BusinessException("就诊记录不存在"));

        if (!visit.getPatient().getId().equals(patientId)) {
            throw new BusinessException("无权查看该就诊记录");
        }

        return convertToResponse(visit);
    }

    private VisitResponse convertToResponse(Visit visit) {
        VisitResponse response = new VisitResponse();
        response.setId(visit.getId());
        response.setDoctorId(visit.getDoctor() != null ? visit.getDoctor().getId() : null);
        response.setDoctorName(visit.getDoctor() != null ? visit.getDoctor().getName() : null);
        response.setDepartmentId(visit.getDepartment() != null ? visit.getDepartment().getId() : null);
        response.setDepartmentName(visit.getDepartment() != null ? visit.getDepartment().getName() : null);
        response.setVisitAt(visit.getVisitAt());
        response.setTotalFee(visit.getTotalFee());
        response.setDoctorAdvice(visit.getDoctorAdvice());
        response.setCreatedAt(visit.getCreatedAt());

        // 转换就诊项目
        List<VisitItemResponse> items = visit.getVisitItems().stream().map(item -> {
            VisitItemResponse itemResponse = new VisitItemResponse();
            itemResponse.setId(item.getId());
            itemResponse.setItemName(item.getItemName());
            itemResponse.setQuantity(item.getQuantity());
            itemResponse.setUnitPrice(item.getUnitPrice());
            itemResponse.setTotalAmount(item.getTotalAmount());
            return itemResponse;
        }).collect(Collectors.toList());

        response.setItems(items);

        return response;
    }
}
