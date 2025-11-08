import { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, message } from 'antd';
import {
    TeamOutlined,
    UserOutlined,
    CalendarOutlined,
    MedicineBoxOutlined,
    BarChartOutlined,
    TrophyOutlined,
    FileSearchOutlined,
} from '@ant-design/icons';
import { adminStatsApi } from '../../services/adminStatsApi';

const AdminHome = ({ onMenuChange }) => {
    const [overview, setOverview] = useState(null);

    useEffect(() => {
        loadOverview();
    }, []);

    const loadOverview = async () => {
        try {
            const response = await adminStatsApi.getOverview();
            if (response.code === 200) {
                setOverview(response.data);
            }
        } catch (error) {
            message.error('加载统计数据失败');
        }
    };

    const quickActions = [
        {
            key: 'departments',
            title: '科室管理',
            icon: <MedicineBoxOutlined style={{ fontSize: 48, color: '#1890ff' }} />,
            color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        },
        {
            key: 'doctors',
            title: '医生管理',
            icon: <TeamOutlined style={{ fontSize: 48, color: '#52c41a' }} />,
            color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        },
        {
            key: 'statistics',
            title: '数据统计',
            icon: <BarChartOutlined style={{ fontSize: 48, color: '#faad14' }} />,
            color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        },
        {
            key: 'rankings',
            title: '评分排行',
            icon: <TrophyOutlined style={{ fontSize: 48, color: '#eb2f96' }} />,
            color: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
        },
        {
            key: 'records',
            title: '预约就诊信息',
            icon: <FileSearchOutlined style={{ fontSize: 48, color: '#722ed1' }} />,
            color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        },
    ];

    return (
        <div style={{ padding: '24px' }}>
            {/* 欢迎横幅 */}
            <Card
                style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    marginBottom: 24,
                    borderRadius: 8,
                }}
                bordered={false}
            >
                <div style={{ padding: '20px 0' }}>
                    <h1 style={{ color: 'white', fontSize: 28, marginBottom: 8 }}>
                        管理控制台
                    </h1>
                    <p style={{ fontSize: 16, opacity: 0.9, margin: 0 }}>
                        医院预约挂号系统管理中心
                    </p>
                </div>
            </Card>

            {/* 统计概览卡片 */}
            {overview && (
                <>
                    <h2 style={{ marginBottom: 16 }}>数据概览</h2>
                    <Row gutter={16} style={{ marginBottom: 24 }}>
                        <Col xs={24} sm={12} lg={8}>
                            <Card>
                                <Statistic
                                    title="医生总数"
                                    value={overview.totalDoctors}
                                    prefix={<TeamOutlined />}
                                    valueStyle={{ color: '#1890ff' }}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} lg={8}>
                            <Card>
                                <Statistic
                                    title="在岗医生"
                                    value={overview.onDutyDoctors}
                                    prefix={<UserOutlined />}
                                    valueStyle={{ color: '#52c41a' }}
                                    suffix={`/ ${overview.totalDoctors}`}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} lg={8}>
                            <Card>
                                <Statistic
                                    title="患者总数"
                                    value={overview.totalPatients}
                                    prefix={<UserOutlined />}
                                />
                            </Card>
                        </Col>
                    </Row>

                    <Row gutter={16} style={{ marginBottom: 24 }}>
                        <Col xs={24} sm={12}>
                            <Card>
                                <Statistic
                                    title="今日预约数"
                                    value={overview.todayAppointments}
                                    prefix={<CalendarOutlined />}
                                    valueStyle={{ color: '#faad14' }}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Card>
                                <Statistic
                                    title="今日就诊数"
                                    value={overview.todayVisits}
                                    prefix={<MedicineBoxOutlined />}
                                    valueStyle={{ color: '#eb2f96' }}
                                />
                            </Card>
                        </Col>
                    </Row>
                </>
            )}

            {/* 快速入口 */}
            <h2 style={{ marginBottom: 16 }}>快速入口</h2>
            <Row gutter={[16, 16]}>
                {quickActions.map((action) => (
                    <Col xs={24} sm={12} lg={8} xl={8} key={action.key}>
                        <Card
                            hoverable
                            onClick={() => onMenuChange && onMenuChange(action.key)}
                            style={{
                                height: '100%',
                                borderRadius: 8,
                                overflow: 'hidden',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                            }}
                            className="quick-action-card"
                        >
                            <div
                                style={{
                                    background: action.color,
                                    padding: '30px 20px',
                                    textAlign: 'center',
                                    marginBottom: 16,
                                    borderRadius: 8,
                                }}
                            >
                                {action.icon}
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <h3 style={{ marginBottom: 0 }}>{action.title}</h3>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default AdminHome;

