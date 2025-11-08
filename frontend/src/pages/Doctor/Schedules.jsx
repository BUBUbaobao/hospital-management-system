import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, DatePicker, Select, message, Tag, Space } from 'antd';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import { scheduleApi } from '../../services/scheduleApi';
import dayjs from 'dayjs';

const Schedules = () => {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [statusModalVisible, setStatusModalVisible] = useState(false);
    const [currentSchedule, setCurrentSchedule] = useState(null);
    const [form] = Form.useForm();
    const [statusForm] = Form.useForm();

    useEffect(() => {
        loadSchedules();
    }, []);

    const loadSchedules = async () => {
        setLoading(true);
        try {
            const response = await scheduleApi.getMySchedules();
            if (response.code === 200) {
                setSchedules(response.data);
            }
        } catch (error) {
            message.error('加载时段列表失败');
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        form.resetFields();
        form.setFieldsValue({ status: 'ON_DUTY' });
        setModalVisible(true);
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();

            const data = {
                startAt: values.timeRange[0].format('YYYY-MM-DDTHH:mm:ss'),
                endAt: values.timeRange[1].format('YYYY-MM-DDTHH:mm:ss'),
                status: values.status,
            };

            const response = await scheduleApi.createSchedule(data);

            if (response.code === 200) {
                message.success('添加成功');
                setModalVisible(false);
                loadSchedules();
            }
        } catch (error) {
            if (error.errorFields) {
                message.error('请填写完整信息');
            } else {
                message.error(error.message || '添加失败');
            }
        }
    };

    const handleUpdateStatus = (record) => {
        setCurrentSchedule(record);
        statusForm.setFieldsValue({ status: record.status });
        setStatusModalVisible(true);
    };

    const handleStatusSubmit = async () => {
        try {
            const values = await statusForm.validateFields();

            const response = await scheduleApi.updateScheduleStatus(
                currentSchedule.id,
                values.status
            );

            if (response.code === 200) {
                message.success('状态更新成功');
                setStatusModalVisible(false);
                loadSchedules();
            }
        } catch (error) {
            message.error(error.message || '更新失败');
        }
    };

    const getStatusTag = (status) => {
        const statusMap = {
            ON_DUTY: { color: 'success', text: '在岗' },
            OFF_DUTY: { color: 'default', text: '不在岗' }
        };
        const config = statusMap[status] || { color: 'default', text: status };
        return <Tag color={config.color}>{config.text}</Tag>;
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 80,
        },
        {
            title: '开始时间',
            dataIndex: 'startAt',
            key: 'startAt',
            render: (text) => dayjs(text).format('YYYY-MM-DD HH:mm'),
        },
        {
            title: '结束时间',
            dataIndex: 'endAt',
            key: 'endAt',
            render: (text) => dayjs(text).format('YYYY-MM-DD HH:mm'),
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: getStatusTag,
        },
        {
            title: '创建时间',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text) => dayjs(text).format('YYYY-MM-DD HH:mm'),
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => handleUpdateStatus(record)}
                    >
                        修改状态
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: '24px' }}>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>在岗设置</h2>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                    添加时段
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={schedules}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 10 }}
            />

            {/* 添加时段对话框 */}
            <Modal
                title="添加时段"
                open={modalVisible}
                onOk={handleSubmit}
                onCancel={() => setModalVisible(false)}
                okText="确定"
                cancelText="取消"
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="时间范围"
                        name="timeRange"
                        rules={[{ required: true, message: '请选择时间范围' }]}
                    >
                        <DatePicker.RangePicker
                            showTime={{ format: 'HH:mm' }}
                            format="YYYY-MM-DD HH:mm"
                            style={{ width: '100%' }}
                        />
                    </Form.Item>

                    <Form.Item
                        label="状态"
                        name="status"
                        rules={[{ required: true, message: '请选择状态' }]}
                    >
                        <Select>
                            <Select.Option value="ON_DUTY">在岗</Select.Option>
                            <Select.Option value="OFF_DUTY">不在岗</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>

            {/* 修改状态对话框 */}
            <Modal
                title="修改状态"
                open={statusModalVisible}
                onOk={handleStatusSubmit}
                onCancel={() => setStatusModalVisible(false)}
                okText="确定"
                cancelText="取消"
            >
                <Form form={statusForm} layout="vertical">
                    <Form.Item
                        label="状态"
                        name="status"
                        rules={[{ required: true, message: '请选择状态' }]}
                    >
                        <Select>
                            <Select.Option value="ON_DUTY">在岗</Select.Option>
                            <Select.Option value="OFF_DUTY">不在岗</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Schedules;

