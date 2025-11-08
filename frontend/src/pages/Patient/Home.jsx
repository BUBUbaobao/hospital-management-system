import { Card, Row, Col, Button } from 'antd';
import {
    CalendarOutlined,
    UnorderedListOutlined,
    FileTextOutlined,
    UserOutlined,
} from '@ant-design/icons';
import './Home.css';

const PatientHome = ({ onMenuChange }) => {
    const quickActions = [
        {
            key: 'appointment',
            title: '预约挂号',
            description: '选择科室和医生进行预约',
            icon: <CalendarOutlined style={{ fontSize: 48, color: '#1890ff' }} />,
            color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        },
        {
            key: 'my-appointments',
            title: '我的预约',
            description: '查看和管理我的预约记录',
            icon: <UnorderedListOutlined style={{ fontSize: 48, color: '#52c41a' }} />,
            color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        },
        {
            key: 'my-visits',
            title: '就诊记录',
            description: '查看历史就诊记录和评价',
            icon: <FileTextOutlined style={{ fontSize: 48, color: '#faad14' }} />,
            color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        },
        {
            key: 'profile',
            title: '个人信息',
            description: '管理个人资料和健康档案',
            icon: <UserOutlined style={{ fontSize: 48, color: '#722ed1' }} />,
            color: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
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
                        欢迎使用医院预约挂号系统
                    </h1>
                    <p style={{ fontSize: 16, opacity: 0.9, margin: 0 }}>
                        为您提供便捷的在线预约和健康管理服务
                    </p>
                </div>
            </Card>

            {/* 快速入口 */}
            <h2 style={{ marginBottom: 16 }}>快速入口</h2>
            <Row gutter={[16, 16]}>
                {quickActions.map((action) => (
                    <Col xs={24} sm={12} lg={6} key={action.key}>
                        <Card
                            hoverable
                            className="quick-action-card"
                            onClick={() => onMenuChange && onMenuChange(action.key)}
                            style={{
                                height: '100%',
                                borderRadius: 8,
                                overflow: 'hidden'
                            }}
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
                                <h3 style={{ marginBottom: 8 }}>{action.title}</h3>
                                <p style={{ color: '#999', fontSize: 14, margin: 0 }}>
                                    {action.description}
                                </p>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* 使用指南 */}
            <Card title="📖 使用指南" style={{ marginTop: 24 }}>
                <Row gutter={16}>
                    <Col xs={24} md={12}>
                        <h4>📍 如何预约？</h4>
                        <ol style={{ paddingLeft: 20 }}>
                            <li>点击"预约挂号"进入预约页面</li>
                            <li>选择您需要的科室</li>
                            <li>选择医生和就诊时间（1-7天内）</li>
                            <li>填写病情描述并提交</li>
                        </ol>
                    </Col>
                    <Col xs={24} md={12}>
                        <h4>💡 温馨提示</h4>
                        <ul style={{ paddingLeft: 20 }}>
                            <li>预约时间需要提前1-7天</li>
                            <li>如需退号，请在"我的预约"中操作</li>
                            <li>就诊后可以对医生和科室进行评价</li>
                            <li>请及时完善个人信息以便医生诊断</li>
                        </ul>
                    </Col>
                </Row>
            </Card>
        </div>
    );
};

export default PatientHome;

