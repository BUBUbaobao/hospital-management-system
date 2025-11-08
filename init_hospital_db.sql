-- ============================================
-- 医院患者预约挂号系统 - 数据库初始化脚本
-- 数据库版本: MySQL 8.0
-- 字符集: utf8mb4
-- 创建日期: 2025-10-31
-- ============================================

-- 创建数据库
CREATE DATABASE IF NOT EXISTS hospital 
DEFAULT CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE hospital;

-- ============================================
-- 1. 患者表
-- ============================================
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

-- ============================================
-- 2. 医生表
-- ============================================
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

-- ============================================
-- 3. 管理员表
-- ============================================
CREATE TABLE admins (
  id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '管理员ID',
  account VARCHAR(64) NOT NULL UNIQUE COMMENT '登录账号',
  password_hash VARCHAR(255) NOT NULL COMMENT '密码哈希（BCrypt）',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='管理员表';

-- ============================================
-- 4. 科室表
-- ============================================
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

-- ============================================
-- 5. 医生科室关联表
-- ============================================
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

-- ============================================
-- 6. 在岗时段表
-- ============================================
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

-- ============================================
-- 7. 预约表
-- ============================================
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

-- ============================================
-- 8. 就诊记录表
-- ============================================
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

-- ============================================
-- 9. 药品服务项目表
-- ============================================
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

-- ============================================
-- 10. 就诊项目关联表
-- ============================================
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

-- ============================================
-- 11. 评价表
-- ============================================
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

-- ============================================
-- 12. 提醒表
-- ============================================
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

-- ============================================
-- 初始化数据
-- ============================================

-- 1. 初始化管理员（账号: admin, 密码: admin123）
-- 注意: 密码哈希值是 BCrypt 加密后的结果
-- 密码: admin123
-- 哈希: $2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi
INSERT INTO admins (account, password_hash) VALUES 
('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi');

-- 2. 初始化科室（需求要求的初始科室：儿科、口腔科、内科、外科）
INSERT INTO departments (name, description, enabled) VALUES 
('儿科', '儿童健康与疾病诊治，包括儿童常见病、多发病的诊断和治疗', 1),
('口腔科', '口腔疾病诊断与治疗，包括牙齿修复、种植、正畸等服务', 1),
('内科', '内科常见病与慢性病诊治，如高血压、糖尿病、心脏病等', 1),
('外科', '外科手术与创伤处理，包括普外科、骨科、泌尿外科等', 1);

-- 3. 初始化药品和服务项目（示例数据）
INSERT INTO items (name, price, type, enabled) VALUES 
-- 药品
('阿莫西林胶囊', 15.50, 'DRUG', 1),
('布洛芬片', 8.00, 'DRUG', 1),
('头孢克肟胶囊', 32.00, 'DRUG', 1),
('氨溴索口服液', 28.50, 'DRUG', 1),
('复方甘草片', 6.50, 'DRUG', 1),
('维生素C片', 12.00, 'DRUG', 1),
('感冒灵颗粒', 18.00, 'DRUG', 1),
('板蓝根颗粒', 15.00, 'DRUG', 1),
-- 服务项目
('血常规检查', 25.00, 'SERVICE', 1),
('尿常规检查', 15.00, 'SERVICE', 1),
('心电图检查', 50.00, 'SERVICE', 1),
('B超检查', 80.00, 'SERVICE', 1),
('X光检查', 120.00, 'SERVICE', 1),
('CT检查', 300.00, 'SERVICE', 1),
('核磁共振检查', 600.00, 'SERVICE', 1),
('挂号费', 10.00, 'SERVICE', 1);

-- ============================================
-- 完成提示
-- ============================================
SELECT '数据库初始化完成！' AS message;
SELECT CONCAT('数据库名称: hospital') AS info;
SELECT CONCAT('管理员账号: admin') AS admin_account;
SELECT CONCAT('管理员密码: admin123') AS admin_password;
SELECT CONCAT('初始科室数量: ', COUNT(*), '个') AS department_count FROM departments;
SELECT CONCAT('药品服务项目数量: ', COUNT(*), '个') AS item_count FROM items;

