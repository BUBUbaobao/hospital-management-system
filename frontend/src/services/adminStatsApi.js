import http from './http';

const adminStatsApi = {
    // 获取总体统计数据
    getOverview: () => {
        return http.get('/admin/stats/overview');
    },

    // 获取每日预约统计
    getDailyAppointments: (startDate, endDate) => {
        return http.get('/admin/stats/daily-appointments', {
            params: { startDate, endDate }
        });
    },

    // 获取每日就诊统计
    getDailyVisits: (startDate, endDate) => {
        return http.get('/admin/stats/daily-visits', {
            params: { startDate, endDate }
        });
    },

    // 获取医生评分排行
    getDoctorRankings: (limit = 10) => {
        return http.get('/admin/rankings/doctors', {
            params: { limit }
        });
    },

    // 获取科室评分排行
    getDepartmentRankings: (limit = 10) => {
        return http.get('/admin/rankings/departments', {
            params: { limit }
        });
    },

    // 获取所有预约记录（分页）
    getAllAppointments: (status = null, page = 0, size = 10) => {
        const params = { page, size };
        if (status) params.status = status;
        return http.get('/admin/appointments', { params });
    },

    // 获取所有就诊记录（分页）
    getAllVisits: (page = 0, size = 10) => {
        return http.get('/admin/visits', {
            params: { page, size }
        });
    },

    // 获取就诊详情
    getVisitDetail: (id) => {
        return http.get(`/admin/visits/${id}`);
    },

    // 获取科室统计分布
    getDepartmentStats: () => {
        return http.get('/admin/stats/departments');
    },
};

export { adminStatsApi };

