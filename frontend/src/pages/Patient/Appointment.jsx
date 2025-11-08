import { useState, useEffect } from 'react';
import { Steps, Card, List, Button, DatePicker, TimePicker, Input, message, Space, Avatar } from 'antd';
import { MedicineBoxOutlined, UserOutlined, ClockCircleOutlined, FileTextOutlined } from '@ant-design/icons';
import { departmentApi } from '../../services/departmentApi';
import { doctorApi } from '../../services/doctorApi';
import { appointmentApi } from '../../services/appointmentApi';
import dayjs from 'dayjs';
import './Appointment.css';

const { TextArea } = Input;

const Appointment = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [illnessDesc, setIllnessDesc] = useState('');

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    setLoading(true);
    try {
      const response = await departmentApi.getAll();
      if (response.code === 200) {
        setDepartments(response.data);
      }
    } catch (error) {
      message.error('加载科室列表失败');
    } finally {
      setLoading(false);
    }
  };

  const loadDoctors = async (departmentId) => {
    setLoading(true);
    try {
      const response = await doctorApi.getAll(departmentId);
      if (response.code === 200) {
        setDoctors(response.data);
      }
    } catch (error) {
      message.error('加载医生列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleDepartmentSelect = (department) => {
    setSelectedDepartment(department);
    loadDoctors(department.id);
    setCurrentStep(1);
  };

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setCurrentStep(2);
  };

  const handleDateTimeConfirm = () => {
    if (!selectedDate || !selectedTime) {
      message.warning('请选择就诊日期和时间');
      return;
    }
    setCurrentStep(3);
  };

  const handleSubmit = async () => {
    if (!illnessDesc) {
      message.warning('请填写病情描述');
      return;
    }

    const visitDateTime = dayjs(selectedDate)
      .hour(selectedTime.hour())
      .minute(selectedTime.minute())
      .second(0);

    setLoading(true);
    try {
      const response = await appointmentApi.create({
        doctorId: selectedDoctor.id,
        departmentId: selectedDepartment.id,
        visitAt: visitDateTime.format('YYYY-MM-DDTHH:mm:ss'),
        illnessDesc: illnessDesc,
      });

      if (response.code === 200) {
        message.success('预约成功！');
        // 重置表单
        resetForm();
      }
    } catch (error) {
      message.error(error.message || '预约失败');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCurrentStep(0);
    setSelectedDepartment(null);
    setSelectedDoctor(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setIllnessDesc('');
  };

  const disabledDate = (current) => {
    if (!current) return true;
    const now = dayjs();
    const minDate = now.add(1, 'day').startOf('day');
    const maxDate = now.add(7, 'day').endOf('day');
    return current < minDate || current > maxDate;
  };

  const steps = [
    { title: '选择科室', icon: <MedicineBoxOutlined /> },
    { title: '选择医生', icon: <UserOutlined /> },
    { title: '选择时间', icon: <ClockCircleOutlined /> },
    { title: '填写信息', icon: <FileTextOutlined /> },
  ];

  return (
    <div className="appointment-container">
      <Card title="预约挂号" bordered={false}>
        <Steps current={currentStep} items={steps} style={{ marginBottom: 32 }} />

        {currentStep === 0 && (
          <div>
            <h3>请选择科室</h3>
            <List
              grid={{ gutter: 16, column: 3 }}
              dataSource={departments}
              loading={loading}
              renderItem={(dept) => (
                <List.Item>
                  <Card
                    hoverable
                    onClick={() => handleDepartmentSelect(dept)}
                    className="department-card"
                  >
                    <h4>{dept.name}</h4>
                    <p>{dept.description}</p>
                  </Card>
                </List.Item>
              )}
            />
          </div>
        )}

        {currentStep === 1 && (
          <div>
            <h3>请选择医生（{selectedDepartment?.name}）</h3>
            <Button onClick={() => setCurrentStep(0)} style={{ marginBottom: 16 }}>
              返回上一步
            </Button>
            <List
              dataSource={doctors}
              loading={loading}
              renderItem={(doctor) => (
                <List.Item>
                  <Card
                    hoverable
                    onClick={() => handleDoctorSelect(doctor)}
                    className="doctor-card"
                  >
                    <Space size="large">
                      <Avatar
                        src={doctor.avatarUrl}
                        icon={!doctor.avatarUrl && <UserOutlined />}
                        size={64}
                      />
                      <div>
                        <h4>{doctor.name}</h4>
                        <p>状态: {doctor.status === 'ON_DUTY' ? '✅ 在岗' : '❌ 不在岗'}</p>
                        <p>擅长科室: {doctor.departments?.map(d => d.name).join('、')}</p>
                      </div>
                    </Space>
                  </Card>
                </List.Item>
              )}
            />
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <h3>请选择就诊时间</h3>
            <Button onClick={() => setCurrentStep(1)} style={{ marginBottom: 16 }}>
              返回上一步
            </Button>
            <div className="time-selection">
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <div>
                  <label>就诊日期（可预约未来1-7天）：</label>
                  <DatePicker
                    value={selectedDate}
                    onChange={setSelectedDate}
                    disabledDate={disabledDate}
                    style={{ width: '100%', marginTop: 8 }}
                    placeholder="选择日期"
                  />
                </div>
                <div>
                  <label>就诊时间：</label>
                  <TimePicker
                    value={selectedTime}
                    onChange={setSelectedTime}
                    format="HH:mm"
                    style={{ width: '100%', marginTop: 8 }}
                    placeholder="选择时间"
                  />
                </div>
                <Button type="primary" onClick={handleDateTimeConfirm} block>
                  下一步
                </Button>
              </Space>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div>
            <h3>确认预约信息</h3>
            <Button onClick={() => setCurrentStep(2)} style={{ marginBottom: 16 }}>
              返回上一步
            </Button>
            <Card className="confirm-card">
              <p><strong>科室：</strong>{selectedDepartment?.name}</p>
              <p><strong>医生：</strong>{selectedDoctor?.name}</p>
              <p><strong>就诊时间：</strong>
                {selectedDate && selectedTime &&
                  dayjs(selectedDate).format('YYYY-MM-DD') + ' ' +
                  selectedTime.format('HH:mm')}
              </p>
              <div style={{ marginTop: 16 }}>
                <label>病情描述（选填）：</label>
                <TextArea
                  value={illnessDesc}
                  onChange={(e) => setIllnessDesc(e.target.value)}
                  placeholder="请简要描述您的病情"
                  maxLength={500}
                  rows={4}
                  showCount
                  style={{ marginTop: 8 }}
                />
              </div>
              <Space style={{ marginTop: 24, width: '100%' }} direction="vertical">
                <Button type="primary" onClick={handleSubmit} loading={loading} block size="large">
                  确认预约
                </Button>
                <Button onClick={resetForm} block>
                  重新预约
                </Button>
              </Space>
            </Card>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Appointment;

