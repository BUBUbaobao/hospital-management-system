import http from './http';

const profileApi = {
    // 患者个人信息
    patient: {
        // 获取个人信息
        getProfile: () => {
            return http.get('/patient/me');
        },

        // 更新个人信息
        updateProfile: (data) => {
            return http.put('/patient/me', data);
        },

        // 获取预约提醒
        getReminder: (appointmentId) => {
            return http.get(`/patient/appointments/${appointmentId}/reminder`);
        },
    },

    // 医生个人信息
    doctor: {
        // 获取个人信息
        getProfile: () => {
            return http.get('/doctor/me');
        },

        // 更新个人信息
        updateProfile: (data) => {
            return http.put('/doctor/me', data);
        },
    },
};

export { profileApi };

