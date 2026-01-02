/**
 * Branch-Course Mapping Page
 * Map courses to branches with semester assignment
 */

import { useState, useEffect } from 'react';
import { Card, Row, Col, List, Select, Button, Tag, Typography, Empty, Spin, Table, Space, Popconfirm } from 'antd';
import { SaveOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import PageHeader from '@/components/common/PageHeader';
import FormModal from '@/components/common/FormModal';
import { Form } from 'antd';
import { branches, courses, regulations, branchCourseMappings } from '@/services/mockData';
import { SEMESTERS } from '@/utils/constants';
import useAppStore from '@/store/useAppStore';
import './CrudPage.css';

const { Text } = Typography;

const BranchCourseMapping = () => {
  const [loading, setLoading] = useState(true);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [mappings, setMappings] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();
  const { showSuccess, showError } = useAppStore();

  useEffect(() => {
    setMappings(branchCourseMappings);
    setLoading(false);
    if (branches.length > 0) {
      setSelectedBranch(branches[0].id);
    }
  }, []);

  const branchMappings = mappings.filter(m => m.branchId === selectedBranch);

  const columns = [
    {
      title: 'Course',
      key: 'course',
      render: (_, record) => {
        const course = courses.find(c => c.id === record.courseId);
        return course ? `${course.name} (${course.code})` : '-';
      },
    },
    {
      title: 'Semester',
      dataIndex: 'semester',
      key: 'semester',
      width: 120,
      render: (sem) => <Tag color="blue">Semester {sem}</Tag>,
    },
    {
      title: 'Regulation',
      key: 'regulation',
      width: 120,
      render: (_, record) => {
        const reg = regulations.find(r => r.id === record.regulationId);
        return reg ? <Tag>{reg.name}</Tag> : '-';
      },
    },
    {
      title: 'Action',
      key: 'action',
      width: 80,
      render: (_, record) => (
        <Popconfirm
          title="Remove this mapping?"
          onConfirm={() => handleRemoveMapping(record.id)}
        >
          <Button type="text" danger icon={<DeleteOutlined />} size="small" />
        </Popconfirm>
      ),
    },
  ];

  const handleRemoveMapping = (mappingId) => {
    setMappings(prev => prev.filter(m => m.id !== mappingId));
    showSuccess('Mapping removed');
  };

  const handleAddMapping = async (values) => {
    const newMapping = {
      id: Date.now(),
      branchId: selectedBranch,
      ...values,
    };
    setMappings(prev => [...prev, newMapping]);
    setModalOpen(false);
    form.resetFields();
    showSuccess('Course mapped successfully');
  };

  const availableCourses = courses.filter(
    course => !branchMappings.some(m => m.courseId === course.id)
  );

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
        title="Branch-Course Mapping"
        subtitle="Assign courses to branches with semester allocation"
        showAdd={false}
        showRefresh={false}
      />

      <Row gutter={24}>
        {/* Branches List */}
        <Col xs={24} md={8}>
          <Card title="Branches" size="small">
            <List
              dataSource={branches}
              renderItem={(branch) => (
                <List.Item
                  className={`mapping-item ${selectedBranch === branch.id ? 'selected' : ''}`}
                  onClick={() => setSelectedBranch(branch.id)}
                >
                  <div>
                    <Text strong>{branch.name}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 12 }}>{branch.code}</Text>
                  </div>
                  <Tag color="green">
                    {mappings.filter(m => m.branchId === branch.id).length} courses
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
                Mapped Courses
                {selectedBranch && (
                  <Text type="secondary" style={{ fontWeight: 'normal', marginLeft: 8 }}>
                    for {branches.find(b => b.id === selectedBranch)?.name}
                  </Text>
                )}
              </span>
            }
            extra={
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => setModalOpen(true)}
                disabled={!selectedBranch || availableCourses.length === 0}
              >
                Add Course
              </Button>
            }
            size="small"
          >
            {selectedBranch ? (
              <Table
                dataSource={branchMappings}
                columns={columns}
                rowKey="id"
                pagination={false}
                size="small"
                locale={{ emptyText: 'No courses mapped to this branch' }}
              />
            ) : (
              <Empty description="Select a branch to view mapped courses" />
            )}
          </Card>
        </Col>
      </Row>

      <FormModal
        title="Add Course Mapping"
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAddMapping}
        form={form}
      >
        <Form.Item
          name="courseId"
          label="Course"
          rules={[{ required: true, message: 'Please select a course' }]}
        >
          <Select
            placeholder="Select course"
            options={availableCourses.map(c => ({ 
              value: c.id, 
              label: `${c.name} (${c.code})` 
            }))}
            showSearch
            optionFilterProp="label"
          />
        </Form.Item>

        <Form.Item
          name="semester"
          label="Semester"
          rules={[{ required: true, message: 'Please select semester' }]}
        >
          <Select placeholder="Select semester" options={SEMESTERS} />
        </Form.Item>

        <Form.Item
          name="regulationId"
          label="Regulation"
          rules={[{ required: true, message: 'Please select regulation' }]}
        >
          <Select
            placeholder="Select regulation"
            options={regulations.filter(r => r.status === 'active').map(r => ({ 
              value: r.id, 
              label: r.name 
            }))}
          />
        </Form.Item>
      </FormModal>
    </div>
  );
};

export default BranchCourseMapping;
