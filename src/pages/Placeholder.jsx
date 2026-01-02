/**
 * Placeholder Page
 * Temporary placeholder for pages under development
 */

import { Card, Typography, Button, Tag } from 'antd';
import { ToolOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/common/PageHeader';
import { colors } from '@/theme/themeConfig';

const { Title, Text, Paragraph } = Typography;

const Placeholder = ({ title = 'Page' }) => {
  const navigate = useNavigate();

  return (
    <div className="placeholder-page">
      <PageHeader
        title={title}
        subtitle="This page is under development"
        showAdd={false}
        showRefresh={false}
      />

      <Card 
        style={{ 
          textAlign: 'center', 
          padding: '48px 24px',
          borderRadius: 12,
        }}
      >
        <div 
          style={{ 
            width: 80, 
            height: 80, 
            background: `${colors.secondary}15`,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
          }}
        >
          <ToolOutlined style={{ fontSize: 36, color: colors.secondary }} />
        </div>

        <Title level={3} style={{ marginBottom: 8 }}>
          {title}
        </Title>

        <Tag color="blue" style={{ marginBottom: 16 }}>Coming Soon</Tag>

        <Paragraph type="secondary" style={{ maxWidth: 400, margin: '0 auto 24px' }}>
          This page is currently under development. The functionality will be available soon. 
          You can explore other sections of the application in the meantime.
        </Paragraph>

        <Button 
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
        >
          Go Back
        </Button>
      </Card>
    </div>
  );
};

export default Placeholder;
