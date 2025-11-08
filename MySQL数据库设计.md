## 医院患者预约挂号系统 - MySQL 数据库设计

文档版本：v1.0  
编制日期：2025-10-31  
依据文档：`需求说明书.md`、`技术架构说明.md`

---

## 1. 数据库概述

### 1.1 基础信息
- **数据库名称**：`hospital`
- **数据库版本**：MySQL 8.0
- **字符集**：utf8mb4
- **排序规则**：utf8mb4_unicode_ci
- **存储引擎**：InnoDB
- **连接信息**：
  - 地址：localhost:3306
  - 账号：root
  - 密码：jyh20050820

### 1.2 设计原则
- 遵循第三范式（3NF），避免数据冗余
- 关键业务表添加适当索引，提升查询性能
- 使用外键约束保证数据完整性（或通过应用层控制）
- 敏感字段（密码）存储加密后的哈希值
- 时间字段统一使用 DATETIME 类型，应用层处理时区
- 软删除与硬删除混合使用（根据业务需求）

---

## 2. ER 图（实体关系概览）

```
患者(patients) 1────n 预约(appointments) n────1 医生(doctors)
                              │                      │
                              │                      │
                              n                      n
                              │                      │
                              1                      1
                         科室(departments)    医生科室关联(doctor_departments)
                              │                      │
                              └──────────────────────┘

预约(appointments) 1────1 就诊记录(visits) n────n 药品服务项目(items)
                                                  通过 visit_items 关联

患者(patients) 1────n 评价(reviews) n────1 医生(doctors) | 科室(departments)

医生(doctors) 1────n 在岗时段(schedules)

预约(appointments) 1────n 提醒(reminders)

管理员(admins) - 独立表
```

---

## 3. 数据表设计

### 3.1 患者表（patients）

**功能说明**：存储患者基础信息，支持注册、登录、个人信息维护

```sql
CREATE TABLE patients (
  id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '患者ID',
  account VARCHAR(64) NOT NULL UNIQUE COMMENT '登录账号',
  password_hash VARCHAR(255) NOT NULL COMMENT '密码哈希（BCrypt）',
  real_name VARCHAR(64) NOT NULL COMMENT '真实姓名（系统昵称）',
  phone VARCHAR(11) NOT NULL COMMENT '手机号（11位）',
  age TINYINT UNSIGNED COMMENT '年龄（选填）',
  height DECIMAL(5,2) COMMENT '身高（cm，选填）',
  weight DECIMAL(5,2) COMMENT '体重（kg，选填）',
  avatar_url VARCHAR(255) COMMENT '头像路径',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '注册时间',
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX idx_account (account),
  INDEX idx_phone (phone),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='患者表';
```

**字段说明**：
- `account`：登录账号，唯一约束
- `password_hash`：使用 BCrypt 加密存储
- `real_name`：注册时必填，作为系统昵称
- `phone`：11 位手机号，注册时校验
- `age/height/weight`：选填字段，允许 NULL
- `avatar_url`：本地文件路径

---

### 3.2 医生表（doctors）

**功能说明**：存储医生基础信息，由管理员添加，支持在岗状态管理

```sql
CREATE TABLE doctors (
  id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '医生ID',
  account VARCHAR(64) NOT NULL UNIQUE COMMENT '登录账号',
  password_hash VARCHAR(255) NOT NULL COMMENT '密码哈希（BCrypt）',
  name VARCHAR(64) NOT NULL COMMENT '医生姓名',
  status ENUM('ON_DUTY', 'OFF_DUTY') NOT NULL DEFAULT 'ON_DUTY' COMMENT '在岗状态',
  avatar_url VARCHAR(255) COMMENT '头像路径',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  deleted_at DATETIME COMMENT '删除时间（NULL表示未删除）',
  INDEX idx_account (account),
  INDEX idx_status (status),
  INDEX idx_deleted (deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='医生表';
```

**字段说明**：
- `status`：在岗(ON_DUTY)/不在岗(OFF_DUTY)
- `deleted_at`：软删除标记（需求要求物理删除，可改为硬删除或保留快照）

---

### 3.3 管理员表（admins）

**功能说明**：存储管理员信息，系统预置唯一管理员

```sql
CREATE TABLE admins (
  id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '管理员ID',
  account VARCHAR(64) NOT NULL UNIQUE COMMENT '登录账号',
  password_hash VARCHAR(255) NOT NULL COMMENT '密码哈希（BCrypt）',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='管理员表';
```

**初始数据**：
```sql
INSERT INTO admins (account, password_hash) VALUES 
('admin', '$2a$10$...');  -- 密码：admin123，需在应用层加密后插入
```

---

### 3.4 科室表（departments）

**功能说明**：存储医院科室信息，支持管理员增删改

```sql
CREATE TABLE departments (
  id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '科室ID',
  name VARCHAR(64) NOT NULL UNIQUE COMMENT '科室名称',
  description VARCHAR(500) COMMENT '科室描述',
  enabled TINYINT(1) NOT NULL DEFAULT 1 COMMENT '是否启用（1启用/0禁用）',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX idx_name (name),
  INDEX idx_enabled (enabled)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='科室表';
```

**初始数据**：
```sql
INSERT INTO departments (name, description, enabled) VALUES 
('儿科', '专注于儿童健康与疾病诊治', 1),
('口腔科', '口腔疾病诊断与治疗', 1),
('内科', '内科常见病与慢性病诊治', 1),
('外科', '外科手术与创伤处理', 1);
```

---

### 3.5 医生科室关联表（doctor_departments）

**功能说明**：多对多关系，医生可擅长多个科室

```sql
CREATE TABLE doctor_departments (
  id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '关联ID',
  doctor_id BIGINT NOT NULL COMMENT '医生ID',
  department_id BIGINT NOT NULL COMMENT '科室ID',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  UNIQUE KEY uk_doctor_dept (doctor_id, department_id),
  INDEX idx_doctor (doctor_id),
  INDEX idx_department (department_id),
  CONSTRAINT fk_dd_doctor FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
  CONSTRAINT fk_dd_department FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='医生科室关联表';
```

**业务规则**：
- 科室删除时，级联删除关联关系
- 医生删除时，级联删除关联关系

---

### 3.6 在岗时段表（schedules）

**功能说明**：医生设置在岗/不在岗时段

```sql
CREATE TABLE schedules (
  id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '时段ID',
  doctor_id BIGINT NOT NULL COMMENT '医生ID',
  start_at DATETIME NOT NULL COMMENT '开始时间',
  end_at DATETIME NOT NULL COMMENT '结束时间',
  status ENUM('ON_DUTY', 'OFF_DUTY') NOT NULL DEFAULT 'ON_DUTY' COMMENT '时段状态',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX idx_doctor_time (doctor_id, start_at, end_at),
  INDEX idx_status (status),
  CONSTRAINT fk_schedule_doctor FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='在岗时段表';
```

**业务规则**：
- 不在岗时段的医生不可被预约
- 时段可重叠，应用层需处理冲突

---

### 3.7 预约表（appointments）

**功能说明**：核心业务表，存储患者预约记录

```sql
CREATE TABLE appointments (
  id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '预约ID',
  patient_id BIGINT NOT NULL COMMENT '患者ID',
  doctor_id BIGINT COMMENT '医生ID（可为空，医生删除时保留历史）',
  department_id BIGINT COMMENT '科室ID（可为空，科室删除时保留历史）',
  doctor_name VARCHAR(64) COMMENT '医生姓名快照',
  department_name VARCHAR(64) COMMENT '科室名称快照',
  visit_at DATETIME NOT NULL COMMENT '就诊时间',
  status ENUM('PENDING', 'VISITED', 'CANCELLED') NOT NULL DEFAULT 'PENDING' COMMENT '预约状态',
  illness_desc VARCHAR(500) COMMENT '病情描述',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '预约创建时间',
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX idx_patient (patient_id, created_at),
  INDEX idx_doctor_visit (doctor_id, visit_at),
  INDEX idx_status (status),
  INDEX idx_visit_at (visit_at),
  CONSTRAINT fk_appt_patient FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  CONSTRAINT fk_appt_doctor FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE SET NULL,
  CONSTRAINT fk_appt_department FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL,
  CONSTRAINT chk_visit_time CHECK (visit_at > created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='预约表';
```

**字段说明**：
- `status`：待就诊(PENDING)/已就诊(VISITED)/已退号(CANCELLED)
- `visit_at`：就诊时间，需在未来 1-7 天范围内（应用层校验）
- `illness_desc`：患者填写的病情描述
- `doctor_id` 和 `department_id`：允许为 NULL，当医生或科室被删除时，外键自动置空
- `doctor_name` 和 `department_name`：快照字段，预约创建时保存医生和科室名称，防止删除后丢失历史信息

**业务规则**：
- 患者可退号，状态变更为 CANCELLED
- 医生完成会诊后，状态变更为 VISITED
- 医生或科室删除时，历史预约记录通过快照字段保留名称信息

---

### 3.8 就诊记录表（visits）

**功能说明**：存储就诊完成后的详细记录

```sql
CREATE TABLE visits (
  id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '就诊记录ID',
  appointment_id BIGINT NOT NULL UNIQUE COMMENT '关联预约ID',
  fee DECIMAL(10,2) NOT NULL DEFAULT 0 COMMENT '费用（元）',
  doctor_advice TEXT COMMENT '医生建议',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '就诊完成时间',
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX idx_appointment (appointment_id),
  INDEX idx_created (created_at),
  CONSTRAINT fk_visit_appointment FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='就诊记录表';
```

**业务规则**：
- 一次预约对应一条就诊记录（1:1）
- 费用为医生添加的药品服务汇总

---

### 3.9 药品服务项目表（items）

**功能说明**：存储药品与服务项目，供医生会诊时添加

```sql
CREATE TABLE items (
  id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '项目ID',
  name VARCHAR(128) NOT NULL COMMENT '项目名称',
  price DECIMAL(10,2) NOT NULL COMMENT '单价（元）',
  type ENUM('DRUG', 'SERVICE') NOT NULL COMMENT '类型（DRUG药品/SERVICE服务）',
  enabled TINYINT(1) NOT NULL DEFAULT 1 COMMENT '是否启用',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX idx_type (type),
  INDEX idx_enabled (enabled)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='药品服务项目表';
```

**示例数据**：
```sql
INSERT INTO items (name, price, type, enabled) VALUES 
('阿莫西林胶囊', 15.50, 'DRUG', 1),
('布洛芬片', 8.00, 'DRUG', 1),
('血常规检查', 25.00, 'SERVICE', 1),
('心电图检查', 50.00, 'SERVICE', 1);
```

---

### 3.10 就诊项目关联表（visit_items）

**功能说明**：多对多关系，一次就诊可包含多个药品/服务

```sql
CREATE TABLE visit_items (
  id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '关联ID',
  visit_id BIGINT NOT NULL COMMENT '就诊记录ID',
  item_id BIGINT NOT NULL COMMENT '项目ID',
  quantity INT NOT NULL DEFAULT 1 COMMENT '数量',
  amount DECIMAL(10,2) NOT NULL COMMENT '小计（单价×数量）',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  INDEX idx_visit (visit_id),
  INDEX idx_item (item_id),
  CONSTRAINT fk_vi_visit FOREIGN KEY (visit_id) REFERENCES visits(id) ON DELETE CASCADE,
  CONSTRAINT fk_vi_item FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='就诊项目关联表';
```

---

### 3.11 评价表（reviews）

**功能说明**：患者对医生/科室的评分（1-10 分）

```sql
CREATE TABLE reviews (
  id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '评价ID',
  patient_id BIGINT NOT NULL COMMENT '患者ID',
  doctor_id BIGINT COMMENT '医生ID（评价医生时填写）',
  department_id BIGINT COMMENT '科室ID（评价科室时填写）',
  visit_id BIGINT COMMENT '关联就诊记录ID（可选）',
  score TINYINT NOT NULL COMMENT '评分（1-10）',
  comment VARCHAR(500) COMMENT '评价内容（可选）',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '评价时间',
  INDEX idx_patient (patient_id),
  INDEX idx_doctor (doctor_id),
  INDEX idx_department (department_id),
  INDEX idx_visit (visit_id),
  INDEX idx_created (created_at),
  CONSTRAINT fk_review_patient FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  CONSTRAINT fk_review_doctor FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
  CONSTRAINT fk_review_department FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE,
  CONSTRAINT fk_review_visit FOREIGN KEY (visit_id) REFERENCES visits(id) ON DELETE SET NULL,
  CONSTRAINT chk_score CHECK (score BETWEEN 1 AND 10),
  CONSTRAINT chk_target CHECK ((doctor_id IS NOT NULL) OR (department_id IS NOT NULL))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='评价表';
```

**业务规则**：
- `doctor_id` 和 `department_id` 至少填写一个
- 评分范围 1-10 分

---

### 3.12 提醒表（reminders）

**功能说明**：存储预约提醒信息，临近就诊时间触发

```sql
CREATE TABLE reminders (
  id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '提醒ID',
  appointment_id BIGINT NOT NULL COMMENT '预约ID',
  trigger_at DATETIME NOT NULL COMMENT '触发时间',
  channel ENUM('IN_APP', 'SMS', 'EMAIL') NOT NULL DEFAULT 'IN_APP' COMMENT '提醒渠道',
  status ENUM('PENDING', 'SENT', 'FAILED') NOT NULL DEFAULT 'PENDING' COMMENT '发送状态',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  sent_at DATETIME COMMENT '发送时间',
  INDEX idx_appointment (appointment_id),
  INDEX idx_trigger (trigger_at, status),
  CONSTRAINT fk_reminder_appointment FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='提醒表';
```

**业务规则**：
- 根据 `visit_at` 提前生成提醒记录（如提前 1 小时）
- 系统定时扫描 `trigger_at` 并发送提醒

---

## 4. 索引设计说明

### 4.1 主键索引
- 所有表使用 `BIGINT AUTO_INCREMENT` 主键，支持大数据量

### 4.2 唯一索引
- `patients.account`、`doctors.account`、`admins.account`：保证账号唯一
- `departments.name`：科室名称唯一
- `doctor_departments(doctor_id, department_id)`：防止重复关联

### 4.3 普通索引
- **时间范围查询**：`appointments(visit_at)`、`visits(created_at)`
- **组合查询**：`appointments(doctor_id, visit_at)`、`appointments(patient_id, created_at)`
- **状态筛选**：`appointments(status)`、`doctors(status)`
- **外键查询**：所有外键字段自动创建索引

---

## 5. 外键约束策略

| 子表 | 外键字段 | 父表 | 删除策略 | 说明 |
| --- | --- | --- | --- | --- |
| doctor_departments | doctor_id | doctors | CASCADE | 医生删除时级联删除关联 |
| doctor_departments | department_id | departments | CASCADE | 科室删除时级联删除关联 |
| schedules | doctor_id | doctors | CASCADE | 医生删除时级联删除时段 |
| appointments | patient_id | patients | CASCADE | 患者删除时删除预约 |
| appointments | doctor_id | doctors | SET NULL | 医生删除时外键置空（doctor_name 保留历史） |
| appointments | department_id | departments | SET NULL | 科室删除时外键置空（department_name 保留历史） |
| visits | appointment_id | appointments | CASCADE | 预约删除时删除就诊记录 |
| visit_items | visit_id | visits | CASCADE | 就诊删除时删除项目 |
| visit_items | item_id | items | RESTRICT | 项目被使用时不可删除 |
| reviews | patient_id/doctor_id/department_id | 对应表 | CASCADE | 主体删除时删除评价 |
| reminders | appointment_id | appointments | CASCADE | 预约删除时删除提醒 |

**重要说明**：
- `appointments` 表中的 `doctor_id` 和 `department_id` 字段允许为 NULL
- 当医生或科室被删除时，外键自动置空，但快照字段（`doctor_name`、`department_name`）保留历史信息
- 这样设计既满足外键约束要求，又能保留完整的历史数据

---

## 6. 数据初始化脚本P

### 6.1 创建数据库
```sql
CREATE DATABASE IF NOT EXISTS hospital 
DEFAULT CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE hospital;
```

### 6.2 初始化管理员
```sql
-- 密码使用 BCrypt 加密，这里为示例哈希值
-- 实际应用中需在 Java 后端生成：BCrypt.hashpw("admin123", BCrypt.gensalt())
INSERT INTO admins (account, password_hash) VALUES 
('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMye7I72PpU0gHJKJiI5w7J2OUPvIJxPmpa');
```

### 6.3 初始化科室
```sql
INSERT INTO departments (name, description, enabled) VALUES 
('儿科', '儿童健康与疾病诊治，包括儿童常见病、多发病', 1),
('口腔科', '口腔疾病诊断与治疗，包括牙齿修复、种植等', 1),
('内科', '内科常见病与慢性病诊治，如高血压、糖尿病等', 1),
('外科', '外科手术与创伤处理，包括普外、骨科等', 1);
```

### 6.4 初始化示例项目
```sql
INSERT INTO items (name, price, type, enabled) VALUES 
('阿莫西林胶囊', 15.50, 'DRUG', 1),
('布洛芬片', 8.00, 'DRUG', 1),
('头孢克肟胶囊', 32.00, 'DRUG', 1),
('血常规检查', 25.00, 'SERVICE', 1),
('尿常规检查', 15.00, 'SERVICE', 1),
('心电图检查', 50.00, 'SERVICE', 1),
('B超检查', 80.00, 'SERVICE', 1);
```

---

## 7. 常用查询示例

### 7.1 查询医生的可预约时段
```sql
SELECT d.id, d.name, s.start_at, s.end_at
FROM doctors d
JOIN schedules s ON d.id = s.doctor_id
WHERE d.status = 'ON_DUTY'
  AND s.status = 'ON_DUTY'
  AND s.start_at >= NOW()
  AND s.start_at <= DATE_ADD(NOW(), INTERVAL 7 DAY)
ORDER BY s.start_at;
```

### 7.2 查询患者的预约记录
```sql
SELECT a.id, a.visit_at, a.status, a.illness_desc,
       d.name AS doctor_name, dept.name AS department_name
FROM appointments a
JOIN doctors d ON a.doctor_id = d.id
JOIN departments dept ON a.department_id = dept.id
WHERE a.patient_id = ?
ORDER BY a.created_at DESC;
```

### 7.3 查询医生的就诊列表
```sql
SELECT a.id, a.visit_at, a.status, a.illness_desc,
       p.real_name AS patient_name, p.age, p.phone
FROM appointments a
JOIN patients p ON a.patient_id = p.id
WHERE a.doctor_id = ?
  AND a.status IN ('PENDING', 'VISITED')
ORDER BY a.visit_at;
```

### 7.4 统计科室评分排行
```sql
SELECT dept.name, 
       COUNT(r.id) AS review_count,
       AVG(r.score) AS avg_score
FROM departments dept
LEFT JOIN reviews r ON dept.id = r.department_id
WHERE dept.enabled = 1
GROUP BY dept.id
ORDER BY avg_score DESC, review_count DESC;
```

### 7.5 统计每日预约数据
```sql
SELECT DATE(created_at) AS date, 
       COUNT(*) AS total_appointments,
       SUM(CASE WHEN status = 'PENDING' THEN 1 ELSE 0 END) AS pending,
       SUM(CASE WHEN status = 'VISITED' THEN 1 ELSE 0 END) AS visited,
       SUM(CASE WHEN status = 'CANCELLED' THEN 1 ELSE 0 END) AS cancelled
FROM appointments
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

### 7.6 查询医生评分排行
```sql
SELECT d.name AS doctor_name,
       COUNT(r.id) AS review_count,
       AVG(r.score) AS avg_score
FROM doctors d
LEFT JOIN reviews r ON d.id = r.doctor_id
WHERE d.deleted_at IS NULL
GROUP BY d.id
HAVING review_count > 0
ORDER BY avg_score DESC, review_count DESC
LIMIT 10;
```

---

## 8. 性能优化建议

### 8.1 分区表（可选）
- 对于 `appointments`、`visits`、`reviews` 等历史数据表，可按时间分区
```sql
-- 按月分区示例
ALTER TABLE appointments PARTITION BY RANGE (YEAR(created_at) * 100 + MONTH(created_at)) (
  PARTITION p202501 VALUES LESS THAN (202502),
  PARTITION p202502 VALUES LESS THAN (202503),
  -- 更多分区...
  PARTITION p_max VALUES LESS THAN MAXVALUE
);
```

### 8.2 查询优化
- 避免 `SELECT *`，只查询需要的字段
- 使用覆盖索引减少回表
- 分页查询使用 `LIMIT OFFSET`，大偏移量时改用游标分页

### 8.3 慢查询监控
```sql
-- 开启慢查询日志
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 1;  -- 超过 1 秒记录
```

---

## 9. 数据安全与备份

### 9.1 敏感数据保护
- 密码字段 `password_hash` 使用 BCrypt 加密
- 手机号等敏感信息可加密存储或脱敏展示
- 日志中不记录敏感字段明文

### 9.2 备份策略
- 每日全量备份
```bash
mysqldump -u root -p hospital > hospital_backup_$(date +%Y%m%d).sql
```
- 每小时增量备份（binlog）

### 9.3 访问控制
- 应用层使用专用账号，限制权限（非 root）
```sql
CREATE USER 'hospital_app'@'localhost' IDENTIFIED BY 'strong_password';
GRANT SELECT, INSERT, UPDATE, DELETE ON hospital.* TO 'hospital_app'@'localhost';
```

---

## 10. 数据迁移（Flyway）

### 10.1 目录结构
```
backend/src/main/resources/
  db/
    migration/
      V1__init_schema.sql          # 初始建表
      V2__init_data.sql            # 初始数据
      V3__add_comment_to_review.sql # 增加评价内容字段
      ...
```

### 10.2 Flyway 配置
```properties
# application.properties
spring.flyway.enabled=true
spring.flyway.locations=classpath:db/migration
spring.flyway.baseline-on-migrate=true
```

---

## 11. 常见问题与约束

### 11.1 预约时间范围校验
- 应用层校验：`visit_at` 必须在 `NOW() + 1天` 到 `NOW() + 7天` 之间

### 11.2 医生删除策略
- 需求要求物理删除，通过 `appointments` 表的快照字段保留历史
- `doctor_name` 和 `department_name` 字段在预约创建时自动填充，删除后仍保留

### 11.3 科室删除影响
- 删除科室时，`doctor_departments` 级联删除
- `appointments` 中的 `department_id` 置空，但 `department_name` 保留历史记录

### 11.4 并发预约冲突
- 同一医生同一时段可能被多人预约，需加锁
```sql
-- 悲观锁示例
SELECT * FROM schedules 
WHERE doctor_id = ? AND start_at <= ? AND end_at >= ? 
FOR UPDATE;
```

---

## 12. 附录：完整建表脚本

见独立文件：`init_hospital_db.sql`（可由本文档第 3 节整合生成）

---

附：本文档与 `需求说明书.md`、`技术架构说明.md` 保持一致，若有冲突以评审结论为准。

