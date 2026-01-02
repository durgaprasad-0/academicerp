/**
 * PageLoader Component
 * Full-page loading spinner with logo
 */

import { Spin } from 'antd';
import { colors } from '@/theme/themeConfig';
import './PageLoader.css';

const PageLoader = ({ tip = 'Loading...', fullScreen = true }) => {
  return (
    <div className={`page-loader ${fullScreen ? 'fullscreen' : ''}`}>
      <div className="loader-content">
        <div className="loader-logo">
          <div className="logo-icon" style={{ background: colors.primary }}>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 24 }}>AE</span>
          </div>
        </div>
        <Spin size="large" />
        <p className="loader-tip">{tip}</p>
      </div>
    </div>
  );
};

export default PageLoader;
