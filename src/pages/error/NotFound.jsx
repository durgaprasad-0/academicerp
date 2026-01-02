/**
 * NotFound Page (404)
 * Page not found error page
 */

import { Button, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import { FileSearchOutlined, HomeOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import useUserStore from '@/store/useUserStore';
import './ErrorPages.css';

const NotFound = () => {
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

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="error-page not-found">
      <div className="error-container">
        <div className="error-illustration">
          <FileSearchOutlined style={{ fontSize: 80, color: 'var(--color-secondary)' }} />
        </div>
        
        <h1 className="error-code">404</h1>
        
        <h2 className="error-title">Page Not Found</h2>
        
        <p className="error-description">
          Oops! The page you're looking for doesn't exist. 
          It might have been moved, deleted, or you may have mistyped the URL.
        </p>
        
        <div className="error-actions">
          <Button 
            type="primary" 
            icon={<HomeOutlined />}
            onClick={handleGoHome}
            size="large"
          >
            Back to Home
          </Button>
          <Button 
            icon={<ArrowLeftOutlined />}
            onClick={handleGoBack}
            size="large"
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
