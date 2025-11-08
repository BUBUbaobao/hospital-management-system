import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, message, Card } from 'antd';
import { UserOutlined, LockOutlined, PhoneOutlined, IdcardOutlined } from '@ant-design/icons';
import { authApi } from '../../services/authApi';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const handleRegister = async (values) => {
    setLoading(true);
    try {
      const response = await authApi.patientRegister(values);
      if (response.code === 200) {
        message.success('注册成功，请登录');
        navigate('/login');
      }
    } catch (error) {
      message.error(error.message || '注册失败');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="register-container">
      <Card className="register-card">
        <h1 className="register-title">患者注册</h1>
        <Form onFinish={handleRegister} autoComplete="off">
          <Form.Item
            name="account"
            rules={[
              { required: true, message: '请输入账号' },
              { min: 4, max: 20, message: '账号长度必须在4-20位之间' },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="账号（4-20位）" size="large" />
          </Form.Item>
          
          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, max: 20, message: '密码长度必须在6-20位之间' },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="密码（6-20位）" size="large" />
          </Form.Item>
          
          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: '请确认密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次密码输入不一致'));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="确认密码" size="large" />
          </Form.Item>
          
          <Form.Item
            name="phone"
            rules={[
              { required: true, message: '请输入手机号' },
              { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' },
            ]}
          >
            <Input prefix={<PhoneOutlined />} placeholder="手机号（11位）" size="large" />
          </Form.Item>
          
          <Form.Item
            name="realName"
            rules={[
              { required: true, message: '请输入真实姓名' },
              { min: 2, max: 20, message: '姓名长度必须在2-20位之间' },
            ]}
          >
            <Input prefix={<IdcardOutlined />} placeholder="真实姓名" size="large" />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block size="large">
              注册
            </Button>
          </Form.Item>
          
          <div className="login-link">
            已有账号？<Link to="/login">立即登录</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Register;

