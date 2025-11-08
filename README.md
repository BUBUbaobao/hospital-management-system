# 医院患者预约挂号系统

## 项目简介
一套完整的医院预约挂号管理系统，采用前后端分离架构，支持患者、医生、管理员三端功能，旨在缓解大型医院挂号难、排队久的问题，提高医疗资源利用效率。

---

## 项目目标
- **准确率目标**：预约挂号准确率 ≥ 98%
- **效率目标**：患者预约平均等待时间缩短 ≥ 50%
- **体验目标**：系统稳定运行、无明显卡顿和错误；数据实时同步、一致性可靠

---

## 技术架构

### 整体架构
- **架构风格**：前后端分离，RESTful API
- **三层结构**：前端 Web（React）→ 后端服务（Java 21）→ 数据库（MySQL 8.0）

### 前端技术栈
- React 18 + JavaScript
- React Router v6（路由）
- Redux Toolkit（状态管理）
- Axios（HTTP 客户端）
- Ant Design（UI 组件库）

### 后端技术栈
- Java 21
- Spring Boot 3.x
- Spring Security + JWT（认证鉴权）
- Spring Data JPA（数据访问）
- MySQL 8.0（数据库）
- Flyway（数据库迁移）

---

## 项目结构
```
Hospital/
├── frontend/                   # 前端项目（React）
│   ├── src/
│   │   ├── app/                # 应用入口与全局配置
│   │   ├── routes/             # 路由配置（按角色分区）
│   │   ├── pages/              # 页面组件
│   │   │   ├── Login/          # 登录页
│   │   │   ├── Register/       # 注册页
│   │   │   ├── Patient/        # 患者端页面
│   │   │   ├── Doctor/         # 医生端页面
│   │   │   └── Admin/          # 管理员端页面
│   │   ├── components/         # 复用组件
│   │   ├── features/           # 领域模块（可选）
│   │   ├── store/              # Redux 状态管理
│   │   ├── services/           # API 服务
│   │   ├── hooks/              # 自定义 Hooks
│   │   ├── utils/              # 工具函数
│   │   ├── assets/             # 静态资源
│   │   └── index.jsx           # React 入口
│   ├── package.json
│   └── README.md               # 前端文档
│
├── backend/                    # 后端项目（Java Spring Boot）
│   ├── src/main/
│   │   ├── java/
│   │   │   └── com/hospital/
│   │   │       ├── HospitalApplication.java  # 应用入口
│   │   │       ├── controller/ # REST API 控制器
│   │   │       ├── service/    # 业务逻辑层
│   │   │       ├── repository/ # 数据访问层
│   │   │       ├── entity/     # 实体类
│   │   │       ├── dto/        # 数据传输对象
│   │   │       ├── mapper/     # 实体与DTO映射
│   │   │       ├── config/     # 配置类
│   │   │       ├── security/   # 安全相关（JWT等）
│   │   │       ├── exception/  # 异常处理
│   │   │       ├── enums/      # 枚举类
│   │   │       └── util/       # 工具类
│   │   └── resources/
│   │       ├── application.properties
│   │       └── db/migration/   # Flyway 迁移脚本
│   ├── pom.xml
│   └── README.md               # 后端文档
│
├── init_hospital_db.sql        # 数据库初始化脚本
├── 需求.txt                    # 原始需求
├── 需求说明书.md               # 详细需求文档
├── 技术架构说明.md             # 技术架构文档
├── MySQL数据库设计.md          # 数据库设计文档
├── 5天开发计划.md              # 开发计划
└── README.md                   # 项目总览（本文件）
```

---

## 功能模块

### 1. 患者端
- ✅ **注册登录**：账号密码注册，真实姓名作为系统昵称
- ✅ **预约挂号**：按科室/医生/时间查询，可提前 1-7 天预约
- ✅ **我的预约**：查看预约列表，支持退号
- ✅ **就诊记录**：查看历史就诊详情（科室、医生、费用、建议）
- ✅ **评价系统**：对医生和科室进行 1-10 分评价
- ✅ **个人信息**：维护年龄、身高、体重、头像
- ✅ **就诊提醒**：临近就诊时间显示提醒

### 2. 医生端
- ✅ **登录**：账号密码 + 校验码 "Doctor"
- ✅ **我的预约**：查看患者预约与详情（姓名、年龄、病情）
- ✅ **会诊完成**：填写医生建议、添加药品服务
- ✅ **在岗设置**：自由设置在岗/不在岗时段
- ✅ **个人信息**：管理擅长科室、头像

### 3. 管理员端
- ✅ **科室管理**：增删改查科室信息
- ✅ **医生管理**：添加医生、修改状态、删除医生
- ✅ **数据统计**：医生数、在岗情况、每日预约/就诊数据
- ✅ **评分排行**：查看科室和医生评分排行
- ✅ **信息查询**：查看所有预约和就诊信息
- ✅ **固定账号**：admin / admin123

---

## 快速开始

### 前置要求
- Node.js 16+（前端）
- JDK 21（后端）
- Maven 3.8+（后端）
- MySQL 8.0（数据库）

### 1. 数据库初始化
在 MySQL 中执行：
```bash
mysql -u root -p < init_hospital_db.sql
```

或使用 Navicat 等工具直接执行 `init_hospital_db.sql`。

**数据库信息**：
- 数据库名：`hospital`
- 账号：`root`
- 密码：`jyh20050820`

### 2. 启动后端
```bash
cd backend
mvn spring-boot:run
```

后端运行在：`http://localhost:8080`

### 3. 启动前端
```bash
cd frontend
npm install
npm start
```

前端运行在：`http://localhost:3000`

### 4. 测试登录

#### 管理员登录（已初始化）
- 账号：`admin`
- 密码：`admin123`

#### 患者登录
需先在前端注册页面注册患者账号。

#### 医生登录
需管理员先添加医生，然后使用医生账号密码 + 校验码 `Doctor` 登录。

---

## 核心业务流程

### 患者预约流程
```
登录 → 查询科室/医生 → 选择医生与时段 → 填写病情描述 → 提交预约
→ 待就诊 → 就诊提醒 → 医生会诊完成 → 生成就诊记录 → 患者评价
```

### 医生会诊流程
```
登录 → 设置在岗时段 → 查看预约列表 → 查看患者详情
→ 点击会诊 → 填写建议/添加药品服务 → 完成会诊 → 预约状态变更为已就诊
```

### 管理员管理流程
```
登录 → 科室管理（增删改） → 医生管理（添加/修改状态/删除）
→ 数据统计分析 → 评分排行查看 → 预约就诊信息查询
```

---

## 数据库设计

### 核心表（12 张）
1. **patients** - 患者表
2. **doctors** - 医生表
3. **admins** - 管理员表
4. **departments** - 科室表
5. **doctor_departments** - 医生科室关联表
6. **schedules** - 在岗时段表
7. **appointments** - 预约表（含快照字段）
8. **visits** - 就诊记录表
9. **items** - 药品服务项目表
10. **visit_items** - 就诊项目关联表
11. **reviews** - 评价表
12. **reminders** - 提醒表

详细设计见 `MySQL数据库设计.md`。

---

## API 接口

### 基础路径
```
http://localhost:8080/api/v1
```

### 主要端点
- **认证**：`/auth/patient/register`、`/auth/patient/login`、`/auth/doctor/login`、`/auth/admin/login`
- **患者**：`/patient/me`、`/patient/visits`、`/patient/reviews`
- **预约**：`/appointments`、`/appointments/mine`、`DELETE /appointments/{id}`
- **医生**：`/doctor/me`、`/doctor/appointments`、`/doctor/schedules`
- **管理员**：`/admin/departments`、`/admin/doctors`、`/admin/stats/*`、`/admin/rankings/*`

详细接口文档见 `技术架构说明.md` 和各子项目的 README。

---

## 开发计划

### 第一天（必须完成）
- ✅ 项目初始化（前后端）
- ✅ 数据库初始化
- ✅ **三端登录功能**（患者、医生、管理员）
- ✅ 登录态管理与路由守卫

### 第二天
- ✅ 患者端：查询科室/医生、预约挂号、退号

### 第三天
- ✅ 管理员端：科室管理、医生管理

### 第四天
- ✅ 医生端：预约管理、会诊完成
- ✅ 患者端：就诊记录、评价

### 第五天
- ✅ 管理员端：数据统计、评分排行
- ✅ 个人信息管理、就诊提醒
- ✅ 全流程测试与优化

详细开发计划见 `5天开发计划.md`。

---

## 项目文档

| 文档名称 | 描述 |
| --- | --- |
| `需求.txt` | 原始需求文档 |
| `需求说明书.md` | 详细需求拆分与用例清单 |
| `技术架构说明.md` | 技术选型、架构设计、接口规范 |
| `MySQL数据库设计.md` | 数据库表设计、索引、外键约束 |
| `5天开发计划.md` | 详细开发任务与验收标准 |
| `frontend/README.md` | 前端项目文档 |
| `backend/README.md` | 后端项目文档 |
| `README.md` | 项目总览（本文件） |

---

## 权限模型（RBAC）

| 资源 | PATIENT | DOCTOR | ADMIN |
| --- | --- | --- | --- |
| 注册 | ✅ | ❌ | ❌ |
| 预约挂号 | ✅（自己） | ❌ | ❌ |
| 查看预约 | ✅（自己） | ✅（关联） | ✅（全部） |
| 会诊完成 | ❌ | ✅ | ❌ |
| 在岗设置 | ❌ | ✅（自己） | ❌ |
| 科室管理 | ❌ | ❌ | ✅ |
| 医生管理 | ❌ | ❌ | ✅ |
| 数据统计 | ❌ | ❌ | ✅ |

---

## 安全与合规

### 数据安全
- 密码使用 BCrypt 加密存储
- JWT Token 用于身份认证
- 敏感信息脱敏展示
- 日志不记录隐私明文

### 访问控制
- 基于角色的访问控制（RBAC）
- 后端 Spring Security 鉴权
- 前端路由守卫
- 管理员与医生无法自行注册

### 合规要求
- 遵循医疗隐私法规
- 患者数据严格保密
- 最小权限原则
- 操作日志审计

---

## 常见问题

### 1. 数据库创建报错
- **问题**：外键约束冲突
- **解决**：使用最新的 `init_hospital_db.sql`，已修复 `doctor_id` 和 `department_id` 的 NOT NULL 冲突

### 2. 跨域问题
- **前端配置代理**（开发环境）：在 `vite.config.js` 或 `package.json` 中配置代理
- **后端配置 CORS**：在 `WebConfig` 中添加跨域配置

### 3. JWT Token 过期
- **默认有效期**：24 小时
- **处理方式**：前端拦截 401 状态码，自动跳转登录页

### 4. 医生登录失败
- **检查校验码**：必须输入 "Doctor"（区分大小写）
- **检查账号**：需管理员先添加医生

---

## 开发规范

### 代码提交
```bash
feat: 添加新功能
fix: 修复 Bug
docs: 更新文档
chore: 项目配置
test: 添加测试
```

### 命名规范
- **前端**：组件 PascalCase，函数 camelCase
- **后端**：类 PascalCase，方法 camelCase
- **数据库**：表名、字段名小写下划线

---

## 测试

### 前端测试
```bash
cd frontend
npm test
```

### 后端测试
```bash
cd backend
mvn test
```

### 集成测试
按照 `5天开发计划.md` 中的验收标准逐项测试。

---

## 部署

### 本地部署
1. 启动 MySQL 服务
2. 执行数据库初始化脚本
3. 启动后端服务（端口 8080）
4. 启动前端服务（端口 3000）

### 生产部署（可选）
- **前端**：构建静态文件，部署到 Nginx
- **后端**：打包 JAR，使用 Systemd 或 Docker 部署
- **数据库**：配置主从复制、定时备份

---

## 项目亮点

1. **前后端完全分离**，职责清晰，易于维护
2. **三端角色设计**，满足不同用户需求
3. **完善的权限控制**，基于 JWT + RBAC
4. **数据快照设计**，医生/科室删除后保留历史记录
5. **详细的项目文档**，从需求到实现全覆盖
6. **清晰的开发计划**，5 天完成核心功能

---

## 技术支持

### 学习资源
- [React 官方文档](https://react.dev/)
- [Spring Boot 官方文档](https://spring.io/projects/spring-boot)
- [MySQL 8.0 文档](https://dev.mysql.com/doc/refman/8.0/en/)
- [Ant Design 文档](https://ant.design/)

### 问题反馈
- 查看项目文档：`需求说明书.md`、`技术架构说明.md`
- 查看子项目 README：`frontend/README.md`、`backend/README.md`

---

## 版本信息
- **项目版本**：v1.0.0
- **文档版本**：v1.0
- **最后更新**：2025-11-04

---

## 许可证
本项目仅供学习交流使用。

---

**祝开发顺利！🚀**

