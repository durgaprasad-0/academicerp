/**
 * Change Password Page
 * Password update with validation
 */

import { Card, Form, Input, Button, Progress, Typography, Alert } from 'antd';
import { LockOutlined, EyeInvisibleOutlined, EyeTwoTone, SafetyCertificateOutlined } from '@ant-design/icons';
import { useState, useMemo } from 'react';
import PageHeader from '@/components/common/PageHeader';
import FormLayout from '@/components/common/FormLayout';
import useAuth from '@/hooks/useAuth';
import { colors } from '@/theme/themeConfig';
import './ChangePassword.css';

const { Text } = Typography;

const ChangePassword = () => {
  const [form] = Form.useForm();
  const { changePassword, isLoading } = useAuth();
  const [newPassword, setNewPassword] = useState('');
  const [success, setSuccess] = useState(false);

  // Password strength calculation
  const passwordStrength = useMemo(() => {
    if (!newPassword) return { score: 0, label: '', color: '' };
    
    let score = 0;
    if (newPassword.length >= 8) score += 25;
    if (/[a-z]/.test(newPassword)) score += 25;
    if (/[A-Z]/.test(newPassword)) score += 25;
    if (/[0-9]/.test(newPassword)) score += 15;
    if (/[^a-zA-Z0-9]/.test(newPassword)) score += 10;

    if (score < 40) return { score, label: 'Weak', color: '#EF4444' };
    if (score < 70) return { score, label: 'Medium', color: '#F59E0B' };
    return { score, label: 'Strong', color: colors.accent };
  }, [newPassword]);

  const handleSubmit = async (values) => {
    const result = await changePassword(values.currentPassword, values.newPassword);
    if (result.success) {
      setSuccess(true);
      form.resetFields();
      setNewPassword('');
      setTimeout(() => setSuccess(false), 5000);
    }
  };

  return (
    <div className="change-password-page">
      <PageHeader
        title="Change Password"
        subtitle="Update your account password"
        showAdd={false}
        showRefresh={false}
      />

      <Card className="password-card">
        {success && (
          <Alert
            message="Password Changed Successfully"
            description="Your password has been updated. Use your new password for future logins."
            type="success"
            showIcon
            closable
            style={{ marginBottom: 24 }}
          />
        )}

        <div className="password-icon-header">
          <div className="password-icon-wrapper">
            <SafetyCertificateOutlined style={{ fontSize: 48, color: colors.primary }} />
          </div>
          <Text type="secondary">
            For your security, please enter your current password and choose a new strong password.
          </Text>
        </div>

        <FormLayout
          form={form}
          onFinish={handleSubmit}
        >
          <Form.Item
            name="currentPassword"
            label="Current Password"
            rules={[{ required: true, message: 'Please enter your current password' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Enter current password"
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="New Password"
            rules={[
              { required: true, message: 'Please enter a new password' },
              { min: 8, message: 'Password must be at least 8 characters' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Enter new password"
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </Form.Item>

          {/* Password Strength Indicator */}
          {newPassword && (
            <div className="password-strength">
              <div className="strength-header">
                <Text type="secondary">Password Strength:</Text>
                <Text strong style={{ color: passwordStrength.color }}>
                  {passwordStrength.label}
                </Text>
              </div>
              <Progress 
                percent={passwordStrength.score} 
                showInfo={false}
                strokeColor={passwordStrength.color}
                size="small"
              />
              <ul className="password-requirements">
                <li className={newPassword.length >= 8 ? 'met' : ''}>
                  At least 8 characters
                </li>
                <li className={/[a-z]/.test(newPassword) ? 'met' : ''}>
                  One lowercase letter
                </li>
                <li className={/[A-Z]/.test(newPassword) ? 'met' : ''}>
                  One uppercase letter
                </li>
                <li className={/[0-9]/.test(newPassword) ? 'met' : ''}>
                  One number
                </li>
                <li className={/[^a-zA-Z0-9]/.test(newPassword) ? 'met' : ''}>
                  One special character
                </li>
              </ul>
            </div>
          )}

          <Form.Item
            name="confirmPassword"
            label="Confirm New Password"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Please confirm your new password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Confirm new password"
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>

          <FormLayout.Actions>
            <Button onClick={() => form.resetFields()}>
              Cancel
            </Button>
            <Button 
              type="primary" 
              htmlType="submit"
              loading={isLoading}
            >
              Update Password
            </Button>
          </FormLayout.Actions>
        </FormLayout>
      </Card>
    </div>
  );
};

export default ChangePassword;
