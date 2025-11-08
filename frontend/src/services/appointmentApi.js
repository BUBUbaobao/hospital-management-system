import http from './http';

export const appointmentApi = {
  // 创建预约
  create: (data) => http.post('/appointments', data),
  
  // 查询我的预约
  getMine: () => http.get('/appointments/mine'),
  
  // 退号
  cancel: (id) => http.delete(`/appointments/${id}`),
};

