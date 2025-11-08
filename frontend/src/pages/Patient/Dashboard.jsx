import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Layout, Menu, Button, message } from 'antd';
import {
  HomeOutlined,
  CalendarOutlined,
  UnorderedListOutlined,
  FileTextOutlined,
  UserOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { logout } from '../../store/authSlice';
import { authApi } from '../../services/authApi';
import Home from './Home';
import Appointment from './Appointment';
import MyAppointments from './MyAppointments';
import Visits from './Visits';
import Profile from './Profile';
import './Dashboard.css';

const { Header, Sider, Content } = Layout;

const PatientDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userName } = useSelector((state) => state.auth);
  const [selectedMenu, setSelectedMenu] = useState('home');

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

  const handleMenuClick = (e) => {
    setSelectedMenu(e.key);
  };

  const menuItems = [
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: '首页',
    },
    {
      key: 'appointment',
      icon: <CalendarOutlined />,
      label: '预约挂号',
    },
    {
      key: 'my-appointments',
      icon: <UnorderedListOutlined />,
      label: '我的预约',
    },
    {
      key: 'my-visits',
      icon: <FileTextOutlined />,
      label: '我的就诊情况',
    },
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人信息',
    },
  ];

  const renderContent = () => {
    switch (selectedMenu) {
      case 'home':
        return <Home onMenuChange={setSelectedMenu} />;
      case 'appointment':
        return <Appointment />;
      case 'my-appointments':
        return <MyAppointments />;
      case 'my-visits':
        return <Visits />;
      case 'profile':
        return <Profile />;
      default:
        return <Home onMenuChange={setSelectedMenu} />;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header className="dashboard-header">
        <div className="logo">医院预约挂号系统 - 患者端</div>
        <div className="user-info">
          <span>欢迎，{userName}</span>
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
            selectedKeys={[selectedMenu]}
            items={menuItems}
            onClick={handleMenuClick}
            style={{ height: '100%', borderRight: 0 }}
          />
        </Sider>
        <Layout style={{ padding: '24px' }}>
          <Content
            style={{
              padding: 24,
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

export default PatientDashboard;

