/**
 * NotificationsDropdown Component
 * Dropdown panel showing user notifications
 */

import { useState } from 'react';
import { Dropdown, Badge, Button, List, Typography, Empty, Tabs, Tag, Tooltip } from 'antd';
import {
  BellOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  WarningOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  CheckOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import useNotificationStore from '@/store/useNotificationStore';
import { colors } from '@/theme/themeConfig';
import './NotificationsDropdown.css';

const { Text } = Typography;

// Format relative time
const getRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

// Get icon by type
const getTypeIcon = (type) => {
  switch (type) {
    case 'success':
      return <CheckCircleOutlined style={{ color: colors.success }} />;
    case 'warning':
      return <WarningOutlined style={{ color: '#F59E0B' }} />;
    case 'error':
      return <CloseCircleOutlined style={{ color: '#EF4444' }} />;
    default:
      return <InfoCircleOutlined style={{ color: colors.info }} />;
  }
};

const NotificationsDropdown = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    removeNotification,
    clearAll,
  } = useNotificationStore();

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    if (notification.link) {
      navigate(notification.link);
      setOpen(false);
    }
  };

  const unreadNotifications = notifications.filter(n => !n.read);
  const readNotifications = notifications.filter(n => n.read);

  const renderNotificationItem = (item) => (
    <List.Item
      className={`notification-item ${!item.read ? 'unread' : ''}`}
      onClick={() => handleNotificationClick(item)}
      actions={[
        <Tooltip title="Remove" key="remove">
          <Button
            type="text"
            size="small"
            icon={<DeleteOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              removeNotification(item.id);
            }}
            className="notification-action-btn"
          />
        </Tooltip>,
      ]}
    >
      <List.Item.Meta
        avatar={
          <div className="notification-icon">
            {getTypeIcon(item.type)}
          </div>
        }
        title={
          <div className="notification-title">
            <Text strong ellipsis>{item.title}</Text>
            {!item.read && <span className="unread-dot" />}
          </div>
        }
        description={
          <div className="notification-desc">
            <Text type="secondary" ellipsis={{ rows: 2 }}>{item.message}</Text>
            <div className="notification-time">
              <ClockCircleOutlined style={{ marginRight: 4 }} />
              {getRelativeTime(item.time)}
            </div>
          </div>
        }
      />
    </List.Item>
  );

  const dropdownContent = (
    <div className="notifications-dropdown">
      <div className="notifications-header">
        <Text strong style={{ fontSize: 16 }}>Notifications</Text>
        {unreadCount() > 0 && (
          <Button 
            type="link" 
            size="small"
            icon={<CheckOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              markAllAsRead();
            }}
          >
            Mark all read
          </Button>
        )}
      </div>

      <Tabs
        defaultActiveKey="unread"
        size="small"
        className="notifications-tabs"
        items={[
          {
            key: 'unread',
            label: (
              <span>
                Unread
                {unreadCount() > 0 && (
                  <Badge count={unreadCount()} size="small" style={{ marginLeft: 6 }} />
                )}
              </span>
            ),
            children: unreadNotifications.length > 0 ? (
              <List
                dataSource={unreadNotifications}
                renderItem={renderNotificationItem}
                className="notifications-list"
              />
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No unread notifications"
                style={{ padding: '24px 0' }}
              />
            ),
          },
          {
            key: 'all',
            label: 'All',
            children: notifications.length > 0 ? (
              <List
                dataSource={notifications}
                renderItem={renderNotificationItem}
                className="notifications-list"
              />
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No notifications"
                style={{ padding: '24px 0' }}
              />
            ),
          },
        ]}
      />

      {notifications.length > 0 && (
        <div className="notifications-footer">
          <Button 
            type="text" 
            size="small" 
            danger
            onClick={(e) => {
              e.stopPropagation();
              clearAll();
            }}
          >
            Clear All
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <Dropdown
      popupRender={() => dropdownContent}
      trigger={['click']}
      open={open}
      onOpenChange={setOpen}
      placement="bottomRight"
      arrow={{ pointAtCenter: true }}
    >
      <Tooltip title="Notifications">
        <Badge count={unreadCount()} size="small" offset={[-3, 3]}>
          <Button 
            type="text" 
            icon={<BellOutlined />} 
            className="header-icon-btn"
            aria-label="Notifications"
          />
        </Badge>
      </Tooltip>
    </Dropdown>
  );
};

export default NotificationsDropdown;
