/**
 * Question Bank Page
 * Advanced CRUD with filters, bulk upload, and CO/Bloom mapping
 */

import { useState, useEffect, useMemo } from 'react';
import { Form, Input, Select, Tag, Card, Tabs, Row, Col, Typography, Button, Space, Divider, Radio } from 'antd';
import { UploadOutlined, QuestionCircleOutlined, FilterOutlined, PlusOutlined } from '@ant-design/icons';
import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import FormModal from '@/components/common/FormModal';
import BulkUpload from '@/components/common/BulkUpload';
import { 
  questions as mockQuestions, 
  courses, 
  units, 
  bloomLevels, 
  difficultyLevels,
  courseOutcomes,
  createMockCrud 
} from '@/services/mockData';
import { QUESTION_TYPES } from '@/utils/constants';
import useAppStore from '@/store/useAppStore';
import { downloadFile } from '@/utils/downloadHelper';
import '@/pages/admin/CrudPage.css';

const { Text } = Typography;
const { TextArea } = Input;

const questionsService = createMockCrud(mockQuestions);

const QuestionBank = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [activeTab, setActiveTab] = useState('list');
  const [form] = Form.useForm();
  const { showSuccess, showError } = useAppStore();

  // Filters
  const [filters, setFilters] = useState({
    courseId: null,
    unitId: null,
    bloomLevelId: null,
    difficultyLevelId: null,
    questionType: null,
  });

  const assignedCourses = courses.slice(0, 5);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await questionsService.getAll();
      setData(response.data);
    } catch {
      showError('Failed to fetch questions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter data
  const filteredData = useMemo(() => {
    return data.filter(q => {
      if (filters.courseId && q.courseId !== filters.courseId) return false;
      if (filters.unitId && q.unitId !== filters.unitId) return false;
      if (filters.bloomLevelId && q.bloomLevelId !== filters.bloomLevelId) return false;
      if (filters.difficultyLevelId && q.difficultyLevelId !== filters.difficultyLevelId) return false;
      if (filters.questionType && q.questionType !== filters.questionType) return false;
      return true;
    });
  }, [data, filters]);

  // Available units based on selected course
  const availableUnits = filters.courseId 
    ? units.filter(u => u.courseId === filters.courseId)
    : units;

  // Available COs based on selected course
  const availableCOs = filters.courseId || editingItem?.courseId
    ? courseOutcomes.filter(co => co.courseId === (filters.courseId || editingItem?.courseId))
    : courseOutcomes;

  const columns = useMemo(() => [
    {
      title: 'Question',
      dataIndex: 'questionText',
      key: 'questionText',
      ellipsis: true,
      render: (text) => (
        <div style={{ maxWidth: 400 }}>
          <Text ellipsis={{ tooltip: text }}>{text}</Text>
        </div>
      ),
    },
    {
      title: 'Course',
      dataIndex: 'courseId',
      key: 'courseId',
      width: 100,
      render: (id) => {
        const course = courses.find(c => c.id === id);
        return course ? <Tag>{course.code}</Tag> : '-';
      },
    },
    {
      title: 'Unit',
      dataIndex: 'unitId',
      key: 'unitId',
      width: 80,
      render: (id) => {
        const unit = units.find(u => u.id === id);
        return unit ? `U${unit.unitNumber}` : '-';
      },
    },
    {
      title: 'CO',
      dataIndex: 'courseOutcomeId',
      key: 'courseOutcomeId',
      width: 70,
      render: (id) => {
        const co = courseOutcomes.find(c => c.id === id);
        return co ? <Tag color="purple">CO{co.coNumber}</Tag> : '-';
      },
    },
    {
      title: 'Bloom',
      dataIndex: 'bloomLevelId',
      key: 'bloomLevelId',
      width: 100,
      render: (id) => {
        const level = bloomLevels.find(b => b.id === id);
        return level ? <Tag color="blue">L{level.level}</Tag> : '-';
      },
    },
    {
      title: 'Difficulty',
      dataIndex: 'difficultyLevelId',
      key: 'difficultyLevelId',
      width: 100,
      render: (id) => {
        const level = difficultyLevels.find(d => d.id === id);
        const colors = { easy: 'green', medium: 'orange', hard: 'red' };
        return level ? <Tag color={colors[level.name.toLowerCase()]}>{level.name}</Tag> : '-';
      },
    },
    {
      title: 'Type',
      dataIndex: 'questionType',
      key: 'questionType',
      width: 100,
      render: (type) => {
        const typeInfo = QUESTION_TYPES.find(t => t.value === type);
        return <Tag>{typeInfo?.label || type}</Tag>;
      },
    },
    {
      title: 'Marks',
      dataIndex: 'marks',
      key: 'marks',
      width: 70,
      align: 'center',
    },
  ], []);

  const handleAdd = () => {
    setEditingItem(null);
    form.resetFields();
    if (filters.courseId) {
      form.setFieldsValue({ courseId: filters.courseId });
    }
    setModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditingItem(record);
    form.setFieldsValue(record);
    setModalOpen(true);
  };

  const handleDelete = async (record) => {
    try {
      await questionsService.delete(record.id);
      setData(prev => prev.filter(item => item.id !== record.id));
      showSuccess('Question deleted');
    } catch {
      showError('Failed to delete');
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editingItem) {
        const response = await questionsService.update(editingItem.id, values);
        setData(prev => prev.map(item => 
          item.id === editingItem.id ? { ...item, ...response.data } : item
        ));
        showSuccess('Question updated');
      } else {
        const response = await questionsService.create(values);
        setData(prev => [...prev, response.data]);
        showSuccess('Question added');
      }
      setModalOpen(false);
      form.resetFields();
    } catch {
      showError('Failed to save');
    }
  };

  const handleBulkUpload = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Questions imported successfully',
          data: { success: 10, failed: 0 },
        });
      }, 2000);
    });
  };

  const handleClearFilters = () => {
    setFilters({
      courseId: null,
      unitId: null,
      bloomLevelId: null,
      difficultyLevelId: null,
      questionType: null,
    });
  };

  const hasActiveFilters = Object.values(filters).some(Boolean);

  const tabItems = [
    {
      key: 'list',
      label: (
        <span>
          <QuestionCircleOutlined /> Questions ({filteredData.length})
        </span>
      ),
      children: (
        <>
          {/* Filters */}
          <div className="filter-bar">
            <Select
              placeholder="Filter by Course"
              value={filters.courseId}
              onChange={(v) => setFilters(prev => ({ ...prev, courseId: v, unitId: null }))}
              style={{ width: 180 }}
              allowClear
              options={assignedCourses.map(c => ({ value: c.id, label: c.code }))}
            />
            <Select
              placeholder="Filter by Unit"
              value={filters.unitId}
              onChange={(v) => setFilters(prev => ({ ...prev, unitId: v }))}
              style={{ width: 150 }}
              allowClear
              disabled={!filters.courseId}
              options={availableUnits.map(u => ({ value: u.id, label: `Unit ${u.unitNumber}` }))}
            />
            <Select
              placeholder="Bloom Level"
              value={filters.bloomLevelId}
              onChange={(v) => setFilters(prev => ({ ...prev, bloomLevelId: v }))}
              style={{ width: 150 }}
              allowClear
              options={bloomLevels.map(b => ({ value: b.id, label: `L${b.level} - ${b.name}` }))}
            />
            <Select
              placeholder="Difficulty"
              value={filters.difficultyLevelId}
              onChange={(v) => setFilters(prev => ({ ...prev, difficultyLevelId: v }))}
              style={{ width: 130 }}
              allowClear
              options={difficultyLevels.map(d => ({ value: d.id, label: d.name }))}
            />
            <Select
              placeholder="Type"
              value={filters.questionType}
              onChange={(v) => setFilters(prev => ({ ...prev, questionType: v }))}
              style={{ width: 130 }}
              allowClear
              options={QUESTION_TYPES}
            />
            {hasActiveFilters && (
              <Button onClick={handleClearFilters}>Clear Filters</Button>
            )}
          </div>

          <DataTable
            tableId="questions"
            columns={columns}
            dataSource={filteredData}
            loading={loading}
            searchKeys={['questionText']}
            onEdit={handleEdit}
            onDelete={handleDelete}
            showSearch={true}
            emptyText="No Questions Found"
            emptyDescription="Add questions using the form or bulk upload."
          />
        </>
      ),
    },
    {
      key: 'upload',
      label: (
        <span>
          <UploadOutlined /> Bulk Upload
        </span>
      ),
      children: (
        <div style={{ padding: 24 }}>
          <BulkUpload
            onUpload={handleBulkUpload}
            onDownloadTemplate={() => {
              downloadFile('/templates/questions_template.csv', 'questions_template.csv');
              showSuccess('Template download started');
            }}
            templateName="questions_template.csv"
            title="Upload Questions"
            description="Upload an Excel file with questions"
            hint="Required: Question Text, Course, Unit, CO, Bloom Level, Difficulty, Type, Marks"
          />
        </div>
      ),
    },
  ];

  return (
    <div className="crud-page">
      <PageHeader
        title="Question Bank"
        subtitle="Manage questions with CO and Bloom level mapping"
        onAdd={handleAdd}
        addText="Add Question"
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
        title={editingItem ? 'Edit Question' : 'Add Question'}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        form={form}
        initialValues={editingItem || { marks: 5, questionType: 'short' }}
        width={800}
      >
        <Form.Item
          name="questionText"
          label="Question Text"
          rules={[{ required: true, message: 'Please enter question' }]}
        >
          <TextArea rows={4} placeholder="Enter the question text" />
        </Form.Item>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="courseId"
              label="Course"
              rules={[{ required: true, message: 'Required' }]}
            >
              <Select
                placeholder="Select course"
                options={assignedCourses.map(c => ({ value: c.id, label: `${c.code} - ${c.name}` }))}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="unitId"
              label="Unit"
              rules={[{ required: true, message: 'Required' }]}
            >
              <Select
                placeholder="Select unit"
                options={availableUnits.map(u => ({ value: u.id, label: `Unit ${u.unitNumber} - ${u.title}` }))}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="courseOutcomeId"
              label="Course Outcome"
              rules={[{ required: true, message: 'Required' }]}
            >
              <Select
                placeholder="Select CO"
                options={availableCOs.map(co => ({ value: co.id, label: `CO${co.coNumber}` }))}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="bloomLevelId"
              label="Bloom Level"
              rules={[{ required: true, message: 'Required' }]}
            >
              <Select
                placeholder="Select Bloom level"
                options={bloomLevels.map(b => ({ value: b.id, label: `L${b.level} - ${b.name}` }))}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="difficultyLevelId"
              label="Difficulty"
              rules={[{ required: true, message: 'Required' }]}
            >
              <Select
                placeholder="Select difficulty"
                options={difficultyLevels.map(d => ({ value: d.id, label: d.name }))}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="marks"
              label="Marks"
              rules={[{ required: true, message: 'Required' }]}
            >
              <Select
                placeholder="Select marks"
                options={[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15, 20].map(m => ({ value: m, label: `${m} marks` }))}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="questionType"
          label="Question Type"
          rules={[{ required: true, message: 'Required' }]}
        >
          <Radio.Group options={QUESTION_TYPES} optionType="button" buttonStyle="solid" />
        </Form.Item>

        <Form.Item
          name="expectedAnswer"
          label="Expected Answer / Key Points (Optional)"
        >
          <TextArea rows={3} placeholder="Key points or expected answer for reference" />
        </Form.Item>
      </FormModal>
    </div>
  );
};

export default QuestionBank;
