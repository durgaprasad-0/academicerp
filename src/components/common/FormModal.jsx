/**
 * FormModal Component
 * Reusable modal wrapper for CRUD forms
 */

import { Modal, Form, Button, Space } from 'antd';
import { useEffect } from 'react';
import './FormModal.css';

const FormModal = ({
  title,
  open,
  onClose,
  onSubmit,
  loading = false,
  initialValues = {},
  form: externalForm,
  width = 520,
  children,
  submitText = 'Save',
  cancelText = 'Cancel',
  destroyOnClose = true,
  confirmOnClose = false,
  footer,
  ...restProps
}) => {
  const [internalForm] = Form.useForm();
  const form = externalForm || internalForm;

  // Reset form when modal opens with new values
  useEffect(() => {
    if (open) {
      form.resetFields();
      if (Object.keys(initialValues).length > 0) {
        form.setFieldsValue(initialValues);
      }
    }
  }, [open, initialValues, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await onSubmit(values);
    } catch (error) {
      // Form validation failed, errors will show automatically
    }
  };

  const handleClose = () => {
    if (confirmOnClose && form.isFieldsTouched()) {
      Modal.confirm({
        title: 'Unsaved Changes',
        content: 'You have unsaved changes. Are you sure you want to close?',
        okText: 'Discard',
        cancelText: 'Keep Editing',
        onOk: () => {
          form.resetFields();
          onClose();
        },
      });
    } else {
      form.resetFields();
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSubmit();
    }
  };

  const defaultFooter = (
    <div className="form-modal-footer">
      <Space>
        <Button onClick={handleClose} disabled={loading}>
          {cancelText}
        </Button>
        <Button
          type="primary"
          onClick={handleSubmit}
          loading={loading}
        >
          {submitText}
        </Button>
      </Space>
    </div>
  );

  return (
    <Modal
      title={title}
      open={open}
      onCancel={handleClose}
      width={width}
      destroyOnClose={destroyOnClose}
      footer={footer !== undefined ? footer : defaultFooter}
      className="form-modal"
      maskClosable={!loading}
      closable={!loading}
      keyboard={!loading}
      {...restProps}
    >
      <Form
        form={form}
        layout="vertical"
        onKeyDown={handleKeyDown}
        className="form-modal-content"
        requiredMark="optional"
      >
        {children}
      </Form>
    </Modal>
  );
};

export default FormModal;
