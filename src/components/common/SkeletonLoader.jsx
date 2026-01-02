/**
 * SkeletonLoader Component
 * Content skeleton placeholders for loading states
 */

import { Skeleton, Card, Row, Col } from 'antd';
import './SkeletonLoader.css';

// Table Skeleton
export const TableSkeleton = ({ rows = 5, columns = 5 }) => (
  <div className="skeleton-table">
    {/* Header */}
    <div className="skeleton-table-header">
      <Skeleton.Input active size="small" block />
    </div>
    
    {/* Rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="skeleton-table-row">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <div key={colIndex} className="skeleton-table-cell">
            <Skeleton.Input active size="small" style={{ width: '100%' }} />
          </div>
        ))}
      </div>
    ))}
  </div>
);

// Card Skeleton
export const CardSkeleton = ({ count = 1 }) => (
  <Row gutter={[16, 16]}>
    {Array.from({ length: count }).map((_, index) => (
      <Col key={index} xs={24} sm={12} lg={6}>
        <Card className="skeleton-card">
          <Skeleton active paragraph={{ rows: 2 }} />
        </Card>
      </Col>
    ))}
  </Row>
);

// Stats Card Skeleton
export const StatsCardSkeleton = ({ count = 4 }) => (
  <Row gutter={[16, 16]}>
    {Array.from({ length: count }).map((_, index) => (
      <Col key={index} xs={24} sm={12} lg={6}>
        <Card className="skeleton-stats-card">
          <div className="skeleton-stats-content">
            <div className="skeleton-stats-info">
              <Skeleton.Input active size="small" style={{ width: 80, height: 14 }} />
              <Skeleton.Input active size="large" style={{ width: 100, height: 32 }} />
            </div>
            <Skeleton.Avatar active size={48} shape="square" />
          </div>
        </Card>
      </Col>
    ))}
  </Row>
);

// Form Skeleton
export const FormSkeleton = ({ fields = 4 }) => (
  <div className="skeleton-form">
    {Array.from({ length: fields }).map((_, index) => (
      <div key={index} className="skeleton-form-field">
        <Skeleton.Input active size="small" style={{ width: 100, height: 14, marginBottom: 8 }} />
        <Skeleton.Input active size="large" block />
      </div>
    ))}
    <div className="skeleton-form-actions">
      <Skeleton.Button active size="large" style={{ width: 100 }} />
      <Skeleton.Button active size="large" style={{ width: 80 }} />
    </div>
  </div>
);

// List Skeleton
export const ListSkeleton = ({ items = 5, avatar = false }) => (
  <div className="skeleton-list">
    {Array.from({ length: items }).map((_, index) => (
      <div key={index} className="skeleton-list-item">
        {avatar && <Skeleton.Avatar active size={40} />}
        <div className="skeleton-list-content">
          <Skeleton active paragraph={{ rows: 1, width: '60%' }} title={{ width: '40%' }} />
        </div>
      </div>
    ))}
  </div>
);

// Page Content Skeleton (Full page placeholder)
export const PageContentSkeleton = () => (
  <div className="skeleton-page">
    {/* Page Header */}
    <div className="skeleton-page-header">
      <Skeleton.Input active size="large" style={{ width: 200, height: 28 }} />
      <Skeleton.Button active size="large" style={{ width: 120 }} />
    </div>
    
    {/* Stats Cards */}
    <StatsCardSkeleton count={4} />
    
    {/* Table */}
    <div style={{ marginTop: 24 }}>
      <Card>
        <TableSkeleton rows={5} />
      </Card>
    </div>
  </div>
);

// Main export with all variants
const SkeletonLoader = {
  Table: TableSkeleton,
  Card: CardSkeleton,
  StatsCard: StatsCardSkeleton,
  Form: FormSkeleton,
  List: ListSkeleton,
  Page: PageContentSkeleton,
};

export default SkeletonLoader;
