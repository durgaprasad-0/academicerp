import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * User Store - Manages authentication state and user data
 */
const useUserStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      role: null,
      isAuthenticated: false,
      isLoading: false,

      // Actions
      setUser: (userData) => set({
        user: userData,
        role: userData?.role || null,
        isAuthenticated: !!userData,
      }),

      setToken: (token) => set({ token }),

      login: (userData, token) => set({
        user: userData,
        token: token,
        role: userData?.role || null,
        isAuthenticated: true,
        isLoading: false,
      }),

      logout: () => {
        set({
          user: null,
          token: null,
          role: null,
          isAuthenticated: false,
          isLoading: false,
        });
        // Clear any cached data
        sessionStorage.clear();
      },

      setLoading: (loading) => set({ isLoading: loading }),

      // Selectors
      isAdmin: () => get().role === 'admin',
      isFaculty: () => get().role === 'faculty',
      
      // Check if token is expired
      isTokenExpired: () => {
        const token = get().token;
        if (!token) return true;
        
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          return payload.exp * 1000 < Date.now();
        } catch {
          return true;
        }
      },
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        role: state.role,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useUserStore;
