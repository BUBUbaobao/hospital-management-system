package com.hospital.service;

import com.hospital.dto.request.CreateReviewRequest;
import com.hospital.entity.*;
import com.hospital.enums.ReviewTarget;
import com.hospital.exception.BusinessException;
import com.hospital.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private VisitRepository visitRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Transactional
    public void createReview(Long patientId, CreateReviewRequest request) {
        // 校验：至少评价医生或科室之一
        if (request.getDoctorId() == null && request.getDepartmentId() == null) {
            throw new BusinessException("至少需要评价医生或科室之一");
        }

        // 查询就诊记录
        Visit visit = visitRepository.findById(request.getVisitId())
                .orElseThrow(() -> new BusinessException("就诊记录不存在"));

        // 校验是否是自己的就诊记录
        if (!visit.getPatient().getId().equals(patientId)) {
            throw new BusinessException("无权评价该就诊记录");
        }

        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new BusinessException("患者不存在"));

        // 评价医生
        if (request.getDoctorId() != null) {
            // 检查是否已评价
            if (reviewRepository.existsByVisitIdAndTarget(request.getVisitId(), ReviewTarget.DOCTOR)) {
                throw new BusinessException("您已评价过该医生");
            }

            Doctor doctor = doctorRepository.findById(request.getDoctorId())
                    .orElseThrow(() -> new BusinessException("医生不存在"));

            Review review = new Review();
            review.setPatient(patient);
            review.setVisit(visit);
            review.setDoctor(doctor);
            review.setTarget(ReviewTarget.DOCTOR);
            review.setScore(request.getScore().byteValue());
            review.setComment(request.getComment());

            reviewRepository.save(review);
        }

        // 评价科室
        if (request.getDepartmentId() != null) {
            // 检查是否已评价
            if (reviewRepository.existsByVisitIdAndTarget(request.getVisitId(), ReviewTarget.DEPARTMENT)) {
                throw new BusinessException("您已评价过该科室");
            }

            Department department = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new BusinessException("科室不存在"));

            Review review = new Review();
            review.setPatient(patient);
            review.setVisit(visit);
            review.setDepartment(department);
            review.setTarget(ReviewTarget.DEPARTMENT);
            review.setScore(request.getScore().byteValue());
            review.setComment(request.getComment());

            reviewRepository.save(review);
        }
    }
}
