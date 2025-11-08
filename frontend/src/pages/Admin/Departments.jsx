import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Switch, message, Space, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { adminApi } from '../../services/adminApi';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState(null);
  const [form] = Form.useForm();
  
  useEffect(() => {
    loadDepartments();
  }, []);
  
  const loadDepartments = async () => {
    setLoading(true);
    try {
      const response = await adminApi.departments.getAll();
      if (response.code === 200) {
        setDepartments(response.data);
      }
    } catch (error) {
      message.error('加载科室列表失败');
    } finally {
      setLoading(false);
    }
  };
  
  const handleAdd = () => {
    setEditMode(false);
    form.resetFields();
    form.setFieldsValue({ enabled: true });
    setModalVisible(true);
  };
  
  const handleEdit = (record) => {
    setEditMode(true);
    setCurrentDepartment(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };
  
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      let response;
      if (editMode) {
        response = await adminApi.departments.update(currentDepartment.id, values);
      } else {
        response = await adminApi.departments.add(values);
      }
      
      if (response.code === 200) {
        message.success(editMode ? '修改成功' : '添加成功');
        setModalVisible(false);
        loadDepartments();
      }
    } catch (error) {
      if (error.errorFields) {
        return;
      }
      message.error(error.message || (editMode ? '修改失败' : '添加失败'));
    }
  };
  
  const handleDelete = (record) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除科室 ${record.name} 吗？删除后相关医生的擅长科室会同步更新。`,
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          const response = await adminApi.departments.delete(record.id);
          if (response.code === 200) {
            message.success('删除成功');
            loadDepartments();
          }
        } catch (error) {
          message.error(error.message || '删除失败');
        }
      },
    });
  };
  
  const columns = [
    {
      title: '科室ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '科室名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      key: 'enabled',
      render: (enabled) => (
        <Tag color={enabled ? 'green' : 'red'}>
          {enabled ? '启用' : '禁用'}
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
            onClick={() => handleEdit(record)}
          >
            编辑
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
          <h2>科室管理</h2>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            添加科室
          </Button>
        </div>
        
        <Table
          columns={columns}
          dataSource={departments}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `共 ${total} 个科室`,
          }}
        />
      </Space>
      
      <Modal
        title={editMode ? '编辑科室' : '添加科室'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={600}
        okText="确定"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="科室名称"
            rules={[
              { required: true, message: '请输入科室名称' },
              { max: 64, message: '科室名称不能超过64个字符' },
            ]}
          >
            <Input placeholder="请输入科室名称" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="科室描述"
            rules={[
              { max: 500, message: '科室描述不能超过500个字符' },
            ]}
          >
            <Input.TextArea 
              placeholder="请输入科室描述" 
              rows={4}
              showCount
              maxLength={500}
            />
          </Form.Item>
          
          <Form.Item
            name="enabled"
            label="是否启用"
            valuePropName="checked"
          >
            <Switch checkedChildren="启用" unCheckedChildren="禁用" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Departments;

