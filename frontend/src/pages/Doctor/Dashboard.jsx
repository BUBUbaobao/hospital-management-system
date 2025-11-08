import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Layout, Menu, Button, message } from 'antd';
import {
  HomeOutlined,
  UnorderedListOutlined,
  ClockCircleOutlined,
  UserOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { logout } from '../../store/authSlice';
import { authApi } from '../../services/authApi';
import DoctorHome from './Home';
import Appointments from './Appointments';
import Schedules from './Schedules';
import Profile from './Profile';
import '../Patient/Dashboard.css';

const { Header, Sider, Content } = Layout;

const DoctorDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userName } = useSelector((state) => state.auth);
  const [selectedKey, setSelectedKey] = useState('home');

  const handleLogout = async () => {
    try {
      await authApi.logout();
      dispatch(logout());
      message.success('退出成功');
      navigate('/login');
    } catch (error) {
      dispatch(logout());
      navigate('/login');
    }
  };

  const menuItems = [
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: '工作台',
    },
    {
      key: 'appointments',
      icon: <UnorderedListOutlined />,
      label: '我的预约',
    },
    {
      key: 'schedules',
      icon: <ClockCircleOutlined />,
      label: '在岗设置',
    },
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人信息',
    },
  ];

  const renderContent = () => {
    switch (selectedKey) {
      case 'home':
        return <DoctorHome onMenuChange={setSelectedKey} />;
      case 'appointments':
        return <Appointments />;
      case 'schedules':
        return <Schedules />;
      case 'profile':
        return <Profile />;
      default:
        return <DoctorHome onMenuChange={setSelectedKey} />;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header className="dashboard-header">
        <div className="logo">医院预约挂号系统 - 医生端</div>
        <div className="user-info">
          <span>欢迎，{userName} 医生</span>
          <Button
            type="link"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
          >
            退出
          </Button>
        </div>
      </Header>
      <Layout>
        <Sider width={200} theme="light">
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            items={menuItems}
            onClick={({ key }) => setSelectedKey(key)}
            style={{ height: '100%', borderRight: 0 }}
          />
        </Sider>
        <Layout style={{ padding: '0' }}>
          <Content
            style={{
              margin: 0,
              minHeight: 280,
              background: '#fff',
            }}
          >
            {renderContent()}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default DoctorDashboard;

