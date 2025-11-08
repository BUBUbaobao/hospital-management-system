import { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Button, Card, message, Avatar, Upload, Row, Col, Divider, Space } from 'antd';
import { UserOutlined, UploadOutlined, SaveOutlined } from '@ant-design/icons';
import { profileApi } from '../../services/profileApi';

const PatientProfile = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState(null);
    const [avatarUrl, setAvatarUrl] = useState('');

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const response = await profileApi.patient.getProfile();
            if (response.code === 200) {
                console.log('加载的个人信息:', response.data);
                console.log('头像URL长度:', response.data.avatarUrl?.length || 0);
                setProfile(response.data);
                setAvatarUrl(response.data.avatarUrl || '');
                form.setFieldsValue({
                    age: response.data.age,
                    height: response.data.height,
                    weight: response.data.weight,
                });
            }
        } catch (error) {
            message.error('加载个人信息失败');
        }
    };

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const data = {
                ...values,
                avatarUrl: avatarUrl || null,
            };

            console.log('提交的数据:', { ...data, avatarUrl: data.avatarUrl ? `Base64(${data.avatarUrl.length}字符)` : null });

            const response = await profileApi.patient.updateProfile(data);
            if (response.code === 200) {
                message.success('更新成功');
                setProfile(response.data);
                setAvatarUrl(response.data.avatarUrl || '');
                console.log('返回的头像URL长度:', response.data.avatarUrl?.length || 0);
            }
        } catch (error) {
            console.error('更新失败:', error);
            message.error(error.message || '更新失败');
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = (file) => {
        console.log('handleUpload被调用，文件:', file);

        // 验证文件类型
        const isImage = file.type?.startsWith('image/');
        if (!isImage) {
            message.error('只能上传图片文件！');
            return false;
        }

        console.log('文件验证通过，开始读取...');

        // 压缩并转换为base64
        const reader = new FileReader();
        reader.onload = (e) => {
            console.log('文件读取完成，开始压缩...');
            const img = new Image();
            img.onload = () => {
                console.log('图片加载完成，原始尺寸:', img.width, 'x', img.height);

                // 创建canvas进行压缩
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // 限制最大尺寸为400x400
                const maxSize = 400;
                if (width > maxSize || height > maxSize) {
                    if (width > height) {
                        height = (height * maxSize) / width;
                        width = maxSize;
                    } else {
                        width = (width * maxSize) / height;
                        height = maxSize;
                    }
                }

                console.log('压缩后尺寸:', width, 'x', height);

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // 转换为base64，质量0.7
                const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
                console.log('Base64生成完成，长度:', compressedBase64.length);

                setAvatarUrl(compressedBase64);
                console.log('avatarUrl状态已更新');
                message.success('头像已选择，请点击保存');
            };

            img.onerror = () => {
                console.error('图片加载失败');
                message.error('图片加载失败，请选择其他图片');
            };

            img.src = e.target.result;
        };

        reader.onerror = () => {
            console.error('文件读取失败');
            message.error('文件读取失败');
        };

        reader.readAsDataURL(file);

        return false; // 阻止自动上传
    };

    if (!profile) {
        return (
            <div style={{ padding: '24px', textAlign: 'center' }}>
                <div>加载中...</div>
            </div>
        );
    }

    return (
        <div style={{ padding: '24px', background: '#f0f2f5', minHeight: 'calc(100vh - 64px)' }}>
            <Row gutter={24} justify="center">
                <Col xs={24} sm={24} md={20} lg={16} xl={12}>
                    <Card
                        title={
                            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                                <UserOutlined style={{ marginRight: 8 }} />
                                个人信息
                            </div>
                        }
                        bordered={false}
                        style={{
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            borderRadius: '8px'
                        }}
                    >
                        {/* 头像区域 */}
                        <div style={{
                            textAlign: 'center',
                            marginBottom: 32,
                            padding: '24px',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            borderRadius: '8px',
                            color: 'white'
                        }}>
                            <Avatar
                                size={100}
                                icon={<UserOutlined />}
                                src={avatarUrl}
                                style={{
                                    border: '4px solid white',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                                }}
                            />
                            <div style={{ marginTop: 16, fontSize: '18px', fontWeight: 'bold' }}>
                                {profile.realName}
                            </div>
                            <div style={{ marginTop: 8, opacity: 0.9 }}>
                                {profile.account}
                            </div>
                        </div>

                        <Divider orientation="left">基本信息</Divider>

                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleSubmit}
                            size="large"
                        >
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item label="手机号">
                                        <Input
                                            value={profile.phone}
                                            disabled
                                            style={{ background: '#f5f5f5' }}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="年龄"
                                        name="age"
                                    >
                                        <InputNumber
                                            min={1}
                                            max={150}
                                            style={{ width: '100%' }}
                                            placeholder="请输入年龄"
                                            suffix="岁"
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        label="身高"
                                        name="height"
                                    >
                                        <InputNumber
                                            min={1}
                                            max={300}
                                            precision={1}
                                            style={{ width: '100%' }}
                                            placeholder="请输入身高"
                                            suffix="cm"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="体重"
                                        name="weight"
                                    >
                                        <InputNumber
                                            min={1}
                                            max={500}
                                            precision={1}
                                            style={{ width: '100%' }}
                                            placeholder="请输入体重"
                                            suffix="kg"
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Divider orientation="left">头像设置</Divider>

                            <Form.Item label="上传头像">
                                <Upload
                                    beforeUpload={handleUpload}
                                    showUploadList={false}
                                    accept="image/*"
                                >
                                    <Button icon={<UploadOutlined />}>选择本地图片</Button>
                                </Upload>
                                <div style={{
                                    marginTop: 8,
                                    color: '#999',
                                    fontSize: '12px'
                                }}>
                                    支持jpg、png等格式，图片将自动压缩为400x400以内
                                </div>
                            </Form.Item>

                            <Form.Item style={{ marginTop: 32 }}>
                                <Space style={{ width: '100%' }} direction="vertical">
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        loading={loading}
                                        icon={<SaveOutlined />}
                                        size="large"
                                        block
                                        style={{
                                            height: '48px',
                                            fontSize: '16px',
                                            borderRadius: '6px'
                                        }}
                                    >
                                        保存修改
                                    </Button>
                                </Space>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default PatientProfile;

