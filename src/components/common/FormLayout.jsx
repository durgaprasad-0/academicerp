/**
 * FormLayout Component
 * Standardized form layout for consistency across all forms
 */

import { Form, Row, Col } from 'antd';
import './FormLayout.css';

const FormLayout = ({
  form,
  children,
  onFinish,
  onFinishFailed,
  initialValues,
  layout = 'vertical',
  labelCol,
  wrapperCol,
  className = '',
  size = 'middle',
  requiredMark = 'optional',
  ...restProps
}) => {
  return (
    <Form
      form={form}
      layout={layout}
      initialValues={initialValues}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      size={size}
      requiredMark={requiredMark}
      className={`standard-form ${className}`}
      labelCol={labelCol}
      wrapperCol={wrapperCol}
      {...restProps}
    >
      {children}
    </Form>
  );
};

// Form section with title
export const FormSection = ({ title, description, children }) => (
  <div className="form-section">
    {title && (
      <div className="form-section-header">
        <h4 className="form-section-title">{title}</h4>
        {description && (
          <p className="form-section-description">{description}</p>
        )}
      </div>
    )}
    <div className="form-section-content">
      {children}
    </div>
  </div>
);

// Inline form group for side-by-side fields
export const FormRow = ({ children, gutter = [16, 0] }) => (
  <Row gutter={gutter} className="form-row">
    {children}
  </Row>
);

// Form column wrapper
export const FormCol = ({ 
  span = 12, 
  xs = 24, 
  sm = 12, 
  md, 
  lg, 
  xl, 
  children 
}) => (
  <Col xs={xs} sm={sm} md={md} lg={lg} xl={xl} span={span}>
    {children}
  </Col>
);

// Form actions wrapper
export const FormActions = ({ children, align = 'right' }) => (
  <div className={`form-actions align-${align}`}>
    {children}
  </div>
);

// Form divider
export const FormDivider = ({ text }) => (
  <div className="form-divider">
    {text && <span className="divider-text">{text}</span>}
  </div>
);

// Export named components for flexibility
FormLayout.Section = FormSection;
FormLayout.Row = FormRow;
FormLayout.Col = FormCol;
FormLayout.Actions = FormActions;
FormLayout.Divider = FormDivider;

export default FormLayout;
