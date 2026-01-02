/**
 * Units Page
 * CRUD for course units/chapters
 */

import { useState, useEffect, useMemo } from 'react';
import { Form, Input, InputNumber, Tag, Card, Table, Button, Typography, Row, Col } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import PageHeader from '@/components/common/PageHeader';
import FormModal from '@/components/common/FormModal';
import { courses, units as mockUnits, createMockCrud } from '@/services/mockData';
import useAppStore from '@/store/useAppStore';
import '@/pages/admin/CrudPage.css';

const { Text } = Typography;
const unitsService = createMockCrud(mockUnits);

const Units = () => {
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [units, setUnits] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();
  const { showSuccess, showError } = useAppStore();

  const assignedCourses = courses.slice(0, 5);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await unitsService.getAll();
        setUnits(response.data);
      } catch {
        showError('Failed to fetch units');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    
    if (assignedCourses.length > 0) {
      setSelectedCourse(assignedCourses[0].id);
    }
  }, []);

  const courseUnits = units.filter(u => u.courseId === selectedCourse).sort((a, b) => a.unitNumber - b.unitNumber);

  const columns = useMemo(() => [
    {
      title: 'Unit',
      dataIndex: 'unitNumber',
      key: 'unitNumber',
      width: 80,
      render: (num) => <Tag color="blue">Unit {num}</Tag>,
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (title, record) => (
        <div>
          <Text strong>{title}</Text>
          {record.description && (
            <div style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }}>
              {record.description}
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Weightage',
      dataIndex: 'weightage',
      key: 'weightage',
      width: 100,
      render: (w) => `${w || 0}%`,
    },
    {
      title: 'Topics',
      dataIndex: 'topics',
      key: 'topics',
      width: 100,
      render: (topics) => <Tag>{topics?.length || 0} topics</Tag>,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <Button.Group size="small">
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
          />
          <Button 
            type="text" 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => handleDelete(record)}
          />
        </Button.Group>
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
      topics: record.topics?.join(', '),
    });
    setModalOpen(true);
  };

  const handleDelete = async (record) => {
    try {
      await unitsService.delete(record.id);
      setUnits(prev => prev.filter(item => item.id !== record.id));
      showSuccess('Unit deleted');
    } catch {
      showError('Failed to delete');
    }
  };

  const handleSubmit = async (values) => {
    try {
      const payload = {
        ...values,
        courseId: selectedCourse,
        topics: values.topics?.split(',').map(t => t.trim()).filter(Boolean),
      };
      
      if (editingItem) {
        const response = await unitsService.update(editingItem.id, payload);
        setUnits(prev => prev.map(item => 
          item.id === editingItem.id ? { ...item, ...response.data } : item
        ));
        showSuccess('Unit updated');
      } else {
        const response = await unitsService.create(payload);
        setUnits(prev => [...prev, response.data]);
        showSuccess('Unit added');
      }
      setModalOpen(false);
      form.resetFields();
    } catch {
      showError('Failed to save');
    }
  };

  const selectedCourseName = assignedCourses.find(c => c.id === selectedCourse);

  return (
    <div className="crud-page">
      <PageHeader
        title="Unit Management"
        subtitle="Define units/chapters for your courses"
        showAdd={false}
        showRefresh={false}
      />

      <Row gutter={24}>
        {/* Course Selection */}
        <Col xs={24} md={8}>
          <Card title="My Courses" size="small">
            {assignedCourses.map(course => (
              <div
                key={course.id}
                className={`mapping-item ${selectedCourse === course.id ? 'selected' : ''}`}
                onClick={() => setSelectedCourse(course.id)}
              >
                <div>
                  <Text strong>{course.name}</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: 12 }}>{course.code}</Text>
                </div>
                <Tag>
                  {units.filter(u => u.courseId === course.id).length} units
                </Tag>
              </div>
            ))}
          </Card>
        </Col>

        {/* Units */}
        <Col xs={24} md={16}>
          <Card 
            title={
              <span>
                Course Units
                {selectedCourseName && (
                  <Text type="secondary" style={{ fontWeight: 'normal', marginLeft: 8 }}>
                    for {selectedCourseName.name}
                  </Text>
                )}
              </span>
            }
            extra={
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={handleAdd}
                disabled={!selectedCourse}
              >
                Add Unit
              </Button>
            }
            size="small"
          >
            <Table
              dataSource={courseUnits}
              columns={columns}
              rowKey="id"
              loading={loading}
              pagination={false}
              size="small"
              locale={{ emptyText: 'No units defined for this course' }}
            />
          </Card>
        </Col>
      </Row>

      <FormModal
        title={editingItem ? 'Edit Unit' : 'Add Unit'}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        form={form}
        initialValues={editingItem || { unitNumber: courseUnits.length + 1, weightage: 20 }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="unitNumber"
              label="Unit Number"
              rules={[{ required: true, message: 'Required' }]}
            >
              <InputNumber min={1} max={10} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="weightage"
              label="Weightage (%)"
            >
              <InputNumber min={0} max={100} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="title"
          label="Unit Title"
          rules={[{ required: true, message: 'Please enter unit title' }]}
        >
          <Input placeholder="e.g., Introduction to Data Structures" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
        >
          <Input.TextArea rows={2} placeholder="Brief description" />
        </Form.Item>

        <Form.Item
          name="topics"
          label="Topics (comma-separated)"
          extra="List the topics covered in this unit"
        >
          <Input.TextArea 
            rows={2} 
            placeholder="e.g., Arrays, Linked Lists, Stacks, Queues"
          />
        </Form.Item>
      </FormModal>
    </div>
  );
};

export default Units;
