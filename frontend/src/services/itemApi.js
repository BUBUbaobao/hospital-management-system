import http from './http';

const itemApi = {
    // 查询所有药品服务项目
    getAllItems: (type) => {
        const params = type ? `?type=${type}` : '';
        return http.get(`/items${params}`);
    },
};

export { itemApi };

