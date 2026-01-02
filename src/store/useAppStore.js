import { create } from 'zustand';

/**
 * App Store - Global application state
 */
const useAppStore = create((set, get) => ({
  // Global Loading State
  globalLoading: false,
  loadingMessage: '',
  
  // Modal States
  activeModal: null,
  modalData: null,

  // Notification Queue
  notifications: [],

  // Actions
  setGlobalLoading: (loading, message = '') => set({
    globalLoading: loading,
    loadingMessage: message,
  }),

  // Modal Management
  openModal: (modalName, data = null) => set({
    activeModal: modalName,
    modalData: data,
  }),

  closeModal: () => set({
    activeModal: null,
    modalData: null,
  }),

  // Notification Management
  addNotification: (notification) => set((state) => ({
    notifications: [
      ...state.notifications,
      {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        ...notification,
      },
    ],
  })),

  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter((n) => n.id !== id),
  })),

  clearNotifications: () => set({ notifications: [] }),

  // Quick Actions
  showSuccess: (message, description = '') => {
    get().addNotification({
      type: 'success',
      message,
      description,
    });
  },

  showError: (message, description = '') => {
    get().addNotification({
      type: 'error',
      message,
      description,
    });
  },

  showWarning: (message, description = '') => {
    get().addNotification({
      type: 'warning',
      message,
      description,
    });
  },

  showInfo: (message, description = '') => {
    get().addNotification({
      type: 'info',
      message,
      description,
    });
  },
}));

export default useAppStore;
