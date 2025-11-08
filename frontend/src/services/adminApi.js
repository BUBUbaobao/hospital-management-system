import http from './http';

export const adminApi = {
  // ========== 科室管理 ==========
  departments: {
    getAll: () => http.get('/admin/departments'),
    add: (data) => http.post('/admin/departments', data),
    update: (id, data) => http.put(`/admin/departments/${id}`, data),
    delete: (id) => http.delete(`/admin/departments/${id}`),
  },
  
  // ========== 医生管理 ==========
  doctors: {
    getAll: () => http.get('/admin/doctors'),
    add: (data) => http.post('/admin/doctors', data),
    updateStatus: (id, status) => http.put(`/admin/doctors/${id}/status`, { status }),
    delete: (id) => http.delete(`/admin/doctors/${id}`),
  },
};

