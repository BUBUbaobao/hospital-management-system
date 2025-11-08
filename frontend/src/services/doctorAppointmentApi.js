import http from './http';

const doctorAppointmentApi = {
    // 查询医生的预约列表
    getMyAppointments: () => {
        return http.get('/doctor/appointments');
    },

    // 查询预约详情
    getAppointmentDetail: (id) => {
        return http.get(`/doctor/appointments/${id}`);
    },

    // 完成会诊
    completeConsultation: (id, data) => {
        return http.post(`/doctor/appointments/${id}/complete`, data);
    },
};

export { doctorAppointmentApi };

