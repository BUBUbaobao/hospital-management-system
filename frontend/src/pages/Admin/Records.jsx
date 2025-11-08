import { useState, useEffect } from 'react';
import { Tabs, Table, message, Tag, Select, Modal, Descriptions, Button } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { adminStatsApi } from '../../services/adminStatsApi';
import dayjs from 'dayjs';

const { TabPane } = Tabs;
const { Option } = Select;

const AdminRecords = () => {
    const [appointments, setAppointments] = useState([]);
    const [visits, setVisits] = useState([]);
    const [loading, setLoading] = useState(false);
    const [appointmentPage, setAppointmentPage] = useState(0);
    const [visitPage, setVisitPage] = useState(0);
    const [appointmentTotal, setAppointmentTotal] = useState(0);
    const [visitTotal, setVisitTotal] = useState(0);
    const [statusFilter, setStatusFilter] = useState(null);
    const [detailVisible, setDetailVisible] = useState(false);
    const [currentVisitDetail, setCurrentVisitDetail] = useState(null);

    useEffect(() => {
        loadAppointments();
        loadVisits(); // 初始时同时加载两个Tab的数据
    }, []);

    useEffect(() => {
        loadAppointments();
    }, [appointmentPage, statusFilter]);

    useEffect(() => {
        loadVisits();
    }, [visitPage]);

    const loadAppointments = async () => {
        setLoading(true);
        try {
            const response = await adminStatsApi.getAllAppointments(statusFilter, appointmentPage, 10);
            if (response.code === 200) {
                setAppointments(response.data.content);
                setAppointmentTotal(response.data.totalElements);
            }
        } catch (error) {
            message.error('加载预约记录失败');
        } finally {
            setLoading(false);
        }
    };

    const loadVisits = async () => {
        console.log('loadVisits被调用，页码:', visitPage);
        setLoading(true);
        try {
            const response = await adminStatsApi.getAllVisits(visitPage, 10);
            console.log('就诊记录API响应:', response);
            if (response.code === 200) {
                console.log('就诊记录数据:', response.data);
                console.log('就诊记录内容:', response.data.content);
                console.log('就诊记录总数:', response.data.totalElements);
                setVisits(response.data.content);
                setVisitTotal(response.data.totalElements);
            }
        } catch (error) {
            console.error('加载就诊记录失败:', error);
            message.error('加载就诊记录失败');
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetail = async (record) => {
        try {
            const response = await adminStatsApi.getVisitDetail(record.id);
            if (response.code === 200) {
                setCurrentVisitDetail(response.data);
                setDetailVisible(true);
            }
        } catch (error) {
            message.error('获取就诊详情失败');
        }
    };

    const getStatusTag = (status) => {
        const statusMap = {
            PENDING: { color: 'blue', text: '待就诊' },
            VISITED: { color: 'green', text: '已就诊' },
            CANCELLED: { color: 'default', text: '已退号' }
        };
        const config = statusMap[status] || { color: 'default', text: status };
        return <Tag color={config.color}>{config.text}</Tag>;
    };

    const appointmentColumns = [
        {
            title: '预约ID',
            dataIndex: 'id',
            key: 'id',
            width: 80,
        },
        {
            title: '患者姓名',
            dataIndex: 'patientName',
            key: 'patientName',
        },
        {
            title: '医生',
            dataIndex: 'doctorName',
            key: 'doctorName',
        },
        {
            title: '科室',
            dataIndex: 'departmentName',
            key: 'departmentName',
        },
        {
            title: '就诊时间',
            dataIndex: 'visitAt',
            key: 'visitAt',
            render: (text) => dayjs(text).format('YYYY-MM-DD HH:mm'),
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: getStatusTag,
        },
        {
            title: '预约时间',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text) => dayjs(text).format('YYYY-MM-DD HH:mm'),
        },
    ];

    const visitColumns = [
        {
            title: '就诊ID',
            dataIndex: 'id',
            key: 'id',
            width: 80,
        },
        {
            title: '患者姓名',
            dataIndex: 'patientName',
            key: 'patientName',
        },
        {
            title: '医生姓名',
            dataIndex: 'doctorName',
            key: 'doctorName',
        },
        {
            title: '科室',
            dataIndex: 'departmentName',
            key: 'departmentName',
        },
        {
            title: '就诊时间',
            dataIndex: 'visitAt',
            key: 'visitAt',
            render: (text) => dayjs(text).format('YYYY-MM-DD HH:mm'),
        },
        {
            title: '费用',
            dataIndex: 'totalFee',
            key: 'totalFee',
            render: (fee) => `¥${fee}`,
        },
        {
            title: '操作',
            key: 'action',
            width: 120,
            render: (_, record) => (
                <Button
                    type="link"
                    icon={<EyeOutlined />}
                    onClick={() => handleViewDetail(record)}
                >
                    查看详情
                </Button>
            ),
        },
    ];

    return (
        <div style={{ padding: '24px' }}>
            <h2>预约就诊信息</h2>

            <Tabs defaultActiveKey="appointments">
                <TabPane tab="预约信息" key="appointments">
                    <div style={{ marginBottom: 16 }}>
                        <span style={{ marginRight: 8 }}>状态筛选：</span>
                        <Select
                            style={{ width: 120 }}
                            placeholder="全部"
                            allowClear
                            onChange={setStatusFilter}
                        >
                            <Option value="PENDING">待就诊</Option>
                            <Option value="VISITED">已就诊</Option>
                            <Option value="CANCELLED">已退号</Option>
                        </Select>
                    </div>
                    <Table
                        dataSource={appointments}
                        columns={appointmentColumns}
                        rowKey="id"
                        loading={loading}
                        pagination={{
                            current: appointmentPage + 1,
                            pageSize: 10,
                            total: appointmentTotal,
                            onChange: (page) => setAppointmentPage(page - 1),
                        }}
                    />
                </TabPane>
                <TabPane tab="就诊信息" key="visits">
                    <Table
                        dataSource={visits}
                        columns={visitColumns}
                        rowKey="id"
                        loading={loading}
                        pagination={{
                            current: visitPage + 1,
                            pageSize: 10,
                            total: visitTotal,
                            onChange: (page) => setVisitPage(page - 1),
                        }}
                    />
                </TabPane>
            </Tabs>

            {/* 就诊详情对话框 */}
            <Modal
                title="就诊详情"
                open={detailVisible}
                onCancel={() => setDetailVisible(false)}
                footer={null}
                width={800}
            >
                {currentVisitDetail && (
                    <>
                        <Descriptions title="患者信息" bordered column={2} style={{ marginBottom: 24 }}>
                            <Descriptions.Item label="姓名">{currentVisitDetail.patientName}</Descriptions.Item>
                            <Descriptions.Item label="年龄">{currentVisitDetail.patientAge || '未填写'}</Descriptions.Item>
                            <Descriptions.Item label="手机号">{currentVisitDetail.patientPhone}</Descriptions.Item>
                            <Descriptions.Item label="身高">
                                {currentVisitDetail.patientHeight ? `${currentVisitDetail.patientHeight} cm` : '未填写'}
                            </Descriptions.Item>
                            <Descriptions.Item label="体重">
                                {currentVisitDetail.patientWeight ? `${currentVisitDetail.patientWeight} kg` : '未填写'}
                            </Descriptions.Item>
                        </Descriptions>

                        <Descriptions title="就诊信息" bordered column={2} style={{ marginBottom: 24 }}>
                            <Descriptions.Item label="医生">{currentVisitDetail.doctorName}</Descriptions.Item>
                            <Descriptions.Item label="科室">{currentVisitDetail.departmentName}</Descriptions.Item>
                            <Descriptions.Item label="就诊时间" span={2}>
                                {dayjs(currentVisitDetail.visitAt).format('YYYY-MM-DD HH:mm')}
                            </Descriptions.Item>
                            <Descriptions.Item label="费用" span={2}>
                                <span style={{ fontSize: '18px', color: '#ff4d4f', fontWeight: 'bold' }}>
                                    ¥{currentVisitDetail.totalFee}
                                </span>
                            </Descriptions.Item>
                        </Descriptions>

                        <Descriptions title="病情描述" bordered column={1} style={{ marginBottom: 24 }}>
                            <Descriptions.Item>
                                {currentVisitDetail.illnessDesc || '无'}
                            </Descriptions.Item>
                        </Descriptions>

                        <Descriptions title="医生建议" bordered column={1} style={{ marginBottom: 24 }}>
                            <Descriptions.Item>
                                {currentVisitDetail.doctorAdvice}
                            </Descriptions.Item>
                        </Descriptions>

                        <h3 style={{ marginBottom: 16 }}>药品/服务清单</h3>
                        <Table
                            dataSource={currentVisitDetail.items}
                            rowKey="itemId"
                            pagination={false}
                            size="small"
                            columns={[
                                { title: '项目名称', dataIndex: 'itemName', key: 'itemName' },
                                { title: '数量', dataIndex: 'quantity', key: 'quantity' },
                                {
                                    title: '单价',
                                    dataIndex: 'unitPrice',
                                    key: 'unitPrice',
                                    render: (price) => `¥${price}`
                                },
                                {
                                    title: '小计',
                                    dataIndex: 'totalAmount',
                                    key: 'totalAmount',
                                    render: (amount) => `¥${amount}`
                                },
                            ]}
                        />
                    </>
                )}
            </Modal>
        </div>
    );
};

export default AdminRecords;

