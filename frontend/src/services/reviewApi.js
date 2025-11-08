import http from './http';

const reviewApi = {
    // 提交评价
    createReview: (data) => {
        return http.post('/patient/reviews', data);
    },
};

export { reviewApi };

