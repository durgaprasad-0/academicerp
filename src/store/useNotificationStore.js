/**
 * Notifications Store
 * Manage user notifications state
 */

import { create } from 'zustand';

// Mock notifications data
const initialNotifications = [
  {
    id: 1,
    type: 'info',
    title: 'New Course Assigned',
    message: 'You have been assigned to CS401 - Machine Learning',
    time: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    read: false,
    link: '/faculty/course-outcomes',
  },
  {
    id: 2,
    type: 'success',
    title: 'Paper Generated',
    message: 'Question paper for CS201 Mid Semester has been generated',
    time: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    read: false,
    link: '/question-paper/history',
  },
  {
    id: 3,
    type: 'warning',
    title: 'Low Question Count',
    message: 'CS301 has only 5 questions. Add more for better paper generation.',
    time: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    read: true,
    link: '/faculty/question-bank',
  },
  {
    id: 4,
    type: 'info',
    title: 'System Update',
    message: 'Academic ERP will undergo maintenance on Sunday 2 AM - 4 AM',
    time: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    read: true,
    link: null,
  },
];

const useNotificationStore = create((set, get) => ({
  notifications: initialNotifications,
  
  // Get unread count
  unreadCount: () => get().notifications.filter(n => !n.read).length,
  
  // Mark single notification as read
  markAsRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    }));
  },
  
  // Mark all as read
  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    }));
  },
  
  // Remove notification
  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },
  
  // Clear all notifications
  clearAll: () => {
    set({ notifications: [] });
  },
  
  // Add new notification
  addNotification: (notification) => {
    set((state) => ({
      notifications: [
        {
          id: Date.now(),
          time: new Date().toISOString(),
          read: false,
          ...notification,
        },
        ...state.notifications,
      ],
    }));
  },
}));

export default useNotificationStore;
