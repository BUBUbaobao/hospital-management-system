package com.hospital.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@Order(1)
public class StartupBanner implements CommandLineRunner {
    
    @Override
    public void run(String... args) throws Exception {
        System.out.println("\n");
        System.out.println("╔════════════════════════════════════════════════════════════════════════╗");
        System.out.println("║                    医院预约挂号系统后端服务                              ║");
        System.out.println("╚════════════════════════════════════════════════════════════════════════╝");
        System.out.println();
        System.out.println("🚀 服务启动成功！");
        System.out.println();
        System.out.println("📡 服务地址:");
        System.out.println("   • 本地访问: http://localhost:8080");
        System.out.println("   • API基础路径: http://localhost:8080/api/v1");
        System.out.println();
        System.out.println("📚 API文档 (Swagger UI):");
        System.out.println("   • 在线文档: \u001B[4;36mhttp://localhost:8080/swagger-ui/index.html\u001B[0m");
        System.out.println("   • OpenAPI JSON: http://localhost:8080/v3/api-docs");
        System.out.println();
        System.out.println("📋 主要接口:");
        System.out.println("   • 认证接口: http://localhost:8080/api/v1/auth");
        System.out.println("     - POST /auth/patient/register    患者注册");
        System.out.println("     - POST /auth/patient/login       患者登录");
        System.out.println("     - POST /auth/doctor/login        医生登录");
        System.out.println("     - POST /auth/admin/login         管理员登录");
        System.out.println("     - POST /auth/logout              退出登录");
        System.out.println();
        System.out.println("   • 患者接口: http://localhost:8080/api/v1/patient");
        System.out.println("   • 医生接口: http://localhost:8080/api/v1/doctor");
        System.out.println("   • 管理员接口: http://localhost:8080/api/v1/admin");
        System.out.println();
        System.out.println("🔐 测试账号:");
        System.out.println("   • 管理员: admin / admin123");
        System.out.println("   • 患者: 需要先注册");
        System.out.println("   • 医生: 需要管理员添加（登录需校验码: Doctor）");
        System.out.println();
        System.out.println("🌐 前端地址: http://localhost:3000");
        System.out.println();
        System.out.println("📖 详细文档请查看项目根目录的 README.md");
        System.out.println("════════════════════════════════════════════════════════════════════════");
        System.out.println();
    }
}

