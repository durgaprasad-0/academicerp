/**
 * BulkUpload Component
 * File upload with drag & drop, template download, and progress
 */

import { useState } from 'react';
import { Upload, Button, Progress, Alert, Space, Typography, Modal } from 'antd';
import {
  InboxOutlined,
  DownloadOutlined,
  FileExcelOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { colors } from '@/theme/themeConfig';
import './BulkUpload.css';

const { Dragger } = Upload;
const { Text } = Typography;

const BulkUpload = ({
  onUpload,
  onDownloadTemplate,
  accept = '.xlsx,.xls,.csv',
  maxSize = 5, // MB
  templateName = 'template.xlsx',
  title = 'Upload File',
  description = 'Click or drag file to this area to upload',
  hint = 'Support for Excel (.xlsx, .xls) and CSV files',
}) => {
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);

  const handleUpload = async () => {
    if (fileList.length === 0) return;

    setUploading(true);
    setProgress(0);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', fileList[0]);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      const response = await onUpload(formData);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      setResult({
        success: true,
        message: response?.message || 'File uploaded successfully',
        data: response?.data,
      });
      
      setFileList([]);
    } catch (error) {
      setResult({
        success: false,
        message: error?.message || 'Upload failed. Please try again.',
        errors: error?.errors,
      });
    } finally {
      setUploading(false);
    }
  };

  const uploadProps = {
    accept,
    maxCount: 1,
    fileList,
    beforeUpload: (file) => {
      // Check file size
      const isValidSize = file.size / 1024 / 1024 < maxSize;
      if (!isValidSize) {
        Modal.error({
          title: 'File Too Large',
          content: `File must be smaller than ${maxSize}MB`,
        });
        return Upload.LIST_IGNORE;
      }

      setFileList([file]);
      setResult(null);
      return false; // Prevent auto upload
    },
    onRemove: () => {
      setFileList([]);
      setResult(null);
    },
  };

  return (
    <div className="bulk-upload">
      {/* Template Download */}
      {onDownloadTemplate && (
        <div className="template-section">
          <Text type="secondary">
            Download the template file to ensure correct format:
          </Text>
          <Button
            icon={<DownloadOutlined />}
            onClick={onDownloadTemplate}
            className="template-btn"
          >
            Download Template ({templateName})
          </Button>
        </div>
      )}

      {/* Upload Area */}
      <Dragger {...uploadProps} className="upload-dragger">
        <p className="ant-upload-drag-icon">
          <InboxOutlined style={{ color: colors.primary, fontSize: 48 }} />
        </p>
        <p className="ant-upload-text">{title}</p>
        <p className="ant-upload-hint">{description}</p>
        <p className="ant-upload-hint upload-hint-secondary">{hint}</p>
      </Dragger>

      {/* File Preview */}
      {fileList.length > 0 && (
        <div className="file-preview">
          <FileExcelOutlined style={{ color: colors.success, fontSize: 24 }} />
          <div className="file-info">
            <Text strong>{fileList[0].name}</Text>
            <Text type="secondary">
              {(fileList[0].size / 1024).toFixed(2)} KB
            </Text>
          </div>
        </div>
      )}

      {/* Progress */}
      {uploading && (
        <div className="upload-progress">
          <Progress percent={progress} status="active" />
          <Text type="secondary">Uploading and processing...</Text>
        </div>
      )}

      {/* Result */}
      {result && (
        <Alert
          message={result.success ? 'Upload Successful' : 'Upload Failed'}
          description={
            <div>
              <p>{result.message}</p>
              {result.data && (
                <div className="upload-stats">
                  <span><CheckCircleOutlined /> {result.data.success || 0} records imported</span>
                  {result.data.failed > 0 && (
                    <span><CloseCircleOutlined /> {result.data.failed} failed</span>
                  )}
                </div>
              )}
              {result.errors && result.errors.length > 0 && (
                <div className="upload-errors">
                  <Text strong>Errors:</Text>
                  <ul>
                    {result.errors.slice(0, 5).map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                    {result.errors.length > 5 && (
                      <li>...and {result.errors.length - 5} more errors</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          }
          type={result.success ? 'success' : 'error'}
          showIcon
          closable
          onClose={() => setResult(null)}
          className="upload-result"
        />
      )}

      {/* Upload Button */}
      <div className="upload-actions">
        <Space>
          <Button
            type="primary"
            onClick={handleUpload}
            disabled={fileList.length === 0}
            loading={uploading}
            size="large"
          >
            {uploading ? 'Uploading...' : 'Upload File'}
          </Button>
          {fileList.length > 0 && !uploading && (
            <Button onClick={() => setFileList([])}>
              Clear
            </Button>
          )}
        </Space>
      </div>
    </div>
  );
};

export default BulkUpload;
