/**
 * Login Page
 * JWT authentication with role-based redirect
 */

import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Form, Input, Button, Checkbox, Card, Typography, Alert, Divider } from 'antd';
import { UserOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons';
import useAuth from '@/hooks/useAuth';
import useUserStore from '@/store/useUserStore';
import { colors } from '@/theme/themeConfig';
import './Login.css';

const { Title, Text, Paragraph } = Typography;

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const { login, isLoading } = useAuth();
  const { isAuthenticated, role } = useUserStore();
  const [error, setError] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const redirectPath = role === 'admin' ? '/admin/dashboard' : '/faculty/dashboard';
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, role, navigate]);

  // Show session expired message
  const sessionExpired = location.state?.expired;

  const handleSubmit = async (values) => {
    setError('');
    const result = await login(values.email, values.password);
    
    if (!result.success) {
      setError(result.error || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="login-page">
      {/* Left Side - Branding */}
      <div className="login-branding">
        <div className="branding-content">
          <div className="brand-logo">
            <div className="logo-icon" style={{ background: '#fff' }}>
              <span style={{ color: colors.primary, fontWeight: 700, fontSize: 32 }}>AE</span>
            </div>
          </div>
          
          <Title level={1} style={{ color: '#fff', marginBottom: 16 }}>
            Academic ERP
          </Title>
          
          <Paragraph style={{ color: 'rgba(255,255,255,0.85)', fontSize: 18, maxWidth: 400 }}>
            Enterprise Resource Planning System for Academic Institutions
          </Paragraph>
          
          <div className="brand-features">
            <div className="feature-item">
              <div className="feature-icon">✓</div>
              <span>Question Paper Generation</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">✓</div>
              <span>Course & Faculty Management</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">✓</div>
              <span>Bloom's Taxonomy Integration</span>
            </div>
          </div>
        </div>
        
        <div className="branding-footer">
          <Text style={{ color: 'rgba(255,255,255,0.6)' }}>
            © 2024 Academic ERP. All rights reserved.
          </Text>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="login-form-section">
        <Card className="login-card" bordered={false}>
          <div className="login-header">
            <Title level={2}>Welcome Back</Title>
            <Text type="secondary">Please sign in to continue</Text>
          </div>

          {sessionExpired && (
            <Alert
              message="Session Expired"
              description="Your session has expired. Please login again."
              type="warning"
              showIcon
              closable
              style={{ marginBottom: 24 }}
            />
          )}

          {error && (
            <Alert
              message="Login Failed"
              description={error}
              type="error"
              showIcon
              closable
              onClose={() => setError('')}
              style={{ marginBottom: 24 }}
            />
          )}

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            autoComplete="off"
            requiredMark={false}
            size="large"
          >
            <Form.Item
              name="email"
              label="Email Address"
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Please enter a valid email' },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="admin@academicerp.com"
                autoComplete="email"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: 'Please enter your password' },
                { min: 6, message: 'Password must be at least 6 characters' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </Form.Item>

            <Form.Item>
              <div className="login-options">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Remember me</Checkbox>
                </Form.Item>
                <a href="#" className="forgot-link">Forgot password?</a>
              </div>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                icon={<LoginOutlined />}
                block
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </Form.Item>
          </Form>

          <Divider style={{ margin: '24px 0' }}>
            <Text type="secondary" style={{ fontSize: 12 }}>Demo Credentials</Text>
          </Divider>

          <div className="demo-credentials">
            <div className="credential-item">
              <Text strong>Admin:</Text>
              <Text code>admin@academicerp.com / admin123</Text>
            </div>
            <div className="credential-item">
              <Text strong>Faculty:</Text>
              <Text code>faculty@academicerp.com / faculty123</Text>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
