import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Theme Store - Manages UI theme and layout preferences
 */
const useThemeStore = create(
  persist(
    (set, get) => ({
      // State
      isDarkMode: false,
      sidebarCollapsed: false,
      sidebarWidth: 260,
      collapsedWidth: 80,
      isMobile: false,
      mobileDrawerOpen: false,

      // Actions
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      setDarkMode: (value) => set({ isDarkMode: value }),

      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

      setMobile: (isMobile) => set({ 
        isMobile,
        sidebarCollapsed: isMobile, // Auto-collapse on mobile
      }),

      toggleMobileDrawer: () => set((state) => ({ mobileDrawerOpen: !state.mobileDrawerOpen })),
      closeMobileDrawer: () => set({ mobileDrawerOpen: false }),
      openMobileDrawer: () => set({ mobileDrawerOpen: true }),

      // Getters
      getCurrentSidebarWidth: () => {
        const state = get();
        if (state.isMobile) return 0;
        return state.sidebarCollapsed ? state.collapsedWidth : state.sidebarWidth;
      },
    }),
    {
      name: 'theme-storage',
      partialize: (state) => ({
        isDarkMode: state.isDarkMode,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);

export default useThemeStore;
