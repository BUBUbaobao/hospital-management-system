import { useState, useEffect } from 'react';
import { Tabs, Table, message } from 'antd';
import { StarOutlined } from '@ant-design/icons';
import { adminStatsApi } from '../../services/adminStatsApi';

const { TabPane } = Tabs;

const AdminRankings = () => {
    const [doctorRankings, setDoctorRankings] = useState([]);
    const [departmentRankings, setDepartmentRankings] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadRankings();
    }, []);

    const loadRankings = async () => {
        setLoading(true);
        try {
            const [doctorRes, deptRes] = await Promise.all([
                adminStatsApi.getDoctorRankings(10),
                adminStatsApi.getDepartmentRankings(10)
            ]);

            if (doctorRes.code === 200) {
                setDoctorRankings(doctorRes.data);
            }
            if (deptRes.code === 200) {
                setDepartmentRankings(deptRes.data);
            }
        } catch (error) {
            message.error('加载排行数据失败');
        } finally {
            setLoading(false);
        }
    };

    const doctorColumns = [
        {
            title: '排名',
            key: 'rank',
            width: 80,
            render: (_, __, index) => {
                const rank = index + 1;
                let color = '';
                if (rank === 1) color = '#FFD700';
                else if (rank === 2) color = '#C0C0C0';
                else if (rank === 3) color = '#CD7F32';
                return <span style={{ color, fontWeight: 'bold', fontSize: 16 }}>{rank}</span>;
            },
        },
        {
            title: '医生姓名',
            dataIndex: 'doctorName',
            key: 'doctorName',
        },
        {
            title: '平均分',
            dataIndex: 'avgScore',
            key: 'avgScore',
            render: (score) => (
                <span>
                    <StarOutlined style={{ color: '#fadb14', marginRight: 4 }} />
                    {score.toFixed(2)}
                </span>
            ),
        },
        {
            title: '评价数',
            dataIndex: 'reviewCount',
            key: 'reviewCount',
        },
    ];

    const departmentColumns = [
        {
            title: '排名',
            key: 'rank',
            width: 80,
            render: (_, __, index) => {
                const rank = index + 1;
                let color = '';
                if (rank === 1) color = '#FFD700';
                else if (rank === 2) color = '#C0C0C0';
                else if (rank === 3) color = '#CD7F32';
                return <span style={{ color, fontWeight: 'bold', fontSize: 16 }}>{rank}</span>;
            },
        },
        {
            title: '科室名称',
            dataIndex: 'departmentName',
            key: 'departmentName',
        },
        {
            title: '平均分',
            dataIndex: 'avgScore',
            key: 'avgScore',
            render: (score) => (
                <span>
                    <StarOutlined style={{ color: '#fadb14', marginRight: 4 }} />
                    {score.toFixed(2)}
                </span>
            ),
        },
        {
            title: '评价数',
            dataIndex: 'reviewCount',
            key: 'reviewCount',
        },
    ];

    return (
        <div style={{ padding: '24px' }}>
            <h2>评分排行</h2>

            <Tabs defaultActiveKey="doctors">
                <TabPane tab="医生排行" key="doctors">
                    <Table
                        dataSource={doctorRankings}
                        columns={doctorColumns}
                        rowKey="doctorId"
                        loading={loading}
                        pagination={false}
                    />
                </TabPane>
                <TabPane tab="科室排行" key="departments">
                    <Table
                        dataSource={departmentRankings}
                        columns={departmentColumns}
                        rowKey="departmentId"
                        loading={loading}
                        pagination={false}
                    />
                </TabPane>
            </Tabs>
        </div>
    );
};

export default AdminRankings;

