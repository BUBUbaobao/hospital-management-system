import http from './http';

const scheduleApi = {
    // 查询医生的时段列表
    getMySchedules: () => {
        return http.get('/doctor/schedules');
    },

    // 创建时段
    createSchedule: (data) => {
        return http.post('/doctor/schedules', data);
    },

    // 更新时段状态
    updateScheduleStatus: (id, status) => {
        return http.put(`/doctor/schedules/${id}?status=${status}`);
    },
};

export { scheduleApi };

