import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Tabs, Form, Input, Button, message, Card } from 'antd';
import { UserOutlined, LockOutlined, SafetyOutlined, MedicineBoxOutlined } from '@ant-design/icons';
import { authApi } from '../../services/authApi';
import { login } from '../../store/authSlice';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('patient');

  const handlePatientLogin = async (values) => {
    setLoading(true);
    try {
      const response = await authApi.patientLogin(values);
      if (response.code === 200) {
        dispatch(login(response.data));
        message.success('登录成功');
        navigate('/patient/dashboard');
      }
    } catch (error) {
      message.error(error.message || '登录失败');
    } finally {
      setLoading(false);
    }
  };

  const handleDoctorLogin = async (values) => {
    setLoading(true);
    try {
      const response = await authApi.doctorLogin(values);
      if (response.code === 200) {
        dispatch(login(response.data));
        message.success('登录成功');
        navigate('/doctor/dashboard');
      }
    } catch (error) {
      message.error(error.message || '登录失败');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async (values) => {
    setLoading(true);
    try {
      const response = await authApi.adminLogin(values);
      if (response.code === 200) {
        dispatch(login(response.data));
        message.success('登录成功');
        navigate('/admin/dashboard');
      }
    } catch (error) {
      message.error(error.message || '登录失败');
    } finally {
      setLoading(false);
    }
  };

  const tabItems = [
    {
      key: 'patient',
      label: '患者登录',
      children: (
        <Form onFinish={handlePatientLogin} autoComplete="off">
          <Form.Item
            name="account"
            rules={[{ required: true, message: '请输入账号' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="账号" size="large" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="密码" size="large" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block size="large">
              登录
            </Button>
          </Form.Item>
          <div className="register-link">
            还没有账号？<Link to="/register">立即注册</Link>
          </div>
        </Form>
      ),
    },
    {
      key: 'doctor',
      label: '医生登录',
      children: (
        <Form onFinish={handleDoctorLogin} autoComplete="off">
          <Form.Item
            name="account"
            rules={[{ required: true, message: '请输入账号' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="账号" size="large" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="密码" size="large" />
          </Form.Item>
          <Form.Item
            name="verifyCode"
            rules={[{ required: true, message: '请输入校验码' }]}
          >
            <Input prefix={<SafetyOutlined />} placeholder="校验码（Doctor）" size="large" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block size="large">
              登录
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: 'admin',
      label: '管理员登录',
      children: (
        <Form onFinish={handleAdminLogin} autoComplete="off">
          <Form.Item
            name="account"
            rules={[{ required: true, message: '请输入账号' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="账号" size="large" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="密码" size="large" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block size="large">
              登录
            </Button>
          </Form.Item>
        </Form>
      ),
    },
  ];

  return (
    <div className="login-container">
      <Card className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <MedicineBoxOutlined />
          </div>
          <h1 className="login-title">医院预约挂号系统</h1>
          <p className="login-subtitle">便捷预约 · 智慧医疗</p>
        </div>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          centered
          size="large"
        />
      </Card>
    </div>
  );
};

export default Login;

