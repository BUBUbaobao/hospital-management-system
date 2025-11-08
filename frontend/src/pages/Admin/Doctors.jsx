import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Space, Tag, Upload } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons';
import { adminApi } from '../../services/adminApi';
import { departmentApi } from '../../services/departmentApi';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [currentDoctor, setCurrentDoctor] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();
  const [statusForm] = Form.useForm();
  
  useEffect(() => {
    loadDoctors();
    loadDepartments();
  }, []);
  
  const loadDoctors = async () => {
    setLoading(true);
    try {
      const response = await adminApi.doctors.getAll();
      if (response.code === 200) {
        setDoctors(response.data);
      }
    } catch (error) {
      message.error('加载医生列表失败');
    } finally {
      setLoading(false);
    }
  };
  
  const loadDepartments = async () => {
    try {
      const response = await departmentApi.getAll();
      if (response.code === 200) {
        setDepartments(response.data);
      }
    } catch (error) {
      message.error('加载科室列表失败');
    }
  };
  
  const handleAdd = () => {
    form.resetFields();
    setFileList([]);
    setModalVisible(true);
  };
  
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      // 如果有选择文件，使用文件路径
      if (fileList.length > 0) {
        values.avatarUrl = fileList[0].name;
      }
      
      const response = await adminApi.doctors.add(values);
      
      if (response.code === 200) {
        message.success('添加医生成功');
        setModalVisible(false);
        setFileList([]);
        loadDoctors();
      }
    } catch (error) {
      if (error.errorFields) {
        // 表单验证错误
        return;
      }
      message.error(error.message || '添加医生失败');
    }
  };
  
  const handleEditStatus = (record) => {
    setCurrentDoctor(record);
    statusForm.setFieldsValue({ status: record.status });
    setStatusModalVisible(true);
  };
  
  const handleStatusSubmit = async () => {
    try {
      const values = await statusForm.validateFields();
      const response = await adminApi.doctors.updateStatus(currentDoctor.id, values.status);
      
      if (response.code === 200) {
        message.success('修改状态成功');
        setStatusModalVisible(false);
        loadDoctors();
      }
    } catch (error) {
      message.error(error.message || '修改状态失败');
    }
  };
  
  const handleFileChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };
  
  const beforeUpload = (file) => {
    // 不实际上传，只保存文件信息
    return false;
  };
  
  const handleDelete = (record) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除医生 ${record.name} 吗？删除后该医生将无法登录系统。`,
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          const response = await adminApi.doctors.delete(record.id);
          if (response.code === 200) {
            message.success('删除成功');
            loadDoctors();
          }
        } catch (error) {
          message.error(error.message || '删除失败');
        }
      },
    });
  };
  
  const columns = [
    {
      title: '医生ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '账号',
      dataIndex: 'account',
      key: 'account',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '擅长科室',
      dataIndex: 'departments',
      key: 'departments',
      render: (departments) => (
        <Space>
          {departments?.map(dept => (
            <Tag key={dept.id} color="blue">{dept.name}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '在岗状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'ON_DUTY' ? 'green' : 'red'}>
          {status === 'ON_DUTY' ? '在岗' : '不在岗'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditStatus(record)}
          >
            修改状态
          </Button>
          <Button
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];
  
  return (
    <div>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h2>医生管理</h2>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            添加医生
          </Button>
        </div>
        
        <Table
          columns={columns}
          dataSource={doctors}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `共 ${total} 位医生`,
          }}
        />
      </Space>
      
      <Modal
        title="添加医生"
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={600}
        okText="确定"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="account"
            label="账号"
            rules={[
              { required: true, message: '请输入账号' },
              { min: 4, max: 20, message: '账号长度必须在4-20位之间' },
            ]}
          >
            <Input placeholder="请输入医生账号" />
          </Form.Item>
          
          <Form.Item
            name="password"
            label="密码"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, max: 20, message: '密码长度必须在6-20位之间' },
            ]}
          >
            <Input.Password placeholder="请输入密码" />
          </Form.Item>
          
          <Form.Item
            name="name"
            label="姓名"
            rules={[
              { required: true, message: '请输入姓名' },
              { min: 2, max: 20, message: '姓名长度必须在2-20位之间' },
            ]}
          >
            <Input placeholder="请输入医生姓名" />
          </Form.Item>
          
          <Form.Item
            name="departmentIds"
            label="擅长科室"
            rules={[{ required: true, message: '请至少选择一个科室' }]}
          >
            <Select
              mode="multiple"
              placeholder="请选择擅长科室"
              options={departments.map(dept => ({
                label: dept.name,
                value: dept.id,
              }))}
            />
          </Form.Item>
          
          <Form.Item
            name="avatarUrl"
            label="头像"
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              <Upload
                fileList={fileList}
                onChange={handleFileChange}
                beforeUpload={beforeUpload}
                maxCount={1}
                accept="image/*"
              >
                <Button icon={<UploadOutlined />}>选择本地图片</Button>
              </Upload>
              <Input placeholder="或输入头像URL" />
            </Space>
          </Form.Item>
        </Form>
      </Modal>
      
      <Modal
        title="修改医生状态"
        open={statusModalVisible}
        onOk={handleStatusSubmit}
        onCancel={() => setStatusModalVisible(false)}
        okText="确定"
        cancelText="取消"
      >
        <Form form={statusForm} layout="vertical">
          <Form.Item
            name="status"
            label="在岗状态"
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

export default Doctors;

