import { useState, useEffect } from 'react';
import { Table, Button, Modal, Tag, message, Space, Descriptions, Form, Input, Select, InputNumber } from 'antd';
import { EyeOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { doctorAppointmentApi } from '../../services/doctorAppointmentApi';
import { itemApi } from '../../services/itemApi';
import dayjs from 'dayjs';

const { TextArea } = Input;

const Appointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [detailVisible, setDetailVisible] = useState(false);
    const [consultVisible, setConsultVisible] = useState(false);
    const [currentAppointment, setCurrentAppointment] = useState(null);
    const [items, setItems] = useState([]);
    const [form] = Form.useForm();

    useEffect(() => {
        loadAppointments();
        loadItems();
    }, []);

    const loadAppointments = async () => {
        setLoading(true);
        try {
            const response = await doctorAppointmentApi.getMyAppointments();
            if (response.code === 200) {
                setAppointments(response.data);
            }
        } catch (error) {
            message.error('加载预约列表失败');
        } finally {
            setLoading(false);
        }
    };

    const loadItems = async () => {
        try {
            const response = await itemApi.getAllItems();
            if (response.code === 200) {
                setItems(response.data);
            }
        } catch (error) {
            console.error('加载药品服务项目失败', error);
        }
    };

    const handleViewDetail = async (record) => {
        try {
            const response = await doctorAppointmentApi.getAppointmentDetail(record.id);
            if (response.code === 200) {
                setCurrentAppointment(response.data);
                setDetailVisible(true);
            }
        } catch (error) {
            message.error('获取预约详情失败');
        }
    };

    const handleConsult = (record) => {
        setCurrentAppointment(record);
        form.resetFields();
        form.setFieldsValue({
            items: [{ itemId: undefined, quantity: 1 }]
        });
        setConsultVisible(true);
    };

    const handleCompleteConsult = async () => {
        try {
            const values = await form.validateFields();

            const response = await doctorAppointmentApi.completeConsultation(
                currentAppointment.id,
                values
            );

            if (response.code === 200) {
                message.success('会诊完成');
                setConsultVisible(false);
                loadAppointments();
            }
        } catch (error) {
            if (error.errorFields) {
                message.error('请填写完整信息');
            } else {
                message.error(error.message || '会诊失败');
            }
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

    const columns = [
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
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Button
                        type="link"
                        icon={<EyeOutlined />}
                        onClick={() => handleViewDetail(record)}
                    >
                        查看详情
                    </Button>
                    {record.status === 'PENDING' && (
                        <Button
                            type="primary"
                            icon={<CheckCircleOutlined />}
                            onClick={() => handleConsult(record)}
                        >
                            会诊
                        </Button>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: '24px' }}>
            <h2>我的预约</h2>

            <Table
                columns={columns}
                dataSource={appointments}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 10 }}
            />

            {/* 详情对话框 */}
            <Modal
                title="预约详情"
                open={detailVisible}
                onCancel={() => setDetailVisible(false)}
                footer={null}
                width={600}
            >
                {currentAppointment && (
                    <Descriptions column={1} bordered>
                        <Descriptions.Item label="患者姓名">{currentAppointment.patientName}</Descriptions.Item>
                        <Descriptions.Item label="年龄">{currentAppointment.patientAge}</Descriptions.Item>
                        <Descriptions.Item label="手机号">{currentAppointment.patientPhone}</Descriptions.Item>
                        <Descriptions.Item label="科室">{currentAppointment.departmentName}</Descriptions.Item>
                        <Descriptions.Item label="就诊时间">
                            {dayjs(currentAppointment.visitAt).format('YYYY-MM-DD HH:mm')}
                        </Descriptions.Item>
                        <Descriptions.Item label="状态">
                            {getStatusTag(currentAppointment.status)}
                        </Descriptions.Item>
                        <Descriptions.Item label="病情描述">
                            {currentAppointment.illnessDesc || '无'}
                        </Descriptions.Item>
                    </Descriptions>
                )}
            </Modal>

            {/* 会诊对话框 */}
            <Modal
                title="会诊"
                open={consultVisible}
                onOk={handleCompleteConsult}
                onCancel={() => setConsultVisible(false)}
                width={700}
                okText="完成会诊"
                cancelText="取消"
            >
                {currentAppointment && (
                    <>
                        <Descriptions column={2} bordered style={{ marginBottom: 24 }}>
                            <Descriptions.Item label="患者姓名">{currentAppointment.patientName}</Descriptions.Item>
                            <Descriptions.Item label="年龄">{currentAppointment.patientAge}</Descriptions.Item>
                            <Descriptions.Item label="病情描述" span={2}>
                                {currentAppointment.illnessDesc || '无'}
                            </Descriptions.Item>
                        </Descriptions>

                        <Form form={form} layout="vertical">
                            <Form.Item
                                label="医生建议"
                                name="advice"
                                rules={[{ required: true, message: '请填写医生建议' }]}
                            >
                                <TextArea rows={4} placeholder="请填写医生建议..." />
                            </Form.Item>

                            <Form.List name="items">
                                {(fields, { add, remove }) => (
                                    <>
                                        <div style={{ marginBottom: 8, fontWeight: 'bold' }}>药品/服务项目</div>
                                        {fields.map(({ key, name, ...restField }) => (
                                            <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'itemId']}
                                                    rules={[{ required: true, message: '请选择项目' }]}
                                                    style={{ width: 300 }}
                                                >
                                                    <Select placeholder="选择药品/服务">
                                                        {items.map(item => (
                                                            <Select.Option key={item.id} value={item.id}>
                                                                {item.name} - ¥{item.price} {item.type === 'DRUG' ? '(药品)' : '(服务)'}
                                                            </Select.Option>
                                                        ))}
                                                    </Select>
                                                </Form.Item>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'quantity']}
                                                    rules={[{ required: true, message: '请输入数量' }]}
                                                >
                                                    <InputNumber min={1} placeholder="数量" style={{ width: 100 }} />
                                                </Form.Item>
                                                <Button type="link" onClick={() => remove(name)} danger>
                                                    删除
                                                </Button>
                                            </Space>
                                        ))}
                                        <Button type="dashed" onClick={() => add()} block>
                                            + 添加项目
                                        </Button>
                                    </>
                                )}
                            </Form.List>
                        </Form>
                    </>
                )}
            </Modal>
        </div>
    );
};

export default Appointments;

