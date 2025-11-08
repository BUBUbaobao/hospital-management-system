package com.hospital.service;

import com.hospital.dto.request.DoctorLoginRequest;
import com.hospital.dto.request.LoginRequest;
import com.hospital.dto.request.PatientRegisterRequest;
import com.hospital.dto.response.LoginResponse;
import com.hospital.entity.Admin;
import com.hospital.entity.Doctor;
import com.hospital.entity.Patient;
import com.hospital.enums.UserRole;
import com.hospital.exception.BusinessException;
import com.hospital.repository.AdminRepository;
import com.hospital.repository.DoctorRepository;
import com.hospital.repository.PatientRepository;
import com.hospital.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {
    
    @Autowired
    private PatientRepository patientRepository;
    
    @Autowired
    private DoctorRepository doctorRepository;
    
    @Autowired
    private AdminRepository adminRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Transactional
    public void patientRegister(PatientRegisterRequest request) {
        // 验证密码一致性
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new BusinessException("两次密码输入不一致");
        }
        
        // 验证账号是否已存在
        if (patientRepository.existsByAccount(request.getAccount())) {
            throw new BusinessException("账号已存在");
        }
        
        // 创建患者
        Patient patient = new Patient();
        patient.setAccount(request.getAccount());
        patient.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        patient.setRealName(request.getRealName());
        patient.setPhone(request.getPhone());
        
        patientRepository.save(patient);
    }
    
    public LoginResponse patientLogin(LoginRequest request) {
        Patient patient = patientRepository.findByAccount(request.getAccount())
                .orElseThrow(() -> new BusinessException("账号或密码错误"));
        
        if (!passwordEncoder.matches(request.getPassword(), patient.getPasswordHash())) {
            throw new BusinessException("账号或密码错误");
        }
        
        String token = jwtUtil.generateToken(patient.getId(), UserRole.PATIENT, patient.getRealName());
        return new LoginResponse(token, UserRole.PATIENT, patient.getId(), patient.getRealName());
    }
    
    public LoginResponse doctorLogin(DoctorLoginRequest request) {
        // 验证校验码
        if (!"Doctor".equals(request.getVerifyCode())) {
            throw new BusinessException("校验码错误");
        }
        
        Doctor doctor = doctorRepository.findByAccount(request.getAccount())
                .orElseThrow(() -> new BusinessException("账号或密码错误"));
        
        if (!passwordEncoder.matches(request.getPassword(), doctor.getPasswordHash())) {
            throw new BusinessException("账号或密码错误");
        }
        
        if (doctor.getDeletedAt() != null) {
            throw new BusinessException("该医生账号已被删除");
        }
        
        String token = jwtUtil.generateToken(doctor.getId(), UserRole.DOCTOR, doctor.getName());
        return new LoginResponse(token, UserRole.DOCTOR, doctor.getId(), doctor.getName());
    }
    
    public LoginResponse adminLogin(LoginRequest request) {
        Admin admin = adminRepository.findByAccount(request.getAccount())
                .orElseThrow(() -> new BusinessException("账号或密码错误"));
        
        if (!passwordEncoder.matches(request.getPassword(), admin.getPasswordHash())) {
            throw new BusinessException("账号或密码错误");
        }
        
        String token = jwtUtil.generateToken(admin.getId(), UserRole.ADMIN, "管理员");
        return new LoginResponse(token, UserRole.ADMIN, admin.getId(), "管理员");
    }
}

