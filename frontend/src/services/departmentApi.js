import http from './http';

export const departmentApi = {
  // 查询所有启用的科室
  getAll: () => http.get('/departments'),
};

