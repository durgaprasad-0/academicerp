/**
 * Faculty Dashboard Page
 * Assigned courses overview, quick stats, and pending tasks
 */

import { useState, useEffect } from 'react';
import { Row, Col, Card, Tag, Typography, Space, Button, Modal, List, Empty, Badge } from 'antd';
import {
  BookOutlined,
  QuestionCircleOutlined,
  FormOutlined,
  FileTextOutlined,
  ArrowRightOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import PageHeader from '@/components/common/PageHeader';
import StatsCard from '@/components/common/StatsCard';
import SkeletonLoader from '@/components/common/SkeletonLoader';
import useTaskStore from '@/store/useTaskStore';
import useUserStore from '@/store/useUserStore';
import useAppStore from '@/store/useAppStore';
import { facultyDashboardStats } from '@/services/mockData';
import { colors } from '@/theme/themeConfig';
import '@/pages/admin/Dashboard.css';

const { Title, Text } = Typography;

const FacultyDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [tasksModalOpen, setTasksModalOpen] = useState(false);
  const { user } = useUserStore();
  const { tasks, updateTaskStatus, completeTask } = useTaskStore();
  const { showSuccess } = useAppStore();

  // Get tasks for current faculty
  const facultyId = user?.id || 2;
  const myTasks = tasks.filter(t => t.assignedTo === facultyId);
  const pendingTasks = myTasks.filter(t => t.status === 'pending' || t.status === 'in_progress');

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

  const handleStartTask = (task) => {
    updateTaskStatus(task.id, 'in_progress');
    showSuccess('Task started');
  };

  const handleCompleteTask = (task) => {
    completeTask(task.id);
    showSuccess('Task completed!');
  };

  const getPriorityColor = (priority) => {
    const colors = { low: 'default', medium: 'warning', high: 'error' };
    return colors[priority] || 'default';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircleOutlined style={{ color: '#00B894' }} />;
      case 'in_progress':
        return <ClockCircleOutlined style={{ color: '#4E73DF' }} />;
      default:
        return <ExclamationCircleOutlined style={{ color: '#F59E0B' }} />;
    }
  };

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
            value={pendingTasks.length}
            icon={<FileTextOutlined />}
            color="#F59E0B"
            onClick={() => setTasksModalOpen(true)}
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

        {/* Quick Actions & Pending Tasks */}
        <Col xs={24} lg={8}>
          {/* Pending Tasks Preview */}
          <Card 
            title={
              <Space>
                <span>Pending Tasks</span>
                {pendingTasks.length > 0 && (
                  <Badge count={pendingTasks.length} size="small" />
                )}
              </Space>
            }
            className="dashboard-card"
            extra={
              <Button type="link" size="small" onClick={() => setTasksModalOpen(true)}>
                View All
              </Button>
            }
          >
            {pendingTasks.length > 0 ? (
              <List
                size="small"
                dataSource={pendingTasks.slice(0, 3)}
                renderItem={(task) => (
                  <List.Item
                    style={{ cursor: 'pointer', padding: '8px 0' }}
                    onClick={() => setTasksModalOpen(true)}
                  >
                    <List.Item.Meta
                      avatar={getStatusIcon(task.status)}
                      title={<Text ellipsis style={{ maxWidth: 180 }}>{task.title}</Text>}
                      description={
                        <Space size={4}>
                          <Tag color={getPriorityColor(task.priority)} style={{ fontSize: 10 }}>
                            {task.priority}
                          </Tag>
                          {task.dueDate && (
                            <Text type="secondary" style={{ fontSize: 11 }}>
                              Due: {dayjs(task.dueDate).format('DD MMM')}
                            </Text>
                          )}
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <Empty 
                image={Empty.PRESENTED_IMAGE_SIMPLE} 
                description="No pending tasks" 
                style={{ padding: 16 }}
              />
            )}
          </Card>
          
          <Card title="Quick Actions" className="dashboard-card" style={{ marginTop: 16 }}>
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

      {/* Tasks Modal */}
      <Modal
        title="My Tasks"
        open={tasksModalOpen}
        onCancel={() => setTasksModalOpen(false)}
        footer={null}
        width={600}
      >
        {myTasks.length > 0 ? (
          <List
            dataSource={myTasks}
            renderItem={(task) => (
              <List.Item
                actions={
                  task.status !== 'completed' ? [
                    task.status === 'pending' && (
                      <Button 
                        size="small" 
                        onClick={() => handleStartTask(task)}
                      >
                        Start
                      </Button>
                    ),
                    <Button 
                      type="primary" 
                      size="small"
                      onClick={() => handleCompleteTask(task)}
                    >
                      Complete
                    </Button>
                  ].filter(Boolean) : []
                }
              >
                <List.Item.Meta
                  avatar={getStatusIcon(task.status)}
                  title={
                    <Space>
                      <Text strong>{task.title}</Text>
                      <Tag color={getPriorityColor(task.priority)}>{task.priority}</Tag>
                    </Space>
                  }
                  description={
                    <div>
                      <Text type="secondary">{task.description}</Text>
                      <br />
                      <Space style={{ marginTop: 4 }} size="middle">
                        {task.courseName && <Tag>{task.courseName}</Tag>}
                        {task.dueDate && (
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            <ClockCircleOutlined /> Due: {dayjs(task.dueDate).format('DD MMM YYYY')}
                          </Text>
                        )}
                      </Space>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        ) : (
          <Empty description="No tasks assigned" />
        )}
      </Modal>
    </div>
  );
};

export default FacultyDashboard;
