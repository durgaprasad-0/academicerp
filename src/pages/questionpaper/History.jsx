/**
 * Question Paper History Page
 * View and manage previously generated papers
 */

import { useState, useEffect, useMemo } from 'react';
import { Card, Table, Tag, Button, Space, Modal, Typography, Descriptions, List, Row, Col } from 'antd';
import { 
  EyeOutlined, DownloadOutlined, DeleteOutlined,
  FileTextOutlined, CalendarOutlined, ClockCircleOutlined
} from '@ant-design/icons';
import PageHeader from '@/components/common/PageHeader';
import { courses, branches, regulations } from '@/services/mockData';
import { deletePaper } from '@/services/questionPaperService';
import useQuestionPaperStore from '@/store/useQuestionPaperStore';
import { downloadQuestionPaperPdf } from '@/utils/pdfGenerator';
import { formatDateTime } from '@/utils/helpers';
import useAppStore from '@/store/useAppStore';
import '@/pages/admin/CrudPage.css';
import './QuestionPaper.css';

const { Title, Text, Paragraph } = Typography;

// History state management handled by useQuestionPaperStore

const PaperHistory = () => {
  const { papers } = useQuestionPaperStore();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const { showSuccess, showError } = useAppStore();

  useEffect(() => {
    setLoading(true);
    // Papers are loaded from store (persist)
    setData(papers);
    setLoading(false);
  }, [papers]);

  const handleView = (record) => {
    setSelectedPaper(record);
    setViewModalOpen(true);
  };

  const columns = useMemo(() => [
    {
      title: 'Course',
      key: 'course',
      render: (_, record) => {
        const course = courses.find(c => c.id === record.courseId);
        return (
          <div>
            <Text strong>{course?.name || '-'}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>{course?.code}</Text>
          </div>
        );
      },
    },
    {
      title: 'Branch',
      key: 'branch',
      width: 100,
      render: (_, record) => {
        const branch = branches.find(b => b.id === record.branchId);
        return <Tag>{branch?.code || '-'}</Tag>;
      },
    },
    {
      title: 'Exam Type',
      dataIndex: 'examType',
      key: 'examType',
      width: 120,
      render: (type) => (
        <Tag color={type === 'end' ? 'blue' : 'green'}>
          {type === 'end' ? 'End Sem' : type === 'mid' ? 'Mid Sem' : type}
        </Tag>
      ),
    },
    {
      title: 'Semester',
      dataIndex: 'semester',
      key: 'semester',
      width: 100,
      render: (sem) => `Sem ${sem}`,
    },
    {
      title: 'Marks',
      dataIndex: 'totalMarks',
      key: 'totalMarks',
      width: 80,
      align: 'center',
    },
    {
      title: 'Questions',
      dataIndex: 'questionCount',
      key: 'questionCount',
      width: 90,
      align: 'center',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag color={status === 'final' ? 'success' : 'warning'}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Tag>
      ),
    },
    {
      title: 'Generated',
      dataIndex: 'generatedAt',
      key: 'generatedAt',
      width: 140,
      render: (date) => (
        <div style={{ fontSize: 12 }}>
          <CalendarOutlined style={{ marginRight: 4 }} />
          {new Date(date).toLocaleDateString()}
          <br />
          <ClockCircleOutlined style={{ marginRight: 4 }} />
          {new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="text" 
            icon={<EyeOutlined />} 
            onClick={() => handleView(record)}
            title="View"
          />
          <Button 
            type="text" 
            icon={<DownloadOutlined />} 
            onClick={() => handleDownload(record)}
            title="Download"
          />

          <Button 
            type="text" 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => handleDelete(record)}
            title="Delete"
          />
        </Space>
      ),
    },
  ], []);

  const handleDownload = (record) => {
    try {
      downloadQuestionPaperPdf(record);
      showSuccess('PDF Downloaded successfully');
    } catch (error) {
      console.error(error);
      showError('Failed to download PDF');
    }
  };



  const handleDelete = (record) => {
    Modal.confirm({
      title: 'Delete Paper?',
      content: 'Are you sure you want to delete this generated paper? This action cannot be undone.',
      okText: 'Delete',
      okButtonProps: { danger: true },
      onOk: () => {
        deletePaper(record.id);
        showSuccess('Paper deleted');
      },
    });
  };

  const getCourseName = (id) => courses.find(c => c.id === id)?.name || '-';
  const getBranchName = (id) => branches.find(b => b.id === id)?.name || '-';
  const getRegulationName = (id) => regulations.find(r => r.id === id)?.name || '-';

  return (
    <div className="crud-page">
      <PageHeader
        title="Generated Papers History"
        subtitle="View and manage previously generated question papers"
        showAdd={false}
        showRefresh={false}
      />

      <Card className="content-card">
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          loading={loading}
          scroll={{ x: 'max-content' }}
          pagination={{
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} papers`,
          }}
        />
      </Card>

      {/* View Modal */}
      <Modal
        title={
          <Space>
            <FileTextOutlined />
            Paper Details
          </Space>
        }
        open={viewModalOpen}
        onCancel={() => setViewModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalOpen(false)}>
            Close
          </Button>,
          <Button 
            key="download" 
            type="primary" 
            icon={<DownloadOutlined />}
            onClick={() => handleDownload(selectedPaper)}
          >
            Download PDF
          </Button>,
        ]}
        width={700}
      >
        {selectedPaper && (
          <>
            <Descriptions bordered size="small" column={2}>
              <Descriptions.Item label="Course" span={2}>
                {getCourseName(selectedPaper.courseId)}
              </Descriptions.Item>
              <Descriptions.Item label="Branch">
                {getBranchName(selectedPaper.branchId)}
              </Descriptions.Item>
              <Descriptions.Item label="Regulation">
                {getRegulationName(selectedPaper.regulationId)}
              </Descriptions.Item>
              <Descriptions.Item label="Semester">
                Semester {selectedPaper.semester}
              </Descriptions.Item>
              <Descriptions.Item label="Academic Year">
                {selectedPaper.academicYear}
              </Descriptions.Item>
              <Descriptions.Item label="Exam Type">
                <Tag color="blue">
                  {selectedPaper.examType === 'end' ? 'End Semester' : 'Mid Semester'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={selectedPaper.status === 'final' ? 'success' : 'warning'}>
                  {selectedPaper.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Total Marks">
                {selectedPaper.totalMarks} marks
              </Descriptions.Item>
              <Descriptions.Item label="Duration">
                {selectedPaper.duration} minutes
              </Descriptions.Item>
              <Descriptions.Item label="Questions">
                {selectedPaper.questionCount} questions
              </Descriptions.Item>
              <Descriptions.Item label="Generated">
                {formatDateTime(selectedPaper.generatedAt)}
              </Descriptions.Item>
              <Descriptions.Item label="Generated By" span={2}>
                {selectedPaper.generatedBy}
              </Descriptions.Item>
            </Descriptions>

            <Card size="small" style={{ marginTop: 16 }} title="Paper Statistics">
              <Row gutter={16}>
                <Col span={8}>
                  <div style={{ textAlign: 'center' }}>
                    <Title level={3} style={{ margin: 0, color: 'var(--color-primary)' }}>
                      {selectedPaper.questionCount}
                    </Title>
                    <Text type="secondary">Questions</Text>
                  </div>
                </Col>
                <Col span={8}>
                  <div style={{ textAlign: 'center' }}>
                    <Title level={3} style={{ margin: 0, color: 'var(--color-accent)' }}>
                      {selectedPaper.totalMarks}
                    </Title>
                    <Text type="secondary">Total Marks</Text>
                  </div>
                </Col>
                <Col span={8}>
                  <div style={{ textAlign: 'center' }}>
                    <Title level={3} style={{ margin: 0, color: 'var(--color-secondary)' }}>
                      {selectedPaper.duration}
                    </Title>
                    <Text type="secondary">Minutes</Text>
                  </div>
                </Col>
              </Row>
            </Card>
          </>
        )}
      </Modal>
    </div>
  );
};

export default PaperHistory;
