/**
 * PageHeader Component
 * Consistent page header with title, subtitle, and action buttons
 */

import { Typography, Button, Space } from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import './PageHeader.css';

const { Title, Text } = Typography;

const PageHeader = ({
  title,
  subtitle,
  onAdd,
  addText = 'Add New',
  onRefresh,
  extra,
  children,
  showAdd = true,
  showRefresh = true,
  loading = false,
}) => {
  return (
    <div className="page-header">
      <div className="page-header-content">
        <div className="page-header-text">
          <Title level={4} className="page-title">
            {title}
          </Title>
          {subtitle && (
            <Text type="secondary" className="page-subtitle">
              {subtitle}
            </Text>
          )}
        </div>
        
        <div className="page-header-actions">
          <Space>
            {showRefresh && onRefresh && (
              <Button
                icon={<ReloadOutlined spin={loading} />}
                onClick={onRefresh}
                disabled={loading}
                aria-label="Refresh data"
              >
                Refresh
              </Button>
            )}
            
            {showAdd && onAdd && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={onAdd}
                disabled={loading}
              >
                {addText}
              </Button>
            )}
            
            {extra}
          </Space>
        </div>
      </div>
      
      {children && (
        <div className="page-header-extra">
          {children}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
