/**
 * Bloom Levels Page
 * CRUD for Bloom's Taxonomy levels
 */

import { useState, useEffect, useMemo } from 'react';
import { Form, Input, InputNumber, Tag, Switch, Card, Typography } from 'antd';
import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import FormModal from '@/components/common/FormModal';
import { bloomLevels as mockBloomLevels, createMockCrud } from '@/services/mockData';
import useAppStore from '@/store/useAppStore';
import '@/pages/admin/CrudPage.css';

const { Text } = Typography;

const bloomService = createMockCrud(mockBloomLevels);

// Bloom level colors
const BLOOM_COLORS = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'];

const BloomLevels = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();
  const { showSuccess, showError } = useAppStore();

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await bloomService.getAll();
      setData(response.data);
    } catch {
      showError('Failed to fetch Bloom levels');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = useMemo(() => [
    {
      title: 'Level',
      dataIndex: 'level',
      key: 'level',
      width: 80,
      sorter: (a, b) => a.level - b.level,
      render: (level) => (
        <Tag color={BLOOM_COLORS[level - 1] || 'default'}>L{level}</Tag>
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (name, record) => (
        <div>
          <Text strong>{name}</Text>
          <div style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }}>
            {record.description}
          </div>
        </div>
      ),
    },
    {
      title: 'Action Verbs',
      dataIndex: 'actionVerbs',
      key: 'actionVerbs',
      width: 300,
      render: (verbs) => verbs?.join(', ') || '-',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag color={status === 'active' ? 'success' : 'default'}>
          {status?.charAt(0).toUpperCase() + status?.slice(1)}
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
      actionVerbs: record.actionVerbs?.join(', '),
    });
    setModalOpen(true);
  };

  const handleDelete = async (record) => {
    try {
      await bloomService.delete(record.id);
      setData(prev => prev.filter(item => item.id !== record.id));
      showSuccess('Bloom level deleted');
    } catch {
      showError('Failed to delete');
    }
  };

  const handleSubmit = async (values) => {
    try {
      const payload = {
        ...values,
        actionVerbs: values.actionVerbs?.split(',').map(v => v.trim()).filter(Boolean),
      };
      
      if (editingItem) {
        const response = await bloomService.update(editingItem.id, payload);
        setData(prev => prev.map(item => 
          item.id === editingItem.id ? { ...item, ...response.data } : item
        ));
        showSuccess('Bloom level updated');
      } else {
        const response = await bloomService.create(payload);
        setData(prev => [...prev, response.data]);
        showSuccess('Bloom level created');
      }
      setModalOpen(false);
      form.resetFields();
    } catch {
      showError('Failed to save');
    }
  };

  return (
    <div className="crud-page">
      <PageHeader
        title="Bloom Levels"
        subtitle="Manage Bloom's Taxonomy cognitive levels for question classification"
        onAdd={handleAdd}
        addText="Add Level"
        onRefresh={fetchData}
        loading={loading}
      />

      <Card className="content-card">
        <DataTable
          tableId="bloom-levels"
          columns={columns}
          dataSource={data}
          loading={loading}
          searchKeys={['name', 'description']}
          onEdit={handleEdit}
          onDelete={handleDelete}
          emptyText="No Bloom Levels Found"
          emptyDescription="Define Bloom's Taxonomy levels for question classification."
        />
      </Card>

      <FormModal
        title={editingItem ? 'Edit Bloom Level' : 'Add Bloom Level'}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        form={form}
        initialValues={editingItem || { status: 'active', level: data.length + 1 }}
      >
        <Form.Item
          name="level"
          label="Level Number"
          rules={[{ required: true, message: 'Please enter level number' }]}
        >
          <InputNumber min={1} max={6} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="name"
          label="Level Name"
          rules={[{ required: true, message: 'Please enter level name' }]}
        >
          <Input placeholder="e.g., Remember, Understand, Apply" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
        >
          <Input.TextArea rows={2} placeholder="Brief description of this cognitive level" />
        </Form.Item>

        <Form.Item
          name="actionVerbs"
          label="Action Verbs (comma-separated)"
          extra="Enter action verbs associated with this level, separated by commas"
        >
          <Input.TextArea 
            rows={2} 
            placeholder="e.g., define, list, recall, identify, recognize"
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

export default BloomLevels;
