/**
 * Difficulty Levels Page
 * CRUD for question difficulty levels
 */

import { useState, useEffect, useMemo } from 'react';
import { Form, Input, InputNumber, Tag, Switch, Card, Slider } from 'antd';
import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import FormModal from '@/components/common/FormModal';
import { difficultyLevels as mockDifficultyLevels, createMockCrud } from '@/services/mockData';
import useAppStore from '@/store/useAppStore';
import '@/pages/admin/CrudPage.css';

const difficultyService = createMockCrud(mockDifficultyLevels);

// Difficulty colors
const DIFFICULTY_COLORS = {
  easy: '#10B981',
  medium: '#F59E0B',
  hard: '#EF4444',
};

const DifficultyLevels = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();
  const { showSuccess, showError } = useAppStore();

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await difficultyService.getAll();
      setData(response.data);
    } catch {
      showError('Failed to fetch difficulty levels');
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
      render: (level) => <Tag>L{level}</Tag>,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (name) => {
        const color = DIFFICULTY_COLORS[name.toLowerCase()] || 'default';
        return <Tag color={color}>{name}</Tag>;
      },
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Weightage',
      dataIndex: 'weightage',
      key: 'weightage',
      width: 120,
      render: (weightage) => `${weightage || 0}%`,
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
    form.setFieldsValue(record);
    setModalOpen(true);
  };

  const handleDelete = async (record) => {
    try {
      await difficultyService.delete(record.id);
      setData(prev => prev.filter(item => item.id !== record.id));
      showSuccess('Difficulty level deleted');
    } catch {
      showError('Failed to delete');
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editingItem) {
        const response = await difficultyService.update(editingItem.id, values);
        setData(prev => prev.map(item => 
          item.id === editingItem.id ? { ...item, ...response.data } : item
        ));
        showSuccess('Difficulty level updated');
      } else {
        const response = await difficultyService.create(values);
        setData(prev => [...prev, response.data]);
        showSuccess('Difficulty level created');
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
        title="Difficulty Levels"
        subtitle="Define question difficulty levels for balanced paper generation"
        onAdd={handleAdd}
        addText="Add Level"
        onRefresh={fetchData}
        loading={loading}
      />

      <Card className="content-card">
        <DataTable
          tableId="difficulty-levels"
          columns={columns}
          dataSource={data}
          loading={loading}
          searchKeys={['name', 'description']}
          onEdit={handleEdit}
          onDelete={handleDelete}
          emptyText="No Difficulty Levels Found"
          emptyDescription="Define difficulty levels for question classification."
        />
      </Card>

      <FormModal
        title={editingItem ? 'Edit Difficulty Level' : 'Add Difficulty Level'}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        form={form}
        initialValues={editingItem || { status: 'active', level: data.length + 1, weightage: 33 }}
      >
        <Form.Item
          name="level"
          label="Level Number"
          rules={[{ required: true, message: 'Please enter level number' }]}
        >
          <InputNumber min={1} max={5} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="name"
          label="Level Name"
          rules={[{ required: true, message: 'Please enter level name' }]}
        >
          <Input placeholder="e.g., Easy, Medium, Hard" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
        >
          <Input.TextArea rows={2} placeholder="Brief description of this difficulty level" />
        </Form.Item>

        <Form.Item
          name="weightage"
          label="Default Weightage (%)"
          extra="Suggested percentage of questions at this difficulty in generated papers"
        >
          <Slider 
            min={0} 
            max={100} 
            marks={{ 0: '0%', 50: '50%', 100: '100%' }}
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

export default DifficultyLevels;
