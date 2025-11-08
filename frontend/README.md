# 医院患者预约挂号系统 - 前端项目

## 项目简介
基于 React 18 + JavaScript 开发的医院预约挂号系统前端应用，支持患者、医生、管理员三端功能。

---

## 技术栈
- **框架**：React 18 + JavaScript
- **路由**：React Router v6
- **状态管理**：Redux Toolkit（全局状态）
- **HTTP 客户端**：Axios
- **UI 组件库**：Ant Design
- **构建工具**：Vite / Create React App
- **包管理器**：npm / yarn

---

## 项目结构
```
frontend/
├── public/                 # 静态资源
├── src/
│   ├── app/                # 应用入口与全局配置
│   │   └── App.jsx
│   ├── routes/             # 路由配置
│   │   ├── index.jsx       # 路由主配置
│   │   ├── PatientRoutes.jsx    # 患者端路由
│   │   ├── DoctorRoutes.jsx     # 医生端路由
│   │   └── AdminRoutes.jsx      # 管理员端路由
│   ├── pages/              # 页面组件
│   │   ├── Login/          # 登录页
│   │   ├── Register/       # 注册页
│   │   ├── Patient/        # 患者端页面
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Appointment.jsx       # 预约挂号
│   │   │   ├── MyAppointments.jsx    # 我的预约
│   │   │   ├── MyVisits.jsx          # 我的就诊情况
│   │   │   └── Profile.jsx           # 个人信息
│   │   ├── Doctor/         # 医生端页面
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Appointments.jsx      # 我的预约
│   │   │   ├── Schedules.jsx         # 在岗设置
│   │   │   └── Profile.jsx           # 个人信息
│   │   └── Admin/          # 管理员端页面
│   │       ├── Dashboard.jsx
│   │       ├── Departments.jsx       # 科室管理
│   │       ├── Doctors.jsx           # 医生管理
│   │       ├── Statistics.jsx        # 数据统计
│   │       ├── Rankings.jsx          # 评分排行
│   │       └── Records.jsx           # 预约就诊信息
│   ├── components/         # 复用组件
│   │   ├── Layout/         # 布局组件
│   │   ├── PrivateRoute.jsx         # 路由守卫
│   │   ├── AppointmentForm/         # 预约表单
│   │   ├── DepartmentCard/          # 科室卡片
│   │   └── ...
│   ├── features/           # 领域模块（可选）
│   │   ├── appointments/
│   │   ├── departments/
│   │   └── reviews/
│   ├── store/              # Redux 状态管理
│   │   ├── index.js        # Store 配置
│   │   ├── authSlice.js    # 认证状态
│   │   └── ...
│   ├── services/           # API 服务
│   │   ├── http.js         # Axios 实例配置
│   │   ├── authApi.js      # 认证接口
│   │   ├── appointmentApi.js    # 预约接口
│   │   ├── departmentApi.js     # 科室接口
│   │   ├── doctorApi.js         # 医生接口
│   │   └── ...
│   ├── hooks/              # 自定义 Hooks
│   │   ├── useAuth.js
│   │   └── usePagination.js
│   ├── utils/              # 工具函数
│   │   ├── dateUtils.js    # 日期处理
│   │   ├── validators.js   # 表单校验
│   │   └── constants.js    # 常量定义
│   ├── assets/             # 静态资源（图片、样式等）
│   ├── index.jsx           # 应用入口
│   └── index.css           # 全局样式
├── .env.development        # 开发环境配置
├── .env.production         # 生产环境配置
├── package.json
├── vite.config.js          # Vite 配置（或 craco.config.js）
└── README.md
```

---

## 快速开始

### 1. 安装依赖
```bash
npm install
# 或
yarn install
```

### 2. 配置环境变量
创建 `.env.development` 文件：
```env
REACT_APP_API_BASE_URL=http://localhost:8080/api/v1
```

### 3. 启动开发服务器
```bash
npm start
# 或
yarn start
```

访问：`http://localhost:3000`

---

## 核心依赖安装

### 必需依赖
```bash
npm install react react-dom react-router-dom
npm install axios
npm install antd
npm install @reduxjs/toolkit react-redux
```

### 推荐依赖（可选）
```bash
# 日期处理
npm install dayjs

# 图表（管理员统计）
npm install echarts echarts-for-react

# 表单处理
npm install formik yup
```

---

## 功能模块

### 1. 患者端
- ✅ 注册与登录
- ✅ 预约挂号（科室 → 医生 → 时间 → 病情描述）
- ✅ 我的预约（查看、退号）
- ✅ 我的就诊情况（查看记录、评价）
- ✅ 个人信息管理
- ✅ 就诊提醒

### 2. 医生端
- ✅ 登录（需校验码 "Doctor"）
- ✅ 我的预约（查看患者信息、会诊）
- ✅ 会诊完成（填写建议、添加药品服务）
- ✅ 在岗设置
- ✅ 个人信息管理

### 3. 管理员端
- ✅ 登录（固定账号 admin/admin123）
- ✅ 科室管理（增删改查）
- ✅ 医生管理（增删改查）
- ✅ 数据统计（医生数、预约数、就诊数）
- ✅ 评分排行（医生、科室）
- ✅ 预约就诊信息查询

---

## 路由设计

### 公共路由
- `/login` - 登录页（三端切换）
- `/register` - 患者注册页

### 患者端路由（需登录 + PATIENT 角色）
- `/patient/dashboard` - 首页
- `/patient/appointment` - 预约挂号
- `/patient/my-appointments` - 我的预约
- `/patient/my-visits` - 我的就诊情况
- `/patient/profile` - 个人信息

### 医生端路由（需登录 + DOCTOR 角色）
- `/doctor/dashboard` - 首页
- `/doctor/appointments` - 我的预约
- `/doctor/schedules` - 在岗设置
- `/doctor/profile` - 个人信息

### 管理员端路由（需登录 + ADMIN 角色）
- `/admin/dashboard` - 首页
- `/admin/departments` - 科室管理
- `/admin/doctors` - 医生管理
- `/admin/statistics` - 数据统计
- `/admin/rankings` - 评分排行
- `/admin/records` - 预约就诊信息

---

## 状态管理

### Redux Store 结构
```javascript
{
  auth: {
    token: string,
    role: 'PATIENT' | 'DOCTOR' | 'ADMIN',
    userId: number,
    userName: string,
    isAuthenticated: boolean
  }
}
```

### LocalStorage 存储
- `token` - JWT Token
- `role` - 用户角色
- `userId` - 用户ID
- `userName` - 用户名称

---

## API 接口示例

### Axios 配置（`services/http.js`）
```javascript
import axios from 'axios';

const http = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  timeout: 10000,
});

// 请求拦截器
http.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器
http.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default http;
```

### 认证接口（`services/authApi.js`）
```javascript
import http from './http';

export const authApi = {
  // 患者注册
  patientRegister: (data) => http.post('/auth/patient/register', data),
  
  // 患者登录
  patientLogin: (data) => http.post('/auth/patient/login', data),
  
  // 医生登录
  doctorLogin: (data) => http.post('/auth/doctor/login', data),
  
  // 管理员登录
  adminLogin: (data) => http.post('/auth/admin/login', data),
  
  // 退出登录
  logout: () => http.post('/auth/logout'),
};
```

---

## 表单校验规则

### 患者注册
- 账号：4-20 位字符
- 密码：6-20 位字符
- 确认密码：与密码一致
- 手机号：11 位数字
- 真实姓名：2-20 位字符

### 预约挂号
- 就诊时间：未来 1-7 天
- 病情描述：选填，最多 500 字

### 医生登录
- 账号：必填
- 密码：必填
- 校验码：必须为 "Doctor"

---

## 样式方案

### Ant Design 主题定制
在 `App.jsx` 中配置：
```javascript
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';

<ConfigProvider locale={zhCN} theme={{ token: { colorPrimary: '#1890ff' } }}>
  <App />
</ConfigProvider>
```

---

## 开发规范

### 组件命名
- 页面组件：PascalCase，如 `Dashboard.jsx`
- 复用组件：PascalCase，如 `AppointmentCard.jsx`
- 工具函数：camelCase，如 `formatDate.js`

### 代码提交
```bash
# 功能开发
git commit -m "feat: 添加患者预约挂号功能"

# Bug 修复
git commit -m "fix: 修复登录态丢失问题"

# 文档更新
git commit -m "docs: 更新前端 README"
```

---

## 常见问题

### 1. 跨域问题
开发环境配置代理（`vite.config.js`）：
```javascript
export default {
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
};
```

### 2. Token 过期处理
在 Axios 响应拦截器中统一处理 401，自动跳转登录页。

### 3. 路由守卫
使用 `PrivateRoute` 组件包裹需要登录的路由：
```javascript
<Route path="/patient/*" element={<PrivateRoute role="PATIENT" />} />
```

---

## 构建与部署

### 构建生产版本
```bash
npm run build
# 或
yarn build
```

生成的文件在 `dist/` 目录，可部署到静态服务器。

### 本地预览
```bash
npm run preview
# 或
yarn preview
```

---

## 参考文档
- [React 官方文档](https://react.dev/)
- [React Router 文档](https://reactrouter.com/)
- [Redux Toolkit 文档](https://redux-toolkit.js.org/)
- [Ant Design 文档](https://ant.design/)
- [Axios 文档](https://axios-http.com/)

---

## 联系与支持
- 项目文档：查看根目录 `需求说明书.md`、`技术架构说明.md`
- 开发计划：查看 `5天开发计划.md`

