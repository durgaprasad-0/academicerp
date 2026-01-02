/**
 * Programs Page
 * CRUD for academic programs with modal form
 */

import { useState, useEffect, useMemo } from 'react';
import { Form, Input, Select, InputNumber, Tag, Switch, Card } from 'antd';
import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import FormModal from '@/components/common/FormModal';
import { programsService } from '@/services/adminMockService';
import { PROGRAM_TYPES, STATUS_OPTIONS } from '@/utils/constants';
import useAppStore from '@/store/useAppStore';
import './CrudPage.css';

// const programsService = createMockCrud(mockPrograms); // Removed local instance

const Programs = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();
  const { showSuccess, showError } = useAppStore();

  // Fetch data
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await programsService.getAll();
      setData(response.data);
    } catch {
      showError('Failed to fetch programs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Table columns
  const columns = useMemo(() => [
    {
      title: 'Program Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text, record) => (
        <div>
          <strong>{text}</strong>
          <div style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }}>
            {record.description}
          </div>
        </div>
      ),
    },
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      width: 100,
      render: (code) => <Tag color="blue">{code}</Tag>,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      filters: PROGRAM_TYPES.map(t => ({ text: t.label, value: t.value })),
      onFilter: (value, record) => record.type === value,
      render: (type) => {
        const typeInfo = PROGRAM_TYPES.find(t => t.value === type);
        return typeInfo?.label || type;
      },
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
      width: 100,
      sorter: (a, b) => a.duration - b.duration,
      render: (duration) => `${duration} years`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      filters: STATUS_OPTIONS.map(s => ({ text: s.label, value: s.value })),
      onFilter: (value, record) => record.status === value,
      render: (status) => (
        <Tag color={status === 'active' ? 'success' : 'default'}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Tag>
      ),
    },
  ], []);

  // Handlers
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
      await programsService.delete(record.id);
      setData(prev => prev.filter(item => item.id !== record.id));
      showSuccess('Program deleted successfully');
    } catch {
      showError('Failed to delete program');
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editingItem) {
        const response = await programsService.update(editingItem.id, values);
        setData(prev => prev.map(item => 
          item.id === editingItem.id ? { ...item, ...response.data } : item
        ));
        showSuccess('Program updated successfully');
      } else {
        const response = await programsService.create(values);
        setData(prev => [...prev, response.data]);
        showSuccess('Program created successfully');
      }
      setModalOpen(false);
      form.resetFields();
    } catch {
      showError('Failed to save program');
    }
  };

  return (
    <div className="crud-page">
      <PageHeader
        title="Programs"
        subtitle="Manage academic programs and degrees"
        onAdd={handleAdd}
        addText="Add Program"
        onRefresh={fetchData}
        loading={loading}
      />

      <Card className="content-card">
        <DataTable
          tableId="programs"
          columns={columns}
          dataSource={data}
          loading={loading}
          searchKeys={['name', 'code', 'description']}
          onEdit={handleEdit}
          onDelete={handleDelete}
          emptyText="No Programs Found"
          emptyDescription="Start by adding your first academic program."
        />
      </Card>

      <FormModal
        title={editingItem ? 'Edit Program' : 'Add New Program'}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        form={form}
        initialValues={editingItem || { status: 'active', duration: 4, type: 'ug' }}
      >
        <Form.Item
          name="name"
          label="Program Name"
          rules={[{ required: true, message: 'Please enter program name' }]}
        >
          <Input placeholder="e.g., Bachelor of Technology" />
        </Form.Item>

        <Form.Item
          name="code"
          label="Program Code"
          rules={[{ required: true, message: 'Please enter program code' }]}
        >
          <Input placeholder="e.g., B.Tech" style={{ textTransform: 'uppercase' }} />
        </Form.Item>

        <Form.Item
          name="type"
          label="Program Type"
          rules={[{ required: true, message: 'Please select program type' }]}
        >
          <Select
            placeholder="Select program type"
            options={PROGRAM_TYPES}
          />
        </Form.Item>

        <Form.Item
          name="duration"
          label="Duration (Years)"
          rules={[{ required: true, message: 'Please enter duration' }]}
        >
          <InputNumber min={1} max={10} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
        >
          <Input.TextArea 
            rows={3} 
            placeholder="Brief description of the program" 
          />
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

export default Programs;
