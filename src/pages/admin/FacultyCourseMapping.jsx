/**
 * Faculty-Course Mapping Page
 * Assign courses to faculty members
 */

import { useState, useEffect } from 'react';
import { Card, Row, Col, List, Select, Button, Tag, Typography, Empty, Spin, Table, Space, Popconfirm, Avatar } from 'antd';
import { PlusOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import PageHeader from '@/components/common/PageHeader';
import FormModal from '@/components/common/FormModal';
import { Form } from 'antd';
import { faculty, courses, branches, facultyCourseMappings } from '@/services/mockData';
import { SEMESTERS, ACADEMIC_YEARS } from '@/utils/constants';
import { getInitials } from '@/utils/helpers';
import { colors } from '@/theme/themeConfig';
import useAppStore from '@/store/useAppStore';
import './CrudPage.css';

const { Text } = Typography;

const FacultyCourseMapping = () => {
  const [loading, setLoading] = useState(true);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [mappings, setMappings] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();
  const { showSuccess, showError } = useAppStore();

  useEffect(() => {
    setMappings(facultyCourseMappings);
    setLoading(false);
    const activeFaculty = faculty.filter(f => f.status === 'active');
    if (activeFaculty.length > 0) {
      setSelectedFaculty(activeFaculty[0].id);
    }
  }, []);

  const activeFaculty = faculty.filter(f => f.status === 'active');
  const facultyMappings = mappings.filter(m => m.facultyId === selectedFaculty);

  const columns = [
    {
      title: 'Course',
      key: 'course',
      render: (_, record) => {
        const course = courses.find(c => c.id === record.courseId);
        return course ? (
          <div>
            <Text strong>{course.name}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>{course.code}</Text>
          </div>
        ) : '-';
      },
    },
    {
      title: 'Branch',
      key: 'branch',
      width: 120,
      render: (_, record) => {
        const branch = branches.find(b => b.id === record.branchId);
        return branch ? <Tag>{branch.code}</Tag> : '-';
      },
    },
    {
      title: 'Semester',
      dataIndex: 'semester',
      key: 'semester',
      width: 100,
      render: (sem) => `Sem ${sem}`,
    },
    {
      title: 'Academic Year',
      dataIndex: 'academicYear',
      key: 'academicYear',
      width: 120,
    },
    {
      title: 'Action',
      key: 'action',
      width: 80,
      render: (_, record) => (
        <Popconfirm
          title="Remove this assignment?"
          onConfirm={() => handleRemoveMapping(record.id)}
        >
          <Button type="text" danger icon={<DeleteOutlined />} size="small" />
        </Popconfirm>
      ),
    },
  ];

  const handleRemoveMapping = (mappingId) => {
    setMappings(prev => prev.filter(m => m.id !== mappingId));
    showSuccess('Assignment removed');
  };

  const handleAddMapping = async (values) => {
    const newMapping = {
      id: Date.now(),
      facultyId: selectedFaculty,
      ...values,
    };
    setMappings(prev => [...prev, newMapping]);
    setModalOpen(false);
    form.resetFields();
    showSuccess('Course assigned successfully');
  };

  if (loading) {
    return (
      <div className="crud-page" style={{ textAlign: 'center', padding: 100 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="crud-page">
      <PageHeader
        title="Faculty-Course Mapping"
        subtitle="Assign courses to faculty members for academic sessions"
        showAdd={false}
        showRefresh={false}
      />

      <Row gutter={24}>
        {/* Faculty List */}
        <Col xs={24} md={8}>
          <Card title="Faculty" size="small">
            <List
              dataSource={activeFaculty}
              renderItem={(f) => (
                <List.Item
                  className={`mapping-item ${selectedFaculty === f.id ? 'selected' : ''}`}
                  onClick={() => setSelectedFaculty(f.id)}
                >
                  <Space>
                    <Avatar 
                      size={36} 
                      style={{ backgroundColor: colors.primary }}
                    >
                      {getInitials(f.name)}
                    </Avatar>
                    <div>
                      <Text strong>{f.name}</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: 12 }}>{f.department}</Text>
                    </div>
                  </Space>
                  <Tag color="purple">
                    {mappings.filter(m => m.facultyId === f.id).length} courses
                  </Tag>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* Course Assignments */}
        <Col xs={24} md={16}>
          <Card 
            title={
              <span>
                Assigned Courses
                {selectedFaculty && (
                  <Text type="secondary" style={{ fontWeight: 'normal', marginLeft: 8 }}>
                    for {faculty.find(f => f.id === selectedFaculty)?.name}
                  </Text>
                )}
              </span>
            }
            extra={
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => setModalOpen(true)}
                disabled={!selectedFaculty}
              >
                Assign Course
              </Button>
            }
            size="small"
          >
            {selectedFaculty ? (
              <Table
                dataSource={facultyMappings}
                columns={columns}
                rowKey="id"
                pagination={false}
                size="small"
                locale={{ emptyText: 'No courses assigned to this faculty' }}
              />
            ) : (
              <Empty description="Select a faculty member to view assignments" />
            )}
          </Card>
        </Col>
      </Row>

      <FormModal
        title="Assign Course to Faculty"
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAddMapping}
        form={form}
        width={600}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="courseId"
              label="Course"
              rules={[{ required: true, message: 'Please select a course' }]}
            >
              <Select
                placeholder="Select course"
                options={courses.map(c => ({ 
                  value: c.id, 
                  label: `${c.name} (${c.code})` 
                }))}
                showSearch
                optionFilterProp="label"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="branchId"
              label="Branch"
              rules={[{ required: true, message: 'Please select branch' }]}
            >
              <Select
                placeholder="Select branch"
                options={branches.map(b => ({ 
                  value: b.id, 
                  label: `${b.name} (${b.code})` 
                }))}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="semester"
              label="Semester"
              rules={[{ required: true, message: 'Please select semester' }]}
            >
              <Select placeholder="Select semester" options={SEMESTERS} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="academicYear"
              label="Academic Year"
              rules={[{ required: true, message: 'Please select year' }]}
            >
              <Select placeholder="Select academic year" options={ACADEMIC_YEARS} />
            </Form.Item>
          </Col>
        </Row>
      </FormModal>
    </div>
  );
};

export default FacultyCourseMapping;
