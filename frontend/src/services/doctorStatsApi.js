import http from './http';

const doctorStatsApi = {
    // 获取医生工作统计概览
    getOverview: () => {
        return http.get('/doctor/stats/overview');
    },

    // 获取最近7天会诊趋势
    getDailyConsultations: () => {
        return http.get('/doctor/stats/daily-consultations');
    },
};

export { doctorStatsApi };

