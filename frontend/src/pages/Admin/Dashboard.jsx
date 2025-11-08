import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Layout, Menu, Button, message } from 'antd';
import {
  HomeOutlined,
  TeamOutlined,
  MedicineBoxOutlined,
  BarChartOutlined,
  TrophyOutlined,
  FileSearchOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { logout } from '../../store/authSlice';
import { authApi } from '../../services/authApi';
import Home from './Home';
import Doctors from './Doctors';
import Departments from './Departments';
import Statistics from './Statistics';
import Rankings from './Rankings';
import Records from './Records';
import '../Patient/Dashboard.css';

const { Header, Sider, Content } = Layout;

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
      key: 'departments',
      icon: <MedicineBoxOutlined />,
      label: '科室管理',
    },
    {
      key: 'doctors',
      icon: <TeamOutlined />,
      label: '医生管理',
    },
    {
      key: 'statistics',
      icon: <BarChartOutlined />,
      label: '数据统计',
    },
    {
      key: 'rankings',
      icon: <TrophyOutlined />,
      label: '评分排行',
    },
    {
      key: 'records',
      icon: <FileSearchOutlined />,
      label: '预约就诊信息',
    },
  ];

  const renderContent = () => {
    switch (selectedMenu) {
      case 'home':
        return <Home onMenuChange={setSelectedMenu} />;
      case 'departments':
        return <Departments />;
      case 'doctors':
        return <Doctors />;
      case 'statistics':
        return <Statistics />;
      case 'rankings':
        return <Rankings />;
      case 'records':
        return <Records />;
      default:
        return <Home onMenuChange={setSelectedMenu} />;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header className="dashboard-header">
        <div className="logo">医院预约挂号系统 - 管理端</div>
        <div className="user-info">
          <span>管理员</span>
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

export default AdminDashboard;

