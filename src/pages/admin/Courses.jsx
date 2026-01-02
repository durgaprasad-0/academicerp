/**
 * Courses Page
 * CRUD for course master data
 */

import { useState, useEffect, useMemo } from 'react';
import { Form, Input, Select, InputNumber, Tag, Switch, Card, Row, Col, Tabs } from 'antd';
import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import FormModal from '@/components/common/FormModal';
import BulkUpload from '@/components/common/BulkUpload';
import { courses as mockCourses, createMockCrud } from '@/services/mockData';
import { COURSE_TYPES, STATUS_OPTIONS } from '@/utils/constants';
import useAppStore from '@/store/useAppStore';
import { downloadFile } from '@/utils/downloadHelper';
import './CrudPage.css';

const coursesService = createMockCrud(mockCourses);

const Courses = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();
  const { showSuccess, showError } = useAppStore();

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await coursesService.getAll();
      setData(response.data);
    } catch {
      showError('Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = useMemo(() => [
    {
      title: 'Course Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      width: 100,
      render: (code) => <Tag color="blue">{code}</Tag>,
    },
    {
      title: 'Credits',
      dataIndex: 'credits',
      key: 'credits',
      width: 80,
      sorter: (a, b) => a.credits - b.credits,
      align: 'center',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 150,
      filters: COURSE_TYPES.map(t => ({ text: t.label, value: t.value })),
      onFilter: (value, record) => record.type === value,
      render: (type) => {
        const typeInfo = COURSE_TYPES.find(t => t.value === type);
        return <Tag>{typeInfo?.label || type}</Tag>;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag color={status === 'active' ? 'success' : 'default'}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Tag>
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
    form.setFieldsValue(record);
    setModalOpen(true);
  };

  const handleDelete = async (record) => {
    try {
      await coursesService.delete(record.id);
      setData(prev => prev.filter(item => item.id !== record.id));
      showSuccess('Course deleted successfully');
    } catch {
      showError('Failed to delete course');
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editingItem) {
        const response = await coursesService.update(editingItem.id, values);
        setData(prev => prev.map(item => 
          item.id === editingItem.id ? { ...item, ...response.data } : item
        ));
        showSuccess('Course updated successfully');
      } else {
        const response = await coursesService.create(values);
        setData(prev => [...prev, response.data]);
        showSuccess('Course created successfully');
      }
      setModalOpen(false);
      form.resetFields();
    } catch {
      showError('Failed to save course');
    }
  };

  const handleDownloadTemplate = () => {
    downloadFile('/templates/courses_template.csv', 'courses_template.csv');
    showSuccess('Template download started');
  };

  const tabItems = [
    {
      key: 'list',
      label: 'Course List',
      children: (
        <DataTable
          tableId="courses"
          columns={columns}
          dataSource={data}
          loading={loading}
          searchKeys={['name', 'code']}
          onEdit={handleEdit}
          onDelete={handleDelete}
          emptyText="No Courses Found"
          emptyDescription="Start by adding your first course."
        />
      ),
    },
    {
      key: 'upload',
      label: 'Bulk Upload',
      children: (
        <div style={{ padding: 24 }}>
          <BulkUpload
            onUpload={async (formData) => {
              // Simulate upload
              return new Promise(resolve => setTimeout(() => resolve({ success: true, message: 'Courses imported' }), 1000));
            }}
            onDownloadTemplate={handleDownloadTemplate}
            templateName="courses_template.csv"
            title="Upload Courses"
            description="Upload an Excel or CSV file"
          />
        </div>
      ),
    },
  ];

  return (
    <div className="crud-page">
      <PageHeader
        title="Course Master"
        subtitle="Manage courses and subjects"
        onAdd={handleAdd}
        addText="Add Course"
        onRefresh={fetchData}
        loading={loading}
      />

      <Card className="content-card">
        <Tabs 
          items={tabItems}
          defaultActiveKey="list"
          style={{ marginTop: -16 }}
        />
      </Card>

      <FormModal
        title={editingItem ? 'Edit Course' : 'Add New Course'}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        form={form}
        initialValues={editingItem || { status: 'active', credits: 3, type: 'theory' }}
        width={600}
      >
        <Form.Item
          name="name"
          label="Course Name"
          rules={[{ required: true, message: 'Please enter course name' }]}
        >
          <Input placeholder="e.g., Data Structures" />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="code"
              label="Course Code"
              rules={[{ required: true, message: 'Please enter course code' }]}
            >
              <Input placeholder="e.g., CS201" style={{ textTransform: 'uppercase' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="credits"
              label="Credits"
              rules={[{ required: true, message: 'Please enter credits' }]}
            >
              <InputNumber min={1} max={10} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="type"
          label="Course Type"
          rules={[{ required: true, message: 'Please select course type' }]}
        >
          <Select placeholder="Select course type" options={COURSE_TYPES} />
        </Form.Item>

        <Form.Item
          name="status"
          label="Status"
          valuePropName="checked"
          getValueFromEvent={(checked) => checked ? 'active' : 'inactive'}
          getValueProps={(value) => ({ checked: value === 'active' })}
        >
          <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
        </Form.Item>
      </FormModal>
    </div>
  );
};

export default Courses;
