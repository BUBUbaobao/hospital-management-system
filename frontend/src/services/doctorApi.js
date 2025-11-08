import http from './http';

export const doctorApi = {
  // 查询医生列表（可按科室筛选）
  getAll: (departmentId) => {
    const params = departmentId ? { departmentId } : {};
    return http.get('/doctors', { params });
  },
};

