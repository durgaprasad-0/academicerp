/**
 * DataTable Component
 * Enhanced Ant Design Table with filter memory, sticky header, and consistent UI
 */

import { useState, useMemo } from 'react';
import { Table, Input, Button, Space, Empty, Tag, Tooltip, Popconfirm } from 'antd';
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  FilterOutlined,
  ClearOutlined,
} from '@ant-design/icons';
import useTableFilters from '@/hooks/useTableFilters';
import { PAGINATION_OPTIONS, EMPTY_STATES } from '@/utils/constants';
import { colors } from '@/theme/themeConfig';
import './DataTable.css';

const DataTable = ({
  tableId,
  columns,
  dataSource,
  loading = false,
  rowKey = 'id',
  onEdit,
  onDelete,
  onView,
  searchKeys = [],
  showSearch = true,
  showActions = true,
  actionWidth = 120,
  emptyText,
  emptyDescription,
  scroll,
  rowSelection,
  expandable,
  size = 'middle',
  bordered = false,
  sticky = true,
  ...restProps
}) => {
  const [searchInput, setSearchInput] = useState('');
  
  const {
    filters,
    pagination,
    searchText,
    hasActiveFilters,
    setSearchText,
    handleTableChange,
    resetFilters,
    getFilteredData,
  } = useTableFilters(tableId, {
    defaultPageSize: 10,
    persistFilters: true,
  });

  // Add action column if needed
  const enhancedColumns = useMemo(() => {
    const cols = [...columns];

    if (showActions && (onEdit || onDelete || onView)) {
      cols.push({
        title: 'Actions',
        key: 'actions',
        fixed: 'right',
        width: actionWidth,
        render: (_, record) => (
          <Space size="small">
            {onView && (
              <Tooltip title="View">
                <Button
                  type="text"
                  size="small"
                  icon={<EyeOutlined />}
                  onClick={() => onView(record)}
                  className="action-btn view-btn"
                  aria-label="View record"
                />
              </Tooltip>
            )}
            {onEdit && (
              <Tooltip title="Edit">
                <Button
                  type="text"
                  size="small"
                  icon={<EditOutlined />}
                  onClick={() => onEdit(record)}
                  className="action-btn edit-btn"
                  aria-label="Edit record"
                />
              </Tooltip>
            )}
            {onDelete && (
              <Popconfirm
                title="Delete this record?"
                description="This action cannot be undone."
                onConfirm={() => onDelete(record)}
                okText="Delete"
                cancelText="Cancel"
                okButtonProps={{ danger: true }}
              >
                <Tooltip title="Delete">
                  <Button
                    type="text"
                    size="small"
                    icon={<DeleteOutlined />}
                    className="action-btn delete-btn"
                    aria-label="Delete record"
                  />
                </Tooltip>
              </Popconfirm>
            )}
          </Space>
        ),
      });
    }

    return cols;
  }, [columns, showActions, actionWidth, onEdit, onDelete, onView]);

  // Filter data
  const filteredData = useMemo(() => {
    return getFilteredData(dataSource, searchKeys);
  }, [dataSource, getFilteredData, searchKeys]);

  // Handle search
  const handleSearch = (value) => {
    setSearchText(value);
  };

  // Handle search input change with debounce
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    
    // Debounce search
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
      handleSearch(value);
    }, 300);
  };

  // Empty state component
  const emptyState = (
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description={
        <div className="table-empty-state">
          <p className="empty-title">{emptyText || EMPTY_STATES.questions.title}</p>
          <p className="empty-description">
            {emptyDescription || EMPTY_STATES.questions.description}
          </p>
        </div>
      }
    />
  );

  return (
    <div className="data-table-container">
      {/* Table Toolbar */}
      {(showSearch || hasActiveFilters) && (
        <div className="table-toolbar">
          <div className="toolbar-left">
            {showSearch && (
              <Input
                placeholder="Search..."
                prefix={<SearchOutlined style={{ color: colors.text?.tertiary }} />}
                value={searchInput}
                onChange={handleSearchChange}
                allowClear
                className="table-search"
                style={{ width: 280 }}
                aria-label="Search table"
              />
            )}
          </div>
          
          <div className="toolbar-right">
            {hasActiveFilters && (
              <Button
                icon={<ClearOutlined />}
                onClick={() => {
                  resetFilters();
                  setSearchInput('');
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Data Table */}
      <Table
        columns={enhancedColumns}
        dataSource={filteredData}
        loading={loading}
        rowKey={rowKey}
        size={size}
        bordered={bordered}
        locale={{ emptyText: emptyState }}
        rowSelection={rowSelection}
        expandable={expandable}
        scroll={scroll || { x: 'max-content' }}
        sticky={sticky}
        pagination={{
          ...pagination,
          total: filteredData.length,
          showSizeChanger: true,
          showQuickJumper: true,
          pageSizeOptions: PAGINATION_OPTIONS,
          showTotal: (total, range) => (
            <span className="pagination-total">
              Showing {range[0]}-{range[1]} of {total} records
            </span>
          ),
        }}
        onChange={handleTableChange}
        className="data-table"
        {...restProps}
      />
    </div>
  );
};

// Export common column render helpers
export const renderStatus = (status) => {
  const statusConfig = {
    active: { color: 'success', text: 'Active' },
    inactive: { color: 'error', text: 'Inactive' },
    pending: { color: 'warning', text: 'Pending' },
    draft: { color: 'default', text: 'Draft' },
    final: { color: 'success', text: 'Final' },
  };

  const config = statusConfig[status?.toLowerCase()] || { color: 'default', text: status };
  
  return <Tag color={config.color}>{config.text}</Tag>;
};

export const renderDate = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export default DataTable;
