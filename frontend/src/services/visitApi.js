import http from './http';

const visitApi = {
    // 查询患者的就诊记录
    getMyVisits: () => {
        return http.get('/patient/visits');
    },

    // 查询就诊详情
    getVisitDetail: (id) => {
        return http.get(`/patient/visits/${id}`);
    },
};

export { visitApi };

