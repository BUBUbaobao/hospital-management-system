# 医院患者预约挂号系统 - 后端项目

## 项目简介
基于 Java 21 + Spring Boot 3.x 开发的医院预约挂号系统后端服务，提供 RESTful API 接口。

---

## 技术栈
- **语言**：Java 21
- **框架**：Spring Boot 3.x
- **安全**：Spring Security + JWT
- **数据库**：MySQL 8.0
- **ORM**：Spring Data JPA（Hibernate）
- **数据库迁移**：Flyway
- **工具库**：Lombok、MapStruct、Hutool
- **校验**：Jakarta Validation（Bean Validation）
- **日志**：Logback + SLF4J
- **构建工具**：Maven
- **JDK 版本**：JDK 21

---

## 项目结构
```
backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/hospital/
│   │   │       ├── HospitalApplication.java    # 应用入口
│   │   │       ├── controller/                 # REST API 控制器
│   │   │       │   ├── AuthController.java
│   │   │       │   ├── PatientController.java
│   │   │       │   ├── DoctorController.java
│   │   │       │   ├── AdminController.java
│   │   │       │   ├── AppointmentController.java
│   │   │       │   ├── DepartmentController.java
│   │   │       │   └── ...
│   │   │       ├── service/                    # 业务逻辑层
│   │   │       │   ├── AuthService.java
│   │   │       │   ├── AppointmentService.java
│   │   │       │   ├── DoctorService.java
│   │   │       │   └── ...
│   │   │       ├── repository/                 # 数据访问层
│   │   │       │   ├── PatientRepository.java
│   │   │       │   ├── DoctorRepository.java
│   │   │       │   ├── AppointmentRepository.java
│   │   │       │   └── ...
│   │   │       ├── entity/                     # 实体类
│   │   │       │   ├── Patient.java
│   │   │       │   ├── Doctor.java
│   │   │       │   ├── Admin.java
│   │   │       │   ├── Department.java
│   │   │       │   ├── Appointment.java
│   │   │       │   ├── Visit.java
│   │   │       │   └── ...
│   │   │       ├── dto/                        # 数据传输对象
│   │   │       │   ├── request/
│   │   │       │   │   ├── LoginRequest.java
│   │   │       │   │   ├── RegisterRequest.java
│   │   │       │   │   ├── AppointmentRequest.java
│   │   │       │   │   └── ...
│   │   │       │   └── response/
│   │   │       │       ├── LoginResponse.java
│   │   │       │       ├── AppointmentResponse.java
│   │   │       │       └── ...
│   │   │       ├── mapper/                     # 实体与DTO映射
│   │   │       │   ├── PatientMapper.java
│   │   │       │   ├── DoctorMapper.java
│   │   │       │   └── ...
│   │   │       ├── config/                     # 配置类
│   │   │       │   ├── SecurityConfig.java
│   │   │       │   ├── JwtConfig.java
│   │   │       │   ├── WebConfig.java
│   │   │       │   └── FlywayConfig.java
│   │   │       ├── security/                   # 安全相关
│   │   │       │   ├── JwtUtil.java
│   │   │       │   ├── JwtAuthenticationFilter.java
│   │   │       │   └── UserDetailsServiceImpl.java
│   │   │       ├── exception/                  # 异常处理
│   │   │       │   ├── GlobalExceptionHandler.java
│   │   │       │   ├── BusinessException.java
│   │   │       │   └── ErrorCode.java
│   │   │       ├── enums/                      # 枚举类
│   │   │       │   ├── UserRole.java
│   │   │       │   ├── AppointmentStatus.java
│   │   │       │   └── DoctorStatus.java
│   │   │       └── util/                       # 工具类
│   │   │           ├── DateUtil.java
│   │   │           └── ValidationUtil.java
│   │   └── resources/
│   │       ├── application.properties          # 主配置文件
│   │       ├── application-dev.properties      # 开发环境配置
│   │       ├── application-prod.properties     # 生产环境配置
│   │       ├── db/
│   │       │   └── migration/                  # Flyway 数据库迁移脚本
│   │       │       ├── V1__init_schema.sql
│   │       │       └── V2__init_data.sql
│   │       └── logback-spring.xml              # 日志配置
│   └── test/
│       └── java/
│           └── com/hospital/
│               ├── controller/                  # 控制器测试
│               ├── service/                     # 服务测试
│               └── repository/                  # 数据访问测试
├── pom.xml                                      # Maven 配置
└── README.md
```

---

## 快速开始

### 1. 环境准备
- **JDK 21**（必需）
- **Maven 3.8+**
- **MySQL 8.0**（已安装并运行）
- **IDE**：IntelliJ IDEA / Eclipse

### 2. 数据库初始化
在 MySQL 中执行根目录的 `init_hospital_db.sql` 脚本：
```bash
mysql -u root -p < ../init_hospital_db.sql
```

或在 Navicat 中直接执行脚本。

### 3. 配置数据库连接
编辑 `src/main/resources/application.properties`：
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/hospital?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC&characterEncoding=utf8mb4
spring.datasource.username=root
spring.datasource.password=jyh20050820
```

### 4. 启动项目
```bash
# 使用 Maven
mvn spring-boot:run

# 或打包后运行
mvn clean package
java -jar target/hospital-backend-1.0.0.jar
```

访问：`http://localhost:8080`

### 5. 测试接口
使用 Postman 或其他 HTTP 客户端测试：
- 管理员登录：`POST http://localhost:8080/api/v1/auth/admin/login`
  ```json
  {
    "account": "admin",
    "password": "admin123"
  }
  ```

---

## Maven 依赖

### pom.xml（核心依赖）
```xml
<dependencies>
    <!-- Spring Boot Web -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    
    <!-- Spring Boot Data JPA -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    
    <!-- Spring Boot Security -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    
    <!-- Spring Boot Validation -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>
    
    <!-- MySQL Driver -->
    <dependency>
        <groupId>com.mysql</groupId>
        <artifactId>mysql-connector-j</artifactId>
        <scope>runtime</scope>
    </dependency>
    
    <!-- JWT -->
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-api</artifactId>
        <version>0.12.3</version>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-impl</artifactId>
        <version>0.12.3</version>
        <scope>runtime</scope>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-jackson</artifactId>
        <version>0.12.3</version>
        <scope>runtime</scope>
    </dependency>
    
    <!-- Flyway -->
    <dependency>
        <groupId>org.flywaydb</groupId>
        <artifactId>flyway-core</artifactId>
    </dependency>
    <dependency>
        <groupId>org.flywaydb</groupId>
        <artifactId>flyway-mysql</artifactId>
    </dependency>
    
    <!-- Lombok -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <optional>true</optional>
    </dependency>
    
    <!-- MapStruct -->
    <dependency>
        <groupId>org.mapstruct</groupId>
        <artifactId>mapstruct</artifactId>
        <version>1.5.5.Final</version>
    </dependency>
    
    <!-- Test -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
```

---

## 配置文件

### application.properties
```properties
# 应用配置
spring.application.name=hospital-backend
server.port=8080

# 数据库配置
spring.datasource.url=jdbc:mysql://localhost:3306/hospital?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC&characterEncoding=utf8mb4
spring.datasource.username=root
spring.datasource.password=jyh20050820
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA 配置
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect

# Flyway 配置
spring.flyway.enabled=true
spring.flyway.locations=classpath:db/migration
spring.flyway.baseline-on-migrate=true

# Jackson 配置
spring.jackson.time-zone=UTC
spring.jackson.date-format=yyyy-MM-dd HH:mm:ss

# JWT 配置
jwt.secret=your-secret-key-at-least-256-bits-long-for-HS256-algorithm
jwt.expiration=86400000

# 日志配置
logging.level.root=INFO
logging.level.com.hospital=DEBUG
logging.pattern.console=%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n
```

---

## API 接口设计

### 基础路径
```
http://localhost:8080/api/v1
```

### 认证接口（`/auth`）
| 方法 | 路径 | 描述 | 权限 |
| --- | --- | --- | --- |
| POST | /auth/patient/register | 患者注册 | 公开 |
| POST | /auth/patient/login | 患者登录 | 公开 |
| POST | /auth/doctor/login | 医生登录 | 公开 |
| POST | /auth/admin/login | 管理员登录 | 公开 |
| POST | /auth/logout | 退出登录 | 需认证 |

### 患者接口（`/patient`）
| 方法 | 路径 | 描述 | 权限 |
| --- | --- | --- | --- |
| GET | /patient/me | 查询个人信息 | PATIENT |
| PUT | /patient/me | 更新个人信息 | PATIENT |
| GET | /patient/visits | 查询就诊记录 | PATIENT |
| POST | /patient/reviews | 提交评价 | PATIENT |

### 预约接口（`/appointments`）
| 方法 | 路径 | 描述 | 权限 |
| --- | --- | --- | --- |
| POST | /appointments | 创建预约 | PATIENT |
| GET | /appointments/mine | 查询我的预约 | PATIENT |
| DELETE | /appointments/{id} | 退号 | PATIENT |

### 医生接口（`/doctor`）
| 方法 | 路径 | 描述 | 权限 |
| --- | --- | --- | --- |
| GET | /doctor/me | 查询个人信息 | DOCTOR |
| PUT | /doctor/me | 更新个人信息 | DOCTOR |
| GET | /doctor/appointments | 查询我的预约 | DOCTOR |
| POST | /doctor/appointments/{id}/complete | 完成会诊 | DOCTOR |
| GET | /doctor/schedules | 查询在岗时段 | DOCTOR |
| POST | /doctor/schedules | 创建在岗时段 | DOCTOR |

### 管理员接口（`/admin`）
| 方法 | 路径 | 描述 | 权限 |
| --- | --- | --- | --- |
| GET | /admin/departments | 查询科室列表 | ADMIN |
| POST | /admin/departments | 创建科室 | ADMIN |
| PUT | /admin/departments/{id} | 更新科室 | ADMIN |
| DELETE | /admin/departments/{id} | 删除科室 | ADMIN |
| GET | /admin/doctors | 查询医生列表 | ADMIN |
| POST | /admin/doctors | 创建医生 | ADMIN |
| PUT | /admin/doctors/{id} | 更新医生 | ADMIN |
| DELETE | /admin/doctors/{id} | 删除医生 | ADMIN |
| GET | /admin/stats/overview | 统计概览 | ADMIN |
| GET | /admin/rankings/doctors | 医生排行 | ADMIN |

---

## JWT 认证

### JWT 工具类示例
```java
@Component
public class JwtUtil {
    @Value("${jwt.secret}")
    private String secret;
    
    @Value("${jwt.expiration}")
    private Long expiration;
    
    public String generateToken(Long userId, String role) {
        return Jwts.builder()
            .subject(userId.toString())
            .claim("role", role)
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + expiration))
            .signWith(Keys.hmacShaKeyFor(secret.getBytes()))
            .compact();
    }
    
    public Claims parseToken(String token) {
        return Jwts.parser()
            .verifyWith(Keys.hmacShaKeyFor(secret.getBytes()))
            .build()
            .parseSignedClaims(token)
            .getPayload();
    }
}
```

### Spring Security 配置示例
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/v1/auth/**").permitAll()
                .requestMatchers("/api/v1/patient/**").hasRole("PATIENT")
                .requestMatchers("/api/v1/doctor/**").hasRole("DOCTOR")
                .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
}
```

---

## 统一响应格式

### 成功响应
```json
{
  "code": 200,
  "message": "success",
  "data": { ... }
}
```

### 失败响应
```json
{
  "code": 400,
  "message": "账号或密码错误",
  "traceId": "uuid-xxx"
}
```

---

## 异常处理

### 全局异常处理器
```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ErrorResponse> handleBusinessException(BusinessException ex) {
        return ResponseEntity
            .status(ex.getErrorCode().getHttpStatus())
            .body(new ErrorResponse(ex.getErrorCode(), ex.getMessage()));
    }
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(MethodArgumentNotValidException ex) {
        // 处理校验异常
    }
}
```

---

## 数据库迁移（Flyway）

### 迁移脚本命名规则
```
V{版本号}__{描述}.sql
```

### 示例
- `V1__init_schema.sql` - 初始化表结构
- `V2__init_data.sql` - 初始化数据
- `V3__add_column_to_appointment.sql` - 添加字段

---

## 测试

### 单元测试
```bash
mvn test
```

### 集成测试
```bash
mvn verify
```

### 测试覆盖率
```bash
mvn jacoco:report
```

---

## 日志

### 日志级别
- DEBUG：开发调试信息
- INFO：业务关键信息
- WARN：警告信息
- ERROR：错误信息

### 日志示例
```java
@Slf4j
@Service
public class AppointmentService {
    public void createAppointment(AppointmentRequest request) {
        log.info("创建预约，患者ID: {}, 医生ID: {}", request.getPatientId(), request.getDoctorId());
        // 业务逻辑
    }
}
```

---

## 性能优化

### 1. 查询优化
- 使用索引
- 避免 N+1 查询
- 使用分页

### 2. 缓存策略（可选）
- Redis 缓存热点数据
- Spring Cache

### 3. 连接池配置
```properties
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=5
```

---

## 部署

### 打包
```bash
mvn clean package -DskipTests
```

### 运行
```bash
java -jar target/hospital-backend-1.0.0.jar
```

### Docker 部署（可选）
```dockerfile
FROM openjdk:21-jdk-slim
COPY target/hospital-backend-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

---

## 开发规范

### 代码规范
- 使用 Lombok 简化代码
- 使用 MapStruct 进行对象映射
- 遵循 RESTful API 设计规范

### 提交规范
```bash
git commit -m "feat: 添加患者预约接口"
git commit -m "fix: 修复医生登录校验问题"
git commit -m "docs: 更新后端 README"
```

---

## 常见问题

### 1. 端口 8080 已被占用
如果遇到端口占用错误，手动停止占用端口的进程：
```bash
# 1. 查找占用端口的进程
netstat -ano | findstr :8080

# 2. 停止进程（替换 <PID> 为实际的进程ID）
taskkill /F /PID <PID>
```

或者修改 `application.properties` 使用其他端口：
```properties
server.port=8081
```

### 2. 数据库连接失败
检查 MySQL 是否启动，账号密码是否正确。

### 3. JWT 签名失败
确保 `jwt.secret` 长度 ≥ 256 位。

---

## 参考文档
- [Spring Boot 官方文档](https://spring.io/projects/spring-boot)
- [Spring Security 文档](https://spring.io/projects/spring-security)
- [Spring Data JPA 文档](https://spring.io/projects/spring-data-jpa)
- [Flyway 文档](https://flywaydb.org/documentation/)

---

## 联系与支持
- 项目文档：查看根目录 `需求说明书.md`、`技术架构说明.md`
- 数据库设计：查看 `MySQL数据库设计.md`
- 开发计划：查看 `5天开发计划.md`

