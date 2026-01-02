/**
 * ServerError Page (500)
 * Internal server error page
 */

import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { CloudServerOutlined, ReloadOutlined, HomeOutlined, MailOutlined } from '@ant-design/icons';
import useUserStore from '@/store/useUserStore';
import './ErrorPages.css';

const ServerError = () => {
  const navigate = useNavigate();
  const { role, isAuthenticated } = useUserStore();

  const handleGoHome = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    const homePath = role === 'admin' ? '/admin/dashboard' : '/faculty/dashboard';
    navigate(homePath);
  };

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="error-page server-error">
      <div className="error-container">
        <div className="error-illustration">
          <CloudServerOutlined style={{ fontSize: 80, color: '#F59E0B' }} />
        </div>
        
        <h1 className="error-code">500</h1>
        
        <h2 className="error-title">Internal Server Error</h2>
        
        <p className="error-description">
          Something went wrong on our end. Our team has been notified 
          and we're working to fix the issue. Please try again later.
        </p>
        
        <div className="error-actions">
          <Button 
            type="primary" 
            icon={<ReloadOutlined />}
            onClick={handleRetry}
            size="large"
          >
            Try Again
          </Button>
          <Button 
            icon={<HomeOutlined />}
            onClick={handleGoHome}
            size="large"
          >
            Back to Home
          </Button>
        </div>
        
        <p style={{ marginTop: 24, color: 'var(--color-text-tertiary)', fontSize: 14 }}>
          <MailOutlined style={{ marginRight: 8 }} />
          Need help? Contact support at support@academicerp.com
        </p>
      </div>
    </div>
  );
};

export default ServerError;
