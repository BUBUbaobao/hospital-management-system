import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Slider, Input, message, Descriptions, Space, Checkbox } from 'antd';
import { EyeOutlined, StarOutlined } from '@ant-design/icons';
import { visitApi } from '../../services/visitApi';
import { reviewApi } from '../../services/reviewApi';
import dayjs from 'dayjs';

const { TextArea } = Input;

const Visits = () => {
    const [visits, setVisits] = useState([]);
    const [loading, setLoading] = useState(false);
    const [detailVisible, setDetailVisible] = useState(false);
    const [reviewVisible, setReviewVisible] = useState(false);
    const [currentVisit, setCurrentVisit] = useState(null);
    const [reviewedVisits, setReviewedVisits] = useState(new Set());
    const [form] = Form.useForm();

    useEffect(() => {
        loadVisits();
    }, []);

    const loadVisits = async () => {
        setLoading(true);
        try {
            const response = await visitApi.getMyVisits();
            if (response.code === 200) {
                setVisits(response.data);
            }
        } catch (error) {
            message.error('加载就诊记录失败');
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetail = async (record) => {
        try {
            const response = await visitApi.getVisitDetail(record.id);
            if (response.code === 200) {
                setCurrentVisit(response.data);
                setDetailVisible(true);
            }
        } catch (error) {
            message.error('获取就诊详情失败');
        }
    };

    const handleReview = (record) => {
        setCurrentVisit(record);
        form.resetFields();
        form.setFieldsValue({
            score: 8,
            reviewDoctor: true,
            reviewDepartment: false,
        });
        setReviewVisible(true);
    };

    const handleSubmitReview = async () => {
        try {
            const values = await form.validateFields();

            const data = {
                visitId: currentVisit.id,
                score: values.score,
                comment: values.comment,
            };

            // 根据勾选情况设置 doctorId 和 departmentId
            if (values.reviewDoctor && currentVisit.doctorId) {
                data.doctorId = currentVisit.doctorId;
            }

            if (values.reviewDepartment && currentVisit.departmentId) {
                data.departmentId = currentVisit.departmentId;
            }

            if (!data.doctorId && !data.departmentId) {
                message.error('请至少选择评价医生或科室');
                return;
            }

            const response = await reviewApi.createReview(data);

            if (response.code === 200) {
                message.success('评价成功');
                setReviewVisible(false);
                setReviewedVisits(prev => new Set(prev).add(currentVisit.id));
            }
        } catch (error) {
            if (error.errorFields) {
                message.error('请填写完整信息');
            } else {
                message.error(error.message || '评价失败');
            }
        }
    };

    const columns = [
        {
            title: '就诊ID',
            dataIndex: 'id',
            key: 'id',
            width: 80,
        },
        {
            title: '科室',
            dataIndex: 'departmentName',
            key: 'departmentName',
        },
        {
            title: '医生',
            dataIndex: 'doctorName',
            key: 'doctorName',
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
            render: (_, record) => (
                <Space>
                    <Button
                        type="link"
                        icon={<EyeOutlined />}
                        onClick={() => handleViewDetail(record)}
                    >
                        查看详情
                    </Button>
                    {!reviewedVisits.has(record.id) && (
                        <Button
                            type="primary"
                            icon={<StarOutlined />}
                            onClick={() => handleReview(record)}
                        >
                            评价
                        </Button>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: '24px' }}>
            <h2>我的就诊情况</h2>

            <Table
                columns={columns}
                dataSource={visits}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 10 }}
            />

            {/* 详情对话框 */}
            <Modal
                title="就诊详情"
                open={detailVisible}
                onCancel={() => setDetailVisible(false)}
                footer={null}
                width={700}
            >
                {currentVisit && (
                    <>
                        <Descriptions column={2} bordered>
                            <Descriptions.Item label="科室">{currentVisit.departmentName}</Descriptions.Item>
                            <Descriptions.Item label="医生">{currentVisit.doctorName}</Descriptions.Item>
                            <Descriptions.Item label="就诊时间">
                                {dayjs(currentVisit.visitAt).format('YYYY-MM-DD HH:mm')}
                            </Descriptions.Item>
                            <Descriptions.Item label="费用">
                                ¥{currentVisit.totalFee}
                            </Descriptions.Item>
                            <Descriptions.Item label="医生建议" span={2}>
                                {currentVisit.doctorAdvice}
                            </Descriptions.Item>
                        </Descriptions>

                        <h3 style={{ marginTop: 24, marginBottom: 16 }}>药品/服务清单</h3>
                        <Table
                            dataSource={currentVisit.items}
                            rowKey="id"
                            pagination={false}
                            columns={[
                                { title: '项目名称', dataIndex: 'itemName', key: 'itemName' },
                                { title: '数量', dataIndex: 'quantity', key: 'quantity' },
                                { title: '单价', dataIndex: 'unitPrice', key: 'unitPrice', render: (price) => `¥${price}` },
                                { title: '小计', dataIndex: 'totalAmount', key: 'totalAmount', render: (amount) => `¥${amount}` },
                            ]}
                        />
                    </>
                )}
            </Modal>

            {/* 评价对话框 */}
            <Modal
                title="评价"
                open={reviewVisible}
                onOk={handleSubmitReview}
                onCancel={() => setReviewVisible(false)}
                okText="提交评价"
                cancelText="取消"
            >
                {currentVisit && (
                    <>
                        <p style={{ marginBottom: 16 }}>
                            科室：{currentVisit.departmentName} | 医生：{currentVisit.doctorName}
                        </p>

                        <Form form={form} layout="vertical">
                            <Form.Item label="评价对象">
                                <Form.Item name="reviewDoctor" valuePropName="checked" noStyle>
                                    <Checkbox>评价医生</Checkbox>
                                </Form.Item>
                                <Form.Item name="reviewDepartment" valuePropName="checked" noStyle style={{ marginLeft: 16 }}>
                                    <Checkbox>评价科室</Checkbox>
                                </Form.Item>
                            </Form.Item>

                            <Form.Item
                                label="评分 (1-10分)"
                                name="score"
                                rules={[{ required: true, message: '请选择评分' }]}
                            >
                                <Slider min={1} max={10} marks={{ 1: '1', 5: '5', 10: '10' }} />
                            </Form.Item>

                            <Form.Item
                                label="评价内容"
                                name="comment"
                            >
                                <TextArea rows={4} placeholder="请填写评价内容（选填）..." />
                            </Form.Item>
                        </Form>
                    </>
                )}
            </Modal>
        </div>
    );
};

export default Visits;

