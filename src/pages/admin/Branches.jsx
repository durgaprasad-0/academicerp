/**
 * Branches Page
 * CRUD for academic branches/departments
 */

import { useState, useEffect, useMemo } from 'react';
import { Form, Input, Select, Tag, Switch, Card } from 'antd';
import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import FormModal from '@/components/common/FormModal';
import { branches as mockBranches, programs, createMockCrud } from '@/services/mockData';
import { STATUS_OPTIONS } from '@/utils/constants';
import useAppStore from '@/store/useAppStore';
import './CrudPage.css';

const branchesService = createMockCrud(mockBranches);

const Branches = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();
  const { showSuccess, showError } = useAppStore();

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await branchesService.getAll();
      setData(response.data);
    } catch {
      showError('Failed to fetch branches');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const programOptions = programs.map(p => ({ value: p.id, label: `${p.name} (${p.code})` }));

  const columns = useMemo(() => [
    {
      title: 'Branch Name',
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
      title: 'Program',
      dataIndex: 'programId',
      key: 'programId',
      width: 200,
      render: (programId) => {
        const program = programs.find(p => p.id === programId);
        return program ? program.code : '-';
      },
      filters: programs.map(p => ({ text: p.code, value: p.id })),
      onFilter: (value, record) => record.programId === value,
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
      await branchesService.delete(record.id);
      setData(prev => prev.filter(item => item.id !== record.id));
      showSuccess('Branch deleted successfully');
    } catch {
      showError('Failed to delete branch');
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editingItem) {
        const response = await branchesService.update(editingItem.id, values);
        setData(prev => prev.map(item => 
          item.id === editingItem.id ? { ...item, ...response.data } : item
        ));
        showSuccess('Branch updated successfully');
      } else {
        const response = await branchesService.create(values);
        setData(prev => [...prev, response.data]);
        showSuccess('Branch created successfully');
      }
      setModalOpen(false);
      form.resetFields();
    } catch {
      showError('Failed to save branch');
    }
  };

  return (
    <div className="crud-page">
      <PageHeader
        title="Branches"
        subtitle="Manage academic branches and departments"
        onAdd={handleAdd}
        addText="Add Branch"
        onRefresh={fetchData}
        loading={loading}
      />

      <Card className="content-card">
        <DataTable
          tableId="branches"
          columns={columns}
          dataSource={data}
          loading={loading}
          searchKeys={['name', 'code']}
          onEdit={handleEdit}
          onDelete={handleDelete}
          emptyText="No Branches Found"
          emptyDescription="Start by adding your first branch."
        />
      </Card>

      <FormModal
        title={editingItem ? 'Edit Branch' : 'Add New Branch'}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        form={form}
        initialValues={editingItem || { status: 'active' }}
      >
        <Form.Item
          name="name"
          label="Branch Name"
          rules={[{ required: true, message: 'Please enter branch name' }]}
        >
          <Input placeholder="e.g., Computer Science and Engineering" />
        </Form.Item>

        <Form.Item
          name="code"
          label="Branch Code"
          rules={[{ required: true, message: 'Please enter branch code' }]}
        >
          <Input placeholder="e.g., CSE" style={{ textTransform: 'uppercase' }} />
        </Form.Item>

        <Form.Item
          name="programId"
          label="Program"
          rules={[{ required: true, message: 'Please select a program' }]}
        >
          <Select placeholder="Select program" options={programOptions} />
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

export default Branches;
