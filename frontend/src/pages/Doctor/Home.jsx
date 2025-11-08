import { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, message, Alert } from 'antd';
import {
    CalendarOutlined,
    CheckCircleOutlined,
    TeamOutlined,
    StarOutlined,
    ClockCircleOutlined,
    UnorderedListOutlined,
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import { doctorStatsApi } from '../../services/doctorStatsApi';
import dayjs from 'dayjs';

const DoctorHome = ({ onMenuChange }) => {
    const [stats, setStats] = useState(null);
    const [dailyData, setDailyData] = useState([]);

    useEffect(() => {
        loadStats();
        loadDailyData();
    }, []);

    const loadStats = async () => {
        try {
            const response = await doctorStatsApi.getOverview();
            if (response.code === 200) {
                setStats(response.data);
            }
        } catch (error) {
            message.error('加载统计数据失败');
        }
    };

    const loadDailyData = async () => {
        try {
            const response = await doctorStatsApi.getDailyConsultations();
            if (response.code === 200) {
                setDailyData(response.data);
            }
        } catch (error) {
            console.error('加载趋势数据失败', error);
        }
    };

    return (
        <div style={{ padding: '24px' }}>
            <h2 style={{ marginBottom: 24 }}>工作台</h2>

            {/* 待处理预约提醒 */}
            {stats && stats.pendingAppointments > 0 && (
                <Alert
                    message="待处理提醒"
                    description={`您有 ${stats.pendingAppointments} 个待处理的预约，请及时查看！`}
                    type="warning"
                    showIcon
                    icon={<ClockCircleOutlined />}
                    style={{ marginBottom: 24 }}
                    closable
                />
            )}

            {/* 统计卡片 */}
            {stats && (
                <Row gutter={16} style={{ marginBottom: 24 }}>
                    <Col xs={24} sm={12} lg={6}>
                        <Card>
                            <Statistic
                                title="今日预约"
                                value={stats.todayAppointments}
                                prefix={<CalendarOutlined />}
                                valueStyle={{ color: '#1890ff' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card>
                            <Statistic
                                title="本周会诊"
                                value={stats.weekConsultations}
                                prefix={<CheckCircleOutlined />}
                                valueStyle={{ color: '#52c41a' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card>
                            <Statistic
                                title="服务患者"
                                value={stats.totalPatients}
                                prefix={<TeamOutlined />}
                                suffix="人"
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card>
                            <Statistic
                                title="平均评分"
                                value={stats.avgScore ? stats.avgScore.toFixed(1) : '暂无'}
                                prefix={<StarOutlined />}
                                valueStyle={{ color: '#faad14' }}
                                suffix={stats.avgScore ? "/ 10" : ""}
                            />
                        </Card>
                    </Col>
                </Row>
            )}

            {/* 最近7天预约趋势图 */}
            <Card title="最近7天预约趋势" style={{ marginBottom: 24 }}>
                <ReactECharts
                    option={{
                        tooltip: {
                            trigger: 'axis'
                        },
                        legend: {
                            data: ['总预约', '待就诊', '已会诊', '已退号'],
                            bottom: 10,  // 图例放在底部
                            left: 'center'
                        },
                        xAxis: {
                            type: 'category',
                            data: dailyData.map(item => dayjs(item.date).format('MM-DD')),
                            boundaryGap: false
                        },
                        yAxis: {
                            type: 'value',
                            name: '预约数'
                        },
                        series: [
                            {
                                name: '总预约',
                                type: 'line',
                                data: dailyData.map(item => item.totalAppointments),
                                smooth: true,
                                itemStyle: { color: '#1890ff' },
                                lineStyle: { width: 3 }
                            },
                            {
                                name: '待就诊',
                                type: 'line',
                                data: dailyData.map(item => item.pending),
                                smooth: true,
                                itemStyle: { color: '#faad14' },
                                lineStyle: { width: 2 }
                            },
                            {
                                name: '已会诊',
                                type: 'line',
                                data: dailyData.map(item => item.visited),
                                smooth: true,
                                itemStyle: { color: '#52c41a' },
                                lineStyle: { width: 2 }
                            },
                            {
                                name: '已退号',
                                type: 'line',
                                data: dailyData.map(item => item.cancelled),
                                smooth: true,
                                itemStyle: { color: '#d9d9d9' },
                                lineStyle: { width: 2, type: 'dashed' }
                            }
                        ],
                        grid: {
                            left: '3%',
                            right: '4%',
                            bottom: '15%',  // 增加底部空间给图例
                            top: '10%',
                            containLabel: true
                        }
                    }}
                    style={{ height: '400px' }}  // 增加高度以适应底部图例
                />
            </Card>

            {/* 快速入口 */}
            <Row gutter={16}>
                <Col xs={24} sm={12}>
                    <Card
                        hoverable
                        onClick={() => onMenuChange && onMenuChange('appointments')}
                        style={{ cursor: 'pointer' }}
                    >
                        <Statistic
                            title="我的预约"
                            value="查看"
                            prefix={<UnorderedListOutlined />}
                            valueStyle={{ color: '#1890ff', fontSize: '18px' }}
                        />
                        <div style={{ marginTop: 8, color: '#999' }}>
                            查看和处理患者预约
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={12}>
                    <Card
                        hoverable
                        onClick={() => onMenuChange && onMenuChange('schedules')}
                        style={{ cursor: 'pointer' }}
                    >
                        <Statistic
                            title="在岗设置"
                            value="管理"
                            prefix={<ClockCircleOutlined />}
                            valueStyle={{ color: '#52c41a', fontSize: '18px' }}
                        />
                        <div style={{ marginTop: 8, color: '#999' }}>
                            设置和管理在岗时段
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default DoctorHome;

