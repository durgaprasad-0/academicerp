/**
 * Faculty Page
 * CRUD for faculty with bulk upload support
 */

import { useState, useEffect, useMemo } from 'react';
import { Form, Input, Select, Tag, Switch, Card, Tabs, Row, Col, DatePicker } from 'antd';
import { UploadOutlined, UserAddOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import FormModal from '@/components/common/FormModal';
import BulkUpload from '@/components/common/BulkUpload';
import { faculty as mockFaculty, createMockCrud } from '@/services/mockData';
import { DESIGNATIONS, STATUS_OPTIONS } from '@/utils/constants';
import useAppStore from '@/store/useAppStore';
import './CrudPage.css';

const facultyService = createMockCrud(mockFaculty);

const Faculty = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [activeTab, setActiveTab] = useState('list');
  const [form] = Form.useForm();
  const { showSuccess, showError } = useAppStore();

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await facultyService.getAll();
      setData(response.data);
    } catch {
      showError('Failed to fetch faculty');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = useMemo(() => [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text, record) => (
        <div>
          <strong>{text}</strong>
          <div style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }}>
            {record.email}
          </div>
        </div>
      ),
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      width: 180,
      filters: [...new Set(mockFaculty.map(f => f.department))].map(d => ({ text: d, value: d })),
      onFilter: (value, record) => record.department === value,
    },
    {
      title: 'Designation',
      dataIndex: 'designation',
      key: 'designation',
      width: 160,
      render: (designation) => {
        const info = DESIGNATIONS.find(d => d.value === designation);
        return info?.label || designation;
      },
      filters: DESIGNATIONS.map(d => ({ text: d.label, value: d.value })),
      onFilter: (value, record) => record.designation === value,
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      width: 130,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag color={status === 'active' ? 'success' : 'error'}>
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
    form.setFieldsValue({
      ...record,
      joinDate: record.joinDate ? dayjs(record.joinDate) : null,
    });
    setModalOpen(true);
  };

  const handleDelete = async (record) => {
    try {
      await facultyService.delete(record.id);
      setData(prev => prev.filter(item => item.id !== record.id));
      showSuccess('Faculty deleted successfully');
    } catch {
      showError('Failed to delete faculty');
    }
  };

  const handleSubmit = async (values) => {
    try {
      const payload = {
        ...values,
        joinDate: values.joinDate?.format('YYYY-MM-DD'),
      };
      
      if (editingItem) {
        const response = await facultyService.update(editingItem.id, payload);
        setData(prev => prev.map(item => 
          item.id === editingItem.id ? { ...item, ...response.data } : item
        ));
        showSuccess('Faculty updated successfully');
      } else {
        const response = await facultyService.create(payload);
        setData(prev => [...prev, response.data]);
        showSuccess('Faculty created successfully');
      }
      setModalOpen(false);
      form.resetFields();
    } catch {
      showError('Failed to save faculty');
    }
  };

  const handleBulkUpload = async (formData) => {
    // Simulate bulk upload
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Faculty data imported successfully',
          data: { success: 5, failed: 0 },
        });
      }, 2000);
    });
  };

  const handleDownloadTemplate = () => {
    showSuccess('Template download started');
  };

  const tabItems = [
    {
      key: 'list',
      label: 'Faculty List',
      icon: <UserAddOutlined />,
      children: (
        <DataTable
          tableId="faculty"
          columns={columns}
          dataSource={data}
          loading={loading}
          searchKeys={['name', 'email', 'department']}
          onEdit={handleEdit}
          onDelete={handleDelete}
          emptyText="No Faculty Found"
          emptyDescription="Start by adding faculty members."
        />
      ),
    },
    {
      key: 'upload',
      label: 'Bulk Upload',
      icon: <UploadOutlined />,
      children: (
        <div style={{ padding: 24 }}>
          <BulkUpload
            onUpload={handleBulkUpload}
            onDownloadTemplate={handleDownloadTemplate}
            templateName="faculty_template.xlsx"
            title="Upload Faculty Data"
            description="Upload an Excel file containing faculty information"
            hint="Required columns: Name, Email, Phone, Department, Designation"
          />
        </div>
      ),
    },
  ];

  return (
    <div className="crud-page">
      <PageHeader
        title="Faculty Management"
        subtitle="Manage faculty members and their details"
        onAdd={handleAdd}
        addText="Add Faculty"
        onRefresh={fetchData}
        loading={loading}
      />

      <Card className="content-card">
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab} 
          items={tabItems}
          style={{ marginTop: -16 }}
        />
      </Card>

      <FormModal
        title={editingItem ? 'Edit Faculty' : 'Add New Faculty'}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        form={form}
        initialValues={editingItem || { status: 'active' }}
        width={700}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="name"
              label="Full Name"
              rules={[{ required: true, message: 'Please enter name' }]}
            >
              <Input placeholder="e.g., Dr. John Smith" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Please enter email' },
                { type: 'email', message: 'Please enter a valid email' },
              ]}
            >
              <Input placeholder="email@example.com" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="phone"
              label="Phone Number"
              rules={[{ required: true, message: 'Please enter phone' }]}
            >
              <Input placeholder="10-digit phone number" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="department"
              label="Department"
              rules={[{ required: true, message: 'Please enter department' }]}
            >
              <Input placeholder="e.g., Computer Science" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="designation"
              label="Designation"
              rules={[{ required: true, message: 'Please select designation' }]}
            >
              <Select placeholder="Select designation" options={DESIGNATIONS} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="joinDate"
              label="Join Date"
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

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

export default Faculty;
