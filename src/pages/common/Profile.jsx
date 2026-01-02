/**
 * Profile Page
 * User profile view and edit
 */

import { useState } from 'react';
import { Card, Form, Input, Button, Upload, Avatar, Row, Col, Divider, Tag, Typography, message } from 'antd';
import { 
  UserOutlined, 
  MailOutlined, 
  PhoneOutlined, 
  TeamOutlined,
  CameraOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import PageHeader from '@/components/common/PageHeader';
import FormLayout from '@/components/common/FormLayout';
import useUserStore from '@/store/useUserStore';
import useAuth from '@/hooks/useAuth';
import { getInitials } from '@/utils/helpers';
import { colors } from '@/theme/themeConfig';
import './Profile.css';

const { Title, Text } = Typography;

const Profile = () => {
  const [form] = Form.useForm();
  const { user } = useUserStore();
  const { updateProfile, isLoading } = useAuth();
  const [editing, setEditing] = useState(false);

  const handleSubmit = async (values) => {
    const result = await updateProfile(values);
    if (result.success) {
      setEditing(false);
    }
  };

  return (
    <div className="profile-page">
      <PageHeader
        title="My Profile"
        subtitle="View and manage your profile information"
        showAdd={false}
        showRefresh={false}
      />

      <Row gutter={[24, 24]}>
        {/* Profile Card */}
        <Col xs={24} lg={8}>
          <Card className="profile-card">
            <div className="profile-avatar-section">
              <div className="avatar-wrapper">
                <Avatar
                  size={120}
                  style={{ 
                    backgroundColor: colors.primary,
                    fontSize: 48,
                    fontWeight: 700,
                  }}
                  src={user?.avatar}
                >
                  {user ? getInitials(user.name) : 'U'}
                </Avatar>
                <Upload 
                  showUploadList={false}
                  beforeUpload={() => {
                    message.info('Avatar upload coming soon!');
                    return false;
                  }}
                >
                  <Button 
                    icon={<CameraOutlined />} 
                    shape="circle" 
                    className="avatar-upload-btn"
                    size="small"
                  />
                </Upload>
              </div>
              <Title level={4} style={{ marginTop: 16, marginBottom: 4 }}>
                {user?.name || 'User Name'}
              </Title>
              <Text type="secondary">{user?.designation || user?.role}</Text>
              <Tag 
                color={user?.role === 'admin' ? 'blue' : 'green'} 
                style={{ marginTop: 12 }}
              >
                {user?.role?.toUpperCase()}
              </Tag>
            </div>

            <Divider />

            <div className="profile-info-list">
              <div className="info-item">
                <MailOutlined className="info-icon" />
                <div>
                  <Text type="secondary" className="info-label">Email</Text>
                  <Text strong>{user?.email || 'email@example.com'}</Text>
                </div>
              </div>
              <div className="info-item">
                <TeamOutlined className="info-icon" />
                <div>
                  <Text type="secondary" className="info-label">Department</Text>
                  <Text strong>{user?.department || 'Not specified'}</Text>
                </div>
              </div>
            </div>
          </Card>
        </Col>

        {/* Edit Profile Form */}
        <Col xs={24} lg={16}>
          <Card 
            title="Profile Information"
            className="profile-form-card"
            extra={
              !editing && (
                <Button type="primary" onClick={() => setEditing(true)}>
                  Edit Profile
                </Button>
              )
            }
          >
            <FormLayout
              form={form}
              onFinish={handleSubmit}
              initialValues={user}
            >
              <FormLayout.Row>
                <FormLayout.Col>
                  <Form.Item
                    name="name"
                    label="Full Name"
                    rules={[{ required: true, message: 'Please enter your name' }]}
                  >
                    <Input 
                      prefix={<UserOutlined />} 
                      placeholder="Enter full name"
                      disabled={!editing}
                    />
                  </Form.Item>
                </FormLayout.Col>
                <FormLayout.Col>
                  <Form.Item
                    name="email"
                    label="Email Address"
                    rules={[
                      { required: true, message: 'Please enter your email' },
                      { type: 'email', message: 'Please enter a valid email' },
                    ]}
                  >
                    <Input 
                      prefix={<MailOutlined />} 
                      placeholder="Enter email"
                      disabled
                    />
                  </Form.Item>
                </FormLayout.Col>
              </FormLayout.Row>

              <FormLayout.Row>
                <FormLayout.Col>
                  <Form.Item
                    name="phone"
                    label="Phone Number"
                  >
                    <Input 
                      prefix={<PhoneOutlined />} 
                      placeholder="Enter phone number"
                      disabled={!editing}
                    />
                  </Form.Item>
                </FormLayout.Col>
                <FormLayout.Col>
                  <Form.Item
                    name="department"
                    label="Department"
                  >
                    <Input 
                      prefix={<TeamOutlined />} 
                      placeholder="Department"
                      disabled
                    />
                  </Form.Item>
                </FormLayout.Col>
              </FormLayout.Row>

              <Form.Item
                name="designation"
                label="Designation"
              >
                <Input 
                  placeholder="Designation"
                  disabled
                />
              </Form.Item>

              {editing && (
                <FormLayout.Actions>
                  <Button onClick={() => {
                    setEditing(false);
                    form.resetFields();
                  }}>
                    Cancel
                  </Button>
                  <Button 
                    type="primary" 
                    htmlType="submit"
                    icon={<SaveOutlined />}
                    loading={isLoading}
                  >
                    Save Changes
                  </Button>
                </FormLayout.Actions>
              )}
            </FormLayout>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Profile;
