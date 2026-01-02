/**
 * Regulations Page
 * CRUD for academic regulations
 */

import { useState, useEffect, useMemo } from 'react';
import { Form, Input, InputNumber, Tag, Switch, Card } from 'antd';
import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import FormModal from '@/components/common/FormModal';
import { regulations as mockRegulations, createMockCrud } from '@/services/mockData';
import useAppStore from '@/store/useAppStore';
import './CrudPage.css';

const regulationsService = createMockCrud(mockRegulations);

const Regulations = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();
  const { showSuccess, showError } = useAppStore();

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await regulationsService.getAll();
      setData(response.data);
    } catch {
      showError('Failed to fetch regulations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = useMemo(() => [
    {
      title: 'Regulation Name',
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
      title: 'Year',
      dataIndex: 'year',
      key: 'year',
      width: 100,
      sorter: (a, b) => a.year - b.year,
      render: (year) => <Tag color="blue">{year}</Tag>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      filters: [
        { text: 'Active', value: 'active' },
        { text: 'Inactive', value: 'inactive' },
      ],
      onFilter: (value, record) => record.status === value,
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
      await regulationsService.delete(record.id);
      setData(prev => prev.filter(item => item.id !== record.id));
      showSuccess('Regulation deleted successfully');
    } catch {
      showError('Failed to delete regulation');
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editingItem) {
        const response = await regulationsService.update(editingItem.id, values);
        setData(prev => prev.map(item => 
          item.id === editingItem.id ? { ...item, ...response.data } : item
        ));
        showSuccess('Regulation updated successfully');
      } else {
        const response = await regulationsService.create(values);
        setData(prev => [...prev, response.data]);
        showSuccess('Regulation created successfully');
      }
      setModalOpen(false);
      form.resetFields();
    } catch {
      showError('Failed to save regulation');
    }
  };

  return (
    <div className="crud-page">
      <PageHeader
        title="Regulations"
        subtitle="Manage academic regulations and curricula versions"
        onAdd={handleAdd}
        addText="Add Regulation"
        onRefresh={fetchData}
        loading={loading}
      />

      <Card className="content-card">
        <DataTable
          tableId="regulations"
          columns={columns}
          dataSource={data}
          loading={loading}
          searchKeys={['name', 'description']}
          onEdit={handleEdit}
          onDelete={handleDelete}
          emptyText="No Regulations Found"
          emptyDescription="Start by adding your first regulation."
        />
      </Card>

      <FormModal
        title={editingItem ? 'Edit Regulation' : 'Add New Regulation'}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        form={form}
        initialValues={editingItem || { status: 'active', year: new Date().getFullYear() }}
      >
        <Form.Item
          name="name"
          label="Regulation Name"
          rules={[{ required: true, message: 'Please enter regulation name' }]}
        >
          <Input placeholder="e.g., R20" />
        </Form.Item>

        <Form.Item
          name="year"
          label="Year"
          rules={[{ required: true, message: 'Please enter year' }]}
        >
          <InputNumber 
            min={2000} 
            max={2100} 
            style={{ width: '100%' }} 
            placeholder="e.g., 2020"
          />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
        >
          <Input.TextArea rows={3} placeholder="Brief description of the regulation" />
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

export default Regulations;
