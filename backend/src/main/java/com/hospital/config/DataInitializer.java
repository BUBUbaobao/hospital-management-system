package com.hospital.config;

import com.hospital.entity.Admin;
import com.hospital.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@Order(0)
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private AdminRepository adminRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        // 检查并初始化管理员账号
        adminRepository.findByAccount("admin").ifPresentOrElse(
            admin -> {
                // 管理员已存在，更新密码哈希以确保正确
                String newHash = passwordEncoder.encode("admin123");
                admin.setPasswordHash(newHash);
                adminRepository.save(admin);
                System.out.println("✅ 管理员账号密码已更新");
            },
            () -> {
                // 管理员不存在，创建新的
                Admin admin = new Admin();
                admin.setAccount("admin");
                admin.setPasswordHash(passwordEncoder.encode("admin123"));
                adminRepository.save(admin);
                System.out.println("✅ 管理员账号初始化成功");
            }
        );
    }
}

