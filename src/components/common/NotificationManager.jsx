/**
 * NotificationManager Component
 * Global notification handler using Ant Design notifications
 */

import { useEffect, useCallback } from 'react';
import { notification, message } from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import useAppStore from '@/store/useAppStore';
import { colors } from '@/theme/themeConfig';

// Configure global notification settings
notification.config({
  placement: 'topRight',
  duration: 4,
  maxCount: 3,
});

// Configure global message settings
message.config({
  maxCount: 3,
  duration: 3,
});

const iconStyle = { fontSize: 20 };

const iconMap = {
  success: <CheckCircleOutlined style={{ ...iconStyle, color: colors.success }} />,
  error: <CloseCircleOutlined style={{ ...iconStyle, color: '#EF4444' }} />,
  info: <InfoCircleOutlined style={{ ...iconStyle, color: colors.info }} />,
  warning: <ExclamationCircleOutlined style={{ ...iconStyle, color: '#F59E0B' }} />,
};

const NotificationManager = () => {
  const { notifications, removeNotification } = useAppStore();

  const showNotification = useCallback((item) => {
    const { id, type, message: msg, description } = item;

    notification[type]({
      key: id,
      message: msg,
      description,
      icon: iconMap[type],
      className: `notification-${type}`,
      onClose: () => removeNotification(id),
      style: {
        borderRadius: 8,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
      },
    });
  }, [removeNotification]);

  // Watch for new notifications
  useEffect(() => {
    if (notifications.length > 0) {
      const latestNotification = notifications[notifications.length - 1];
      showNotification(latestNotification);
    }
  }, [notifications, showNotification]);

  // This component doesn't render anything visible
  return null;
};

// Export utility functions for direct usage
export const notify = {
  success: (msg, description = '') => {
    notification.success({
      message: msg,
      description,
      icon: iconMap.success,
      style: { borderRadius: 8 },
    });
  },
  
  error: (msg, description = '') => {
    notification.error({
      message: msg,
      description,
      icon: iconMap.error,
      duration: 6,
      style: { borderRadius: 8 },
    });
  },
  
  info: (msg, description = '') => {
    notification.info({
      message: msg,
      description,
      icon: iconMap.info,
      style: { borderRadius: 8 },
    });
  },
  
  warning: (msg, description = '') => {
    notification.warning({
      message: msg,
      description,
      icon: iconMap.warning,
      duration: 5,
      style: { borderRadius: 8 },
    });
  },

  // Confirmation with action
  confirm: (msg, description, onConfirm, onCancel) => {
    const key = `confirm_${Date.now()}`;
    
    notification.warning({
      key,
      message: msg,
      description,
      icon: iconMap.warning,
      duration: 0,
      btn: (
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => {
              notification.destroy(key);
              onCancel?.();
            }}
            style={{
              padding: '4px 12px',
              border: '1px solid #d9d9d9',
              borderRadius: 6,
              background: '#fff',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              notification.destroy(key);
              onConfirm?.();
            }}
            style={{
              padding: '4px 12px',
              border: 'none',
              borderRadius: 6,
              background: colors.primary,
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            Confirm
          </button>
        </div>
      ),
      style: { borderRadius: 8 },
    });
  },

  // Session expiry notification
  sessionExpired: () => {
    notification.error({
      message: 'Session Expired',
      description: 'Your session has expired. Please login again.',
      icon: iconMap.error,
      duration: 0,
      style: { borderRadius: 8 },
    });
  },

  // API failure notification
  apiError: (description = 'Please try again later.') => {
    notification.error({
      message: 'Request Failed',
      description,
      icon: iconMap.error,
      style: { borderRadius: 8 },
    });
  },
};

// Quick toast messages
export const toast = {
  success: (msg) => message.success(msg),
  error: (msg) => message.error(msg),
  info: (msg) => message.info(msg),
  warning: (msg) => message.warning(msg),
  loading: (msg) => message.loading(msg),
};

export default NotificationManager;
