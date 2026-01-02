/**
 * Task Assignment Page (Admin)
 * Assign and manage tasks for faculty members
 */

import { useState, useEffect, useMemo } from 'react';
import { 
  Form, Input, Select, DatePicker, Tag, Card, Button, 
  Typography, Row, Col, Popconfirm, Avatar, Badge, Tooltip,
  Space
} from 'antd';
import { 
  PlusOutlined, EditOutlined, DeleteOutlined, 
  CheckCircleOutlined, ClockCircleOutlined, UserOutlined 
} from '@ant-design/icons';
import dayjs from 'dayjs';
import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import FormModal from '@/components/common/FormModal';
import useTaskStore from '@/store/useTaskStore';
import useAppStore from '@/store/useAppStore';
import { faculty, courses } from '@/services/mockData';
import { getInitials } from '@/utils/helpers';
import '@/pages/admin/CrudPage.css';

const { Text } = Typography;
const { TextArea } = Input;

const TaskAssignment = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();
  const { showSuccess } = useAppStore();
  const { tasks, addTask, updateTask, deleteTask, updateTaskStatus } = useTaskStore();

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
  ];

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
  ];

  const columns = useMemo(() => [
    {
      title: 'Task',
      dataIndex: 'title',
      key: 'title',
      width: 250,
      render: (text, record) => (
        <div>
          <Text strong>{text}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>{record.courseName}</Text>
        </div>
      ),
    },
    {
      title: 'Assigned To',
      dataIndex: 'assignedTo',
      key: 'assignedTo',
      width: 180,
      render: (id) => {
        const member = faculty.find(f => f.id === id);
        if (!member) return '-';
        return (
          <Space>
            <Avatar size="small" style={{ backgroundColor: '#4E73DF' }}>
              {getInitials(member.name)}
            </Avatar>
            <Text>{member.name}</Text>
          </Space>
        );
      },
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      width: 100,
      render: (priority) => {
        const colors = { low: 'default', medium: 'warning', high: 'error' };
        return <Tag color={colors[priority]}>{priority.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      width: 120,
      render: (date) => date ? dayjs(date).format('DD MMM YYYY') : '-',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => {
        const config = {
          pending: { color: 'warning', icon: <ClockCircleOutlined /> },
          in_progress: { color: 'processing', icon: <ClockCircleOutlined /> },
          completed: { color: 'success', icon: <CheckCircleOutlined /> },
        };
        const cfg = config[status] || config.pending;
        return <Tag color={cfg.color} icon={cfg.icon}>{status.replace('_', ' ').toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          {record.status !== 'completed' && (
            <Tooltip title="Mark Complete">
              <Button
                type="text"
                size="small"
                icon={<CheckCircleOutlined style={{ color: '#00B894' }} />}
                onClick={() => {
                  updateTaskStatus(record.id, 'completed');
                  showSuccess('Task marked as completed');
                }}
              />
            </Tooltip>
          )}
          <Tooltip title="Edit">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Delete this task?"
            onConfirm={() => handleDelete(record)}
            okText="Delete"
            okButtonProps={{ danger: true }}
          >
            <Button
              type="text"
              size="small"
              danger
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ], []);

  const handleAdd = () => {
    setEditingItem(null);
    form.resetFields();
    setModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditingItem(record);
    form.setFieldsValue({
      ...record,
      dueDate: record.dueDate ? dayjs(record.dueDate) : null,
    });
    setModalOpen(true);
  };

  const handleDelete = (record) => {
    deleteTask(record.id);
    showSuccess('Task deleted');
  };

  const handleSubmit = async (values) => {
    const taskData = {
      ...values,
      dueDate: values.dueDate ? values.dueDate.format('YYYY-MM-DD') : null,
      courseName: courses.find(c => c.id === values.courseId)?.name || '',
      assignedBy: 'Admin',
    };

    if (editingItem) {
      updateTask(editingItem.id, taskData);
      showSuccess('Task updated');
    } else {
      addTask(taskData);
      showSuccess('Task assigned');
    }

    setModalOpen(false);
    form.resetFields();
  };

  // Stats
  const pendingCount = tasks.filter(t => t.status === 'pending').length;
  const inProgressCount = tasks.filter(t => t.status === 'in_progress').length;
  const completedCount = tasks.filter(t => t.status === 'completed').length;

  return (
    <div className="crud-page">
      <PageHeader
        title="Task Assignment"
        subtitle="Assign and manage tasks for faculty members"
        onAdd={handleAdd}
        addLabel="Assign Task"
        showRefresh={false}
      />

      {/* Stats Row */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Card size="small">
            <Badge color="#F59E0B" text={`${pendingCount} Pending`} />
          </Card>
        </Col>
        <Col span={8}>
          <Card size="small">
            <Badge color="#4E73DF" text={`${inProgressCount} In Progress`} />
          </Card>
        </Col>
        <Col span={8}>
          <Card size="small">
            <Badge color="#00B894" text={`${completedCount} Completed`} />
          </Card>
        </Col>
      </Row>

      <DataTable
        tableId="task-assignment"
        dataSource={tasks}
        columns={columns}
        rowKey="id"
        searchKeys={['title', 'courseName']}
        showActions={false}
      />

      <FormModal
        title={editingItem ? 'Edit Task' : 'Assign New Task'}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        form={form}
        width={600}
      >
        <Form.Item
          name="title"
          label="Task Title"
          rules={[{ required: true, message: 'Please enter task title' }]}
        >
          <Input placeholder="e.g., Add questions for Unit 3" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
        >
          <TextArea rows={3} placeholder="Provide details about the task..." />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="assignedTo"
              label="Assign To"
              rules={[{ required: true, message: 'Please select faculty' }]}
            >
              <Select
                placeholder="Select faculty"
                options={faculty.filter(f => f.status === 'active').map(f => ({
                  value: f.id,
                  label: f.name,
                }))}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="courseId"
              label="Related Course"
            >
              <Select
                placeholder="Select course (optional)"
                allowClear
                options={courses.map(c => ({
                  value: c.id,
                  label: `${c.name} (${c.code})`,
                }))}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="priority"
              label="Priority"
              initialValue="medium"
            >
              <Select options={priorityOptions} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="status"
              label="Status"
              initialValue="pending"
            >
              <Select options={statusOptions} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="dueDate"
              label="Due Date"
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
      </FormModal>
    </div>
  );
};

export default TaskAssignment;
