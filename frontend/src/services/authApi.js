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

