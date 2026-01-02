/**
 * Course Outcomes Page
 * CRUD for course outcomes (COs) with Bloom level mapping
 */

import { useState, useEffect, useMemo } from 'react';
import { Form, Input, Select, Tag, Card, Table, Button, Typography, Divider, Row, Col } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import PageHeader from '@/components/common/PageHeader';
import FormModal from '@/components/common/FormModal';
import { courses, courseOutcomes as mockOutcomes, bloomLevels, createMockCrud } from '@/services/mockData';
import useAppStore from '@/store/useAppStore';
import '@/pages/admin/CrudPage.css';

const { Text } = Typography;
const outcomesService = createMockCrud(mockOutcomes);

const CourseOutcomes = () => {
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [outcomes, setOutcomes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();
  const { showSuccess, showError } = useAppStore();

  // Get assigned courses (mock: all courses for demo)
  const assignedCourses = courses.slice(0, 5);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await outcomesService.getAll();
        setOutcomes(response.data);
      } catch {
        showError('Failed to fetch course outcomes');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    
    if (assignedCourses.length > 0) {
      setSelectedCourse(assignedCourses[0].id);
    }
  }, []);

  const courseOutcomes = outcomes.filter(o => o.courseId === selectedCourse);

  const columns = useMemo(() => [
    {
      title: 'CO Number',
      dataIndex: 'coNumber',
      key: 'coNumber',
      width: 100,
      render: (num) => <Tag color="blue">CO{num}</Tag>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Bloom Level',
      dataIndex: 'bloomLevelId',
      key: 'bloomLevelId',
      width: 150,
      render: (id) => {
        const level = bloomLevels.find(b => b.id === id);
        return level ? <Tag color="purple">{level.name}</Tag> : '-';
      },
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
    form.setFieldsValue({ courseId: selectedCourse });
    setModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditingItem(record);
    form.setFieldsValue(record);
    setModalOpen(true);
  };

  const handleDelete = async (record) => {
    try {
      await outcomesService.delete(record.id);
      setOutcomes(prev => prev.filter(item => item.id !== record.id));
      showSuccess('Course outcome deleted');
    } catch {
      showError('Failed to delete');
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editingItem) {
        const response = await outcomesService.update(editingItem.id, values);
        setOutcomes(prev => prev.map(item => 
          item.id === editingItem.id ? { ...item, ...response.data } : item
        ));
        showSuccess('Course outcome updated');
      } else {
        const response = await outcomesService.create({ ...values, courseId: selectedCourse });
        setOutcomes(prev => [...prev, response.data]);
        showSuccess('Course outcome added');
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
        title="Course Outcomes"
        subtitle="Define learning outcomes for your courses"
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
                  {outcomes.filter(o => o.courseId === course.id).length} COs
                </Tag>
              </div>
            ))}
          </Card>
        </Col>

        {/* Course Outcomes */}
        <Col xs={24} md={16}>
          <Card 
            title={
              <span>
                Course Outcomes
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
                Add CO
              </Button>
            }
            size="small"
          >
            <Table
              dataSource={courseOutcomes}
              columns={columns}
              rowKey="id"
              loading={loading}
              pagination={false}
              size="small"
              locale={{ emptyText: 'No course outcomes defined for this course' }}
            />
          </Card>
        </Col>
      </Row>

      <FormModal
        title={editingItem ? 'Edit Course Outcome' : 'Add Course Outcome'}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        form={form}
        initialValues={editingItem || { coNumber: courseOutcomes.length + 1 }}
      >
        <Form.Item
          name="coNumber"
          label="CO Number"
          rules={[{ required: true, message: 'Please enter CO number' }]}
        >
          <Select
            placeholder="Select CO number"
            options={[1,2,3,4,5,6].map(n => ({ value: n, label: `CO${n}` }))}
          />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: 'Please enter CO description' }]}
        >
          <Input.TextArea 
            rows={3} 
            placeholder="Describe what students will be able to do after completing this course"
          />
        </Form.Item>

        <Form.Item
          name="bloomLevelId"
          label="Bloom's Taxonomy Level"
          rules={[{ required: true, message: 'Please select Bloom level' }]}
        >
          <Select
            placeholder="Select Bloom level"
            options={bloomLevels.map(b => ({ 
              value: b.id, 
              label: `${b.name} (Level ${b.level})` 
            }))}
          />
        </Form.Item>
      </FormModal>
    </div>
  );
};

export default CourseOutcomes;
