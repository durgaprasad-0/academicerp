/**
 * Admin Dashboard Page
 * Overview with stats cards and recent activity
 */

import { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Tag, Typography, Space, Button } from 'antd';
import {
  BookOutlined,
  BranchesOutlined,
  TeamOutlined,
  AppstoreOutlined,
  ArrowRightOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/common/PageHeader';
import StatsCard from '@/components/common/StatsCard';
import SkeletonLoader from '@/components/common/SkeletonLoader';
import { adminDashboardStats, programs, faculty, courses } from '@/services/mockData';
import { colors } from '@/theme/themeConfig';
import { formatDateTime, getRelativeTime } from '@/utils/helpers';
import './Dashboard.css';

const { Title, Text } = Typography;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStats(adminDashboardStats);
      setLoading(false);
    }, 800);
  }, []);

  const activityColumns = [
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
    },
    {
      title: 'User',
      dataIndex: 'user',
      key: 'user',
      render: (user) => <Tag color="blue">{user}</Tag>,
    },
    {
      title: 'Time',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (time) => (
        <Text type="secondary">{getRelativeTime(time)}</Text>
      ),
    },
  ];

  const quickActions = [
    { icon: <BookOutlined />, label: 'Add Program', path: '/admin/programs' },
    { icon: <BranchesOutlined />, label: 'Add Branch', path: '/admin/branches' },
    { icon: <AppstoreOutlined />, label: 'Add Course', path: '/admin/courses' },
    { icon: <TeamOutlined />, label: 'Add Faculty', path: '/admin/faculty' },
  ];

  if (loading) {
    return (
      <div className="dashboard-page">
        <PageHeader 
          title="Dashboard" 
          subtitle="Welcome to Admin Dashboard"
          showAdd={false}
          showRefresh={false}
        />
        <SkeletonLoader.StatsCard count={4} />
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <PageHeader 
        title="Dashboard" 
        subtitle="Welcome to Admin Dashboard. Here's an overview of your institution."
        showAdd={false}
        showRefresh={false}
      />

      {/* Stats Cards */}
      <Row gutter={[16, 16]} className="mb-lg">
        <Col xs={24} sm={12} lg={6}>
          <StatsCard
            title="Total Programs"
            value={stats.totalPrograms}
            icon={<BookOutlined />}
            color={colors.primary}
            onClick={() => navigate('/admin/programs')}
            tooltip="Click to manage programs"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatsCard
            title="Total Branches"
            value={stats.totalBranches}
            icon={<BranchesOutlined />}
            color={colors.secondary}
            onClick={() => navigate('/admin/branches')}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatsCard
            title="Total Courses"
            value={stats.totalCourses}
            icon={<AppstoreOutlined />}
            color={colors.accent}
            onClick={() => navigate('/admin/courses')}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatsCard
            title="Active Faculty"
            value={stats.totalFaculty}
            icon={<TeamOutlined />}
            color="#F59E0B"
            onClick={() => navigate('/admin/faculty')}
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* Recent Activity */}
        <Col xs={24} lg={16}>
          <Card 
            title="Recent Activity" 
            className="dashboard-card"
            extra={<Button type="link" icon={<ArrowRightOutlined />}>View All</Button>}
          >
            <Table
              columns={activityColumns}
              dataSource={stats.recentActivities}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>

        {/* Quick Actions */}
        <Col xs={24} lg={8}>
          <Card title="Quick Actions" className="dashboard-card">
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  type="default"
                  icon={action.icon}
                  block
                  onClick={() => navigate(action.path)}
                  className="quick-action-btn"
                >
                  {action.label}
                </Button>
              ))}
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Recent Items */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={12}>
          <Card 
            title="Recent Programs" 
            className="dashboard-card"
            extra={
              <Button 
                type="link" 
                icon={<ArrowRightOutlined />}
                onClick={() => navigate('/admin/programs')}
              >
                View All
              </Button>
            }
          >
            {programs.slice(0, 4).map((program) => (
              <div key={program.id} className="list-item">
                <div className="list-item-content">
                  <Text strong>{program.name}</Text>
                  <Text type="secondary">{program.code}</Text>
                </div>
                <Tag color={program.status === 'active' ? 'success' : 'default'}>
                  {program.status}
                </Tag>
              </div>
            ))}
          </Card>
        </Col>
        
        <Col xs={24} lg={12}>
          <Card 
            title="Recent Faculty" 
            className="dashboard-card"
            extra={
              <Button 
                type="link" 
                icon={<ArrowRightOutlined />}
                onClick={() => navigate('/admin/faculty')}
              >
                View All
              </Button>
            }
          >
            {faculty.slice(0, 4).map((f) => (
              <div key={f.id} className="list-item">
                <div className="list-item-content">
                  <Text strong>{f.name}</Text>
                  <Text type="secondary">{f.department}</Text>
                </div>
                <Tag color={f.status === 'active' ? 'success' : 'error'}>
                  {f.status}
                </Tag>
              </div>
            ))}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;
