import { useState, useEffect } from 'react';
import { Card, Row, Col, Table, message, DatePicker, Space, Tabs } from 'antd';
import {
    LineChartOutlined,
    BarChartOutlined
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import { adminStatsApi } from '../../services/adminStatsApi';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const AdminStatistics = () => {
    const [overview, setOverview] = useState(null);
    const [dailyAppointments, setDailyAppointments] = useState([]);
    const [dailyVisits, setDailyVisits] = useState([]);
    const [departmentStats, setDepartmentStats] = useState([]);
    const [dateRange, setDateRange] = useState([
        dayjs().subtract(6, 'days'),
        dayjs()
    ]);

    useEffect(() => {
        loadOverview();
        loadDailyStats();
        loadDepartmentStats();
    }, []);

    useEffect(() => {
        loadDailyStats();
    }, [dateRange]);

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

    const loadDepartmentStats = async () => {
        try {
            const response = await adminStatsApi.getDepartmentStats();
            if (response.code === 200) {
                setDepartmentStats(response.data);
            }
        } catch (error) {
            console.error('加载科室统计失败', error);
        }
    };

    const loadDailyStats = async () => {
        if (!dateRange || dateRange.length !== 2) return;

        try {
            const startDate = dateRange[0].format('YYYY-MM-DD');
            const endDate = dateRange[1].format('YYYY-MM-DD');

            const [apptResponse, visitResponse] = await Promise.all([
                adminStatsApi.getDailyAppointments(startDate, endDate),
                adminStatsApi.getDailyVisits(startDate, endDate)
            ]);

            if (apptResponse.code === 200) {
                setDailyAppointments(apptResponse.data);
            }
            if (visitResponse.code === 200) {
                setDailyVisits(visitResponse.data);
            }
        } catch (error) {
            message.error('加载趋势数据失败');
        }
    };

    const appointmentColumns = [
        {
            title: '日期',
            dataIndex: 'date',
            key: 'date',
            render: (date) => dayjs(date).format('YYYY-MM-DD'),
        },
        {
            title: '总预约数',
            dataIndex: 'totalAppointments',
            key: 'totalAppointments',
        },
        {
            title: '待就诊',
            dataIndex: 'pending',
            key: 'pending',
        },
        {
            title: '已就诊',
            dataIndex: 'visited',
            key: 'visited',
        },
        {
            title: '已退号',
            dataIndex: 'cancelled',
            key: 'cancelled',
        },
    ];

    const visitColumns = [
        {
            title: '日期',
            dataIndex: 'date',
            key: 'date',
            render: (date) => dayjs(date).format('YYYY-MM-DD'),
        },
        {
            title: '就诊数',
            dataIndex: 'totalVisits',
            key: 'totalVisits',
        },
        {
            title: '总费用',
            dataIndex: 'totalFee',
            key: 'totalFee',
            render: (fee) => `¥${fee}`,
        },
    ];

    return (
        <div style={{ padding: '24px' }}>
            <h2>数据统计</h2>

            {/* 总体统计 - 使用图表展示 */}
            {overview && (
                <Row gutter={16} style={{ marginBottom: 24 }}>
                    {/* 医生状态饼图 */}
                    <Col xs={24} lg={12}>
                        <Card title="医生在岗分布" style={{ height: '400px' }}>
                            <ReactECharts
                                option={{
                                    tooltip: {
                                        trigger: 'item',
                                        formatter: '{b}: {c} ({d}%)'
                                    },
                                    legend: {
                                        orient: 'vertical',
                                        left: 'left'
                                    },
                                    series: [
                                        {
                                            name: '医生状态',
                                            type: 'pie',
                                            radius: ['40%', '70%'],
                                            avoidLabelOverlap: false,
                                            itemStyle: {
                                                borderRadius: 10,
                                                borderColor: '#fff',
                                                borderWidth: 2
                                            },
                                            label: {
                                                show: true,
                                                formatter: '{b}\n{c}人 ({d}%)'
                                            },
                                            emphasis: {
                                                label: {
                                                    show: true,
                                                    fontSize: 16,
                                                    fontWeight: 'bold'
                                                }
                                            },
                                            data: [
                                                {
                                                    value: overview.onDutyDoctors,
                                                    name: '在岗医生',
                                                    itemStyle: {
                                                        color: {
                                                            type: 'linear',
                                                            x: 0, y: 0, x2: 0, y2: 1,
                                                            colorStops: [
                                                                { offset: 0, color: '#52c41a' },
                                                                { offset: 1, color: '#95de64' }
                                                            ]
                                                        }
                                                    }
                                                },
                                                {
                                                    value: overview.offDutyDoctors,
                                                    name: '不在岗医生',
                                                    itemStyle: {
                                                        color: {
                                                            type: 'linear',
                                                            x: 0, y: 0, x2: 0, y2: 1,
                                                            colorStops: [
                                                                { offset: 0, color: '#bfbfbf' },
                                                                { offset: 1, color: '#d9d9d9' }
                                                            ]
                                                        }
                                                    }
                                                }
                                            ]
                                        }
                                    ]
                                }}
                                style={{ height: '320px' }}
                            />
                        </Card>
                    </Col>

                    {/* 今日数据柱状图 */}
                    <Col xs={24} lg={12}>
                        <Card title="今日数据统计" style={{ height: '400px' }}>
                            <ReactECharts
                                option={{
                                    tooltip: {
                                        trigger: 'axis',
                                        axisPointer: {
                                            type: 'shadow'
                                        }
                                    },
                                    grid: {
                                        left: '3%',
                                        right: '4%',
                                        bottom: '3%',
                                        containLabel: true
                                    },
                                    xAxis: {
                                        type: 'category',
                                        data: ['医生总数', '在岗医生', '患者总数', '今日预约', '今日就诊']
                                    },
                                    yAxis: {
                                        type: 'value'
                                    },
                                    series: [
                                        {
                                            name: '数量',
                                            type: 'bar',
                                            data: [
                                                {
                                                    value: overview.totalDoctors,
                                                    itemStyle: {
                                                        color: {
                                                            type: 'linear',
                                                            x: 0, y: 0, x2: 0, y2: 1,
                                                            colorStops: [
                                                                { offset: 0, color: '#1890ff' },
                                                                { offset: 1, color: '#69c0ff' }
                                                            ]
                                                        }
                                                    }
                                                },
                                                {
                                                    value: overview.onDutyDoctors,
                                                    itemStyle: {
                                                        color: {
                                                            type: 'linear',
                                                            x: 0, y: 0, x2: 0, y2: 1,
                                                            colorStops: [
                                                                { offset: 0, color: '#52c41a' },
                                                                { offset: 1, color: '#95de64' }
                                                            ]
                                                        }
                                                    }
                                                },
                                                {
                                                    value: overview.totalPatients,
                                                    itemStyle: {
                                                        color: {
                                                            type: 'linear',
                                                            x: 0, y: 0, x2: 0, y2: 1,
                                                            colorStops: [
                                                                { offset: 0, color: '#722ed1' },
                                                                { offset: 1, color: '#b37feb' }
                                                            ]
                                                        }
                                                    }
                                                },
                                                {
                                                    value: overview.todayAppointments,
                                                    itemStyle: {
                                                        color: {
                                                            type: 'linear',
                                                            x: 0, y: 0, x2: 0, y2: 1,
                                                            colorStops: [
                                                                { offset: 0, color: '#faad14' },
                                                                { offset: 1, color: '#ffd666' }
                                                            ]
                                                        }
                                                    }
                                                },
                                                {
                                                    value: overview.todayVisits,
                                                    itemStyle: {
                                                        color: {
                                                            type: 'linear',
                                                            x: 0, y: 0, x2: 0, y2: 1,
                                                            colorStops: [
                                                                { offset: 0, color: '#eb2f96' },
                                                                { offset: 1, color: '#ff85c0' }
                                                            ]
                                                        }
                                                    }
                                                }
                                            ],
                                            barWidth: '50%',
                                            label: {
                                                show: true,
                                                position: 'top',
                                                fontSize: 14,
                                                fontWeight: 'bold'
                                            }
                                        }
                                    ]
                                }}
                                style={{ height: '320px' }}
                            />
                        </Card>
                    </Col>
                </Row>
            )}

            {/* 科室分布统计 */}
            {departmentStats.length > 0 && (
                <Card title="科室预约分布" style={{ marginBottom: 24 }}>
                    <ReactECharts
                        option={{
                            tooltip: {
                                trigger: 'item',
                                formatter: '{b}<br/>预约数: {c} ({d}%)<br/>医生数: {d0}'
                            },
                            legend: {
                                orient: 'vertical',
                                right: '10%',
                                top: 'center',
                                formatter: (name) => {
                                    const dept = departmentStats.find(d => d.departmentName === name);
                                    return dept ? `${name} (${dept.doctorCount}位医生)` : name;
                                }
                            },
                            series: [
                                {
                                    name: '科室预约分布',
                                    type: 'pie',
                                    radius: ['30%', '60%'],
                                    center: ['40%', '50%'],
                                    avoidLabelOverlap: false,
                                    itemStyle: {
                                        borderRadius: 8,
                                        borderColor: '#fff',
                                        borderWidth: 2
                                    },
                                    label: {
                                        show: true,
                                        formatter: '{b}\n{c}个预约'
                                    },
                                    emphasis: {
                                        label: {
                                            show: true,
                                            fontSize: 16,
                                            fontWeight: 'bold'
                                        },
                                        itemStyle: {
                                            shadowBlur: 10,
                                            shadowOffsetX: 0,
                                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                                        }
                                    },
                                    data: departmentStats.map((dept, index) => {
                                        // 为每个科室分配不同的渐变色
                                        const colors = [
                                            ['#1890ff', '#69c0ff'],  // 蓝色
                                            ['#52c41a', '#95de64'],  // 绿色
                                            ['#722ed1', '#b37feb'],  // 紫色
                                            ['#faad14', '#ffd666'],  // 橙色
                                            ['#eb2f96', '#ff85c0'],  // 粉色
                                            ['#13c2c2', '#5cdbd3'],  // 青色
                                            ['#fa541c', '#ff7a45'],  // 红橙色
                                            ['#2f54eb', '#597ef7'],  // 深蓝
                                        ];
                                        const colorPair = colors[index % colors.length];

                                        return {
                                            value: dept.appointmentCount,
                                            name: dept.departmentName,
                                            d0: dept.doctorCount,  // 存储医生数，用于tooltip
                                            itemStyle: {
                                                color: {
                                                    type: 'linear',
                                                    x: 0, y: 0, x2: 0, y2: 1,
                                                    colorStops: [
                                                        { offset: 0, color: colorPair[0] },
                                                        { offset: 1, color: colorPair[1] }
                                                    ]
                                                }
                                            }
                                        };
                                    })
                                }
                            ]
                        }}
                        style={{ height: '450px' }}
                    />
                </Card>
            )}

            {/* 日期范围选择 */}
            <div style={{ marginBottom: 16 }}>
                <Space>
                    <span>选择日期范围：</span>
                    <RangePicker
                        value={dateRange}
                        onChange={setDateRange}
                        format="YYYY-MM-DD"
                    />
                </Space>
            </div>

            {/* 每日预约趋势 */}
            <Card title="每日预约趋势" style={{ marginBottom: 24 }}>
                <Tabs defaultActiveKey="chart">
                    <TabPane tab={<span><LineChartOutlined />图表</span>} key="chart">
                        <ReactECharts
                            option={{
                                tooltip: {
                                    trigger: 'axis'
                                },
                                legend: {
                                    data: ['总预约', '待就诊', '已就诊', '已退号']
                                },
                                xAxis: {
                                    type: 'category',
                                    data: dailyAppointments.map(item => dayjs(item.date).format('MM-DD'))
                                },
                                yAxis: {
                                    type: 'value'
                                },
                                series: [
                                    {
                                        name: '总预约',
                                        type: 'line',
                                        data: dailyAppointments.map(item => item.totalAppointments),
                                        smooth: true,
                                        itemStyle: { color: '#1890ff' }
                                    },
                                    {
                                        name: '待就诊',
                                        type: 'line',
                                        data: dailyAppointments.map(item => item.pending),
                                        smooth: true,
                                        itemStyle: { color: '#faad14' }
                                    },
                                    {
                                        name: '已就诊',
                                        type: 'line',
                                        data: dailyAppointments.map(item => item.visited),
                                        smooth: true,
                                        itemStyle: { color: '#52c41a' }
                                    },
                                    {
                                        name: '已退号',
                                        type: 'line',
                                        data: dailyAppointments.map(item => item.cancelled),
                                        smooth: true,
                                        itemStyle: { color: '#d9d9d9' }
                                    }
                                ]
                            }}
                            style={{ height: '400px' }}
                        />
                    </TabPane>
                    <TabPane tab="数据表格" key="table">
                        <Table
                            dataSource={dailyAppointments}
                            columns={appointmentColumns}
                            rowKey="date"
                            pagination={false}
                        />
                    </TabPane>
                </Tabs>
            </Card>

            {/* 每日就诊趋势 */}
            <Card title="每日就诊趋势">
                <Tabs defaultActiveKey="chart">
                    <TabPane tab={<span><BarChartOutlined />图表</span>} key="chart">
                        <ReactECharts
                            option={{
                                tooltip: {
                                    trigger: 'axis',
                                    axisPointer: {
                                        type: 'shadow'
                                    }
                                },
                                legend: {
                                    data: ['就诊数', '总费用']
                                },
                                xAxis: {
                                    type: 'category',
                                    data: dailyVisits.map(item => dayjs(item.date).format('MM-DD'))
                                },
                                yAxis: [
                                    {
                                        type: 'value',
                                        name: '就诊数',
                                        position: 'left'
                                    },
                                    {
                                        type: 'value',
                                        name: '费用(元)',
                                        position: 'right'
                                    }
                                ],
                                series: [
                                    {
                                        name: '就诊数',
                                        type: 'bar',
                                        data: dailyVisits.map(item => item.totalVisits),
                                        itemStyle: { color: '#1890ff' }
                                    },
                                    {
                                        name: '总费用',
                                        type: 'line',
                                        yAxisIndex: 1,
                                        data: dailyVisits.map(item => item.totalFee),
                                        smooth: true,
                                        itemStyle: { color: '#52c41a' }
                                    }
                                ]
                            }}
                            style={{ height: '400px' }}
                        />
                    </TabPane>
                    <TabPane tab="数据表格" key="table">
                        <Table
                            dataSource={dailyVisits}
                            columns={visitColumns}
                            rowKey="date"
                            pagination={false}
                        />
                    </TabPane>
                </Tabs>
            </Card>
        </div>
    );
};

export default AdminStatistics;

