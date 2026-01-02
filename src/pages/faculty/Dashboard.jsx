/**
 * Faculty Dashboard Page
 * Assigned courses overview and quick stats
 */

import { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Tag, Typography, Space, Button, Progress } from 'antd';
import {
  BookOutlined,
  QuestionCircleOutlined,
  FormOutlined,
  FileTextOutlined,
  ArrowRightOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/common/PageHeader';
import StatsCard from '@/components/common/StatsCard';
import SkeletonLoader from '@/components/common/SkeletonLoader';
import { facultyDashboardStats } from '@/services/mockData';
import { colors } from '@/theme/themeConfig';
import '@/pages/admin/Dashboard.css';

const { Title, Text } = Typography;

const FacultyDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setStats(facultyDashboardStats);
      setLoading(false);
    }, 800);
  }, []);

  const quickActions = [
    { icon: <QuestionCircleOutlined />, label: 'Add Question', path: '/faculty/question-bank', color: colors.primary },
    { icon: <FormOutlined />, label: 'Generate Paper', path: '/question-paper/generator', color: colors.accent },
    { icon: <BookOutlined />, label: 'Manage Outcomes', path: '/faculty/course-outcomes', color: colors.secondary },
    { icon: <FileTextOutlined />, label: 'View History', path: '/question-paper/history', color: '#F59E0B' },
  ];

  if (loading) {
    return (
      <div className="dashboard-page">
        <PageHeader 
          title="Dashboard" 
          subtitle="Welcome to Faculty Dashboard"
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
        subtitle="Welcome back! Here's your teaching overview."
        showAdd={false}
        showRefresh={false}
      />

      {/* Stats Cards */}
      <Row gutter={[16, 16]} className="mb-lg">
        <Col xs={24} sm={12} lg={6}>
          <StatsCard
            title="Assigned Courses"
            value={stats.assignedCourses}
            icon={<BookOutlined />}
            color={colors.primary}
            onClick={() => navigate('/faculty/course-outcomes')}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatsCard
            title="Question Bank"
            value={stats.totalQuestions}
            icon={<QuestionCircleOutlined />}
            color={colors.secondary}
            onClick={() => navigate('/faculty/question-bank')}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatsCard
            title="Papers Generated"
            value={stats.papersGenerated}
            icon={<FormOutlined />}
            color={colors.accent}
            onClick={() => navigate('/question-paper/history')}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatsCard
            title="Pending Tasks"
            value={stats.pendingTasks}
            icon={<FileTextOutlined />}
            color="#F59E0B"
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* Assigned Courses */}
        <Col xs={24} lg={16}>
          <Card 
            title="My Courses" 
            className="dashboard-card"
            extra={
              <Button 
                type="link" 
                icon={<ArrowRightOutlined />}
                onClick={() => navigate('/faculty/course-outcomes')}
              >
                View All
              </Button>
            }
          >
            {stats.courses.map((course) => (
              <div key={course.id} className="course-progress-item">
                <div className="course-progress-header">
                  <div>
                    <Text strong>{course.name}</Text>
                    <Text type="secondary" style={{ marginLeft: 8 }}>{course.code}</Text>
                  </div>
                  <Tag color="blue">{course.questions} questions</Tag>
                </div>
                <div className="overview-cards">
                  <div className="overview-card">
                    <div className="overview-card-value">{course.questions}</div>
                    <div className="overview-card-label">Questions</div>
                  </div>
                  <div className="overview-card">
                    <div className="overview-card-value">{course.outcomes}</div>
                    <div className="overview-card-label">Course Outcomes</div>
                  </div>
                  <div className="overview-card">
                    <div className="overview-card-value">5</div>
                    <div className="overview-card-label">Units</div>
                  </div>
                </div>
                <Button 
                  type="primary" 
                  ghost 
                  size="small"
                  onClick={() => navigate('/faculty/question-bank')}
                >
                  Manage Questions
                </Button>
              </div>
            ))}
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
          
          {/* Tips Card */}
          <Card 
            title="Quick Tips" 
            className="dashboard-card" 
            style={{ marginTop: 16 }}
            size="small"
          >
            <ul style={{ paddingLeft: 16, margin: 0, color: 'var(--color-text-secondary)' }}>
              <li style={{ marginBottom: 8 }}>Add questions with proper CO and Bloom level mapping</li>
              <li style={{ marginBottom: 8 }}>Use bulk upload for faster question entry</li>
              <li style={{ marginBottom: 8 }}>Review generated papers before finalizing</li>
              <li>Maintain balance across units and difficulty levels</li>
            </ul>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default FacultyDashboard;
