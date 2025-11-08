package com.hospital.service;

import com.hospital.dto.request.ScheduleRequest;
import com.hospital.dto.response.ScheduleResponse;
import com.hospital.entity.Doctor;
import com.hospital.entity.Schedule;
import com.hospital.enums.DoctorStatus;
import com.hospital.exception.BusinessException;
import com.hospital.repository.DoctorRepository;
import com.hospital.repository.ScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DoctorScheduleService {

    @Autowired
    private ScheduleRepository scheduleRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    public List<ScheduleResponse> getMySchedules(Long doctorId) {
        List<Schedule> schedules = scheduleRepository.findByDoctorId(doctorId);
        return schedules.stream().map(this::convertToResponse).collect(Collectors.toList());
    }

    @Transactional
    public ScheduleResponse createSchedule(Long doctorId, ScheduleRequest request) {
        // 校验时间
        if (request.getEndAt().isBefore(request.getStartAt())) {
            throw new BusinessException("结束时间不能早于开始时间");
        }

        // 验证医生是否存在
        if (!doctorRepository.existsById(doctorId)) {
            throw new BusinessException("医生不存在");
        }

        Schedule schedule = new Schedule();
        schedule.setDoctorId(doctorId);
        schedule.setStartAt(request.getStartAt());
        schedule.setEndAt(request.getEndAt());
        schedule.setStatus(request.getStatus());

        scheduleRepository.save(schedule);

        return convertToResponse(schedule);
    }

    @Transactional
    public ScheduleResponse updateScheduleStatus(Long scheduleId, Long doctorId, DoctorStatus status) {
        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new BusinessException("时段记录不存在"));

        if (!schedule.getDoctorId().equals(doctorId)) {
            throw new BusinessException("无权操作该时段");
        }

        schedule.setStatus(status);
        scheduleRepository.save(schedule);

        return convertToResponse(schedule);
    }

    /**
     * 获取医生在指定时间的实际在岗状态
     * 优先级：管理员设置 > 医生时段设置
     * 
     * 逻辑规则：
     * 1. 如果管理员设置为OFF_DUTY，则无论医生如何设置时段，都是OFF_DUTY
     * 2. 如果管理员设置为ON_DUTY：
     * a. 医生未设置任何时段 → 认为全天在岗（ON_DUTY）
     * b. 医生设置了时段 → 根据预约时间是否在某个ON_DUTY时段内判断
     */
    public DoctorStatus getDoctorActualStatus(Long doctorId, LocalDateTime time) {
        // 获取医生信息（管理员设置的状态）
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new BusinessException("医生不存在"));

        // 如果管理员设置为不在岗，直接返回OFF_DUTY
        if (doctor.getStatus() == DoctorStatus.OFF_DUTY) {
            return DoctorStatus.OFF_DUTY;
        }

        // 管理员设置为在岗，检查医生的时段设置
        List<Schedule> schedules = scheduleRepository.findByDoctorId(doctorId);

        // 如果医生没有设置任何时段，认为全天在岗
        if (schedules.isEmpty()) {
            return DoctorStatus.ON_DUTY;
        }

        // 医生设置了时段，查找是否有覆盖该时间点的在岗时段
        boolean hasOnDutySchedule = schedules.stream()
                .anyMatch(schedule -> schedule.getStatus() == DoctorStatus.ON_DUTY &&
                        !time.isBefore(schedule.getStartAt()) &&
                        !time.isAfter(schedule.getEndAt()));

        return hasOnDutySchedule ? DoctorStatus.ON_DUTY : DoctorStatus.OFF_DUTY;
    }

    /**
     * 获取指定医生的所有时段（供管理员查看）
     */
    public List<ScheduleResponse> getDoctorSchedules(Long doctorId) {
        List<Schedule> schedules = scheduleRepository.findByDoctorId(doctorId);
        return schedules.stream().map(this::convertToResponse).collect(Collectors.toList());
    }

    private ScheduleResponse convertToResponse(Schedule schedule) {
        ScheduleResponse response = new ScheduleResponse();
        response.setId(schedule.getId());
        response.setStartAt(schedule.getStartAt());
        response.setEndAt(schedule.getEndAt());
        response.setStatus(schedule.getStatus());
        response.setCreatedAt(schedule.getCreatedAt());
        return response;
    }
}
