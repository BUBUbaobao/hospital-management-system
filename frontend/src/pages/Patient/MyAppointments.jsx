import { useState, useEffect } from 'react';
import { Table, Tag, Button, Modal, message, Space } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { appointmentApi } from '../../services/appointmentApi';
import dayjs from 'dayjs';

const { confirm } = Modal;

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    loadAppointments();
  }, []);
  
  const loadAppointments = async () => {
    setLoading(true);
    try {
      const response = await appointmentApi.getMine();
      if (response.code === 200) {
        setAppointments(response.data);
      }
    } catch (error) {
      message.error('加载预约列表失败');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCancel = (record) => {
    confirm({
      title: '确认退号',
      icon: <ExclamationCircleOutlined />,
      content: `确定要退订 ${record.doctorName} 医生的预约吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          const response = await appointmentApi.cancel(record.id);
          if (response.code === 200) {
            message.success('退号成功');
            loadAppointments();
          }
        } catch (error) {
          message.error(error.message || '退号失败');
        }
      },
    });
  };
  
  const getStatusTag = (status) => {
    const statusMap = {
      PENDING: { color: 'blue', text: '待就诊' },
      VISITED: { color: 'green', text: '已就诊' },
      CANCELLED: { color: 'default', text: '已退号' },
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
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => getStatusTag(status),
    },
    {
      title: '病情描述',
      dataIndex: 'illnessDesc',
      key: 'illnessDesc',
      ellipsis: true,
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
      render: (_, record) => {
        if (record.status === 'PENDING') {
          return (
            <Button 
              danger 
              size="small" 
              onClick={() => handleCancel(record)}
            >
              退号
            </Button>
          );
        }
        return null;
      },
    },
  ];
  
  return (
    <div className="my-appointments-container">
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>我的预约</h2>
          <Button type="primary" onClick={loadAppointments}>
            刷新
          </Button>
        </div>
        
        <Table
          columns={columns}
          dataSource={appointments}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Space>
    </div>
  );
};

export default MyAppointments;

