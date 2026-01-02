/**
 * Forbidden Page (403)
 * Unauthorized access error page
 */

import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { LockOutlined, HomeOutlined, LoginOutlined } from '@ant-design/icons';
import useUserStore from '@/store/useUserStore';
import './ErrorPages.css';

const Forbidden = () => {
  const navigate = useNavigate();
  const { role, logout } = useUserStore();

  const handleGoHome = () => {
    const homePath = role === 'admin' ? '/admin/dashboard' : '/faculty/dashboard';
    navigate(homePath);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="error-page forbidden">
      <div className="error-container">
        <div className="error-illustration">
          <LockOutlined style={{ fontSize: 80, color: '#E17055' }} />
        </div>
        
        <h1 className="error-code">403</h1>
        
        <h2 className="error-title">Access Denied</h2>
        
        <p className="error-description">
          Sorry, you don't have permission to access this page. 
          This area is restricted to authorized users only.
        </p>
        
        <div className="error-actions">
          <Button 
            type="primary" 
            icon={<HomeOutlined />}
            onClick={handleGoHome}
            size="large"
          >
            Go to Dashboard
          </Button>
          <Button 
            icon={<LoginOutlined />}
            onClick={handleLogout}
            size="large"
          >
            Login as Different User
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Forbidden;
