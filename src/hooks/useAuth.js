/**
 * useAuth Hook
 * Authentication helper hook for components
 */

import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useUserStore from '@/store/useUserStore';
import useAppStore from '@/store/useAppStore';
import * as authService from '@/services/auth';
import { MESSAGES } from '@/utils/constants';

const useAuth = () => {
  const navigate = useNavigate();
  const { 
    user, 
    token, 
    role, 
    isAuthenticated, 
    isLoading, 
    login: storeLogin, 
    logout: storeLogout,
    setLoading,
  } = useUserStore();
  
  const { showSuccess, showError } = useAppStore();

  /**
   * Login with credentials
   */
  const login = useCallback(async (email, password) => {
    setLoading(true);
    
    try {
      const response = await authService.login(email, password);
      
      if (response.success) {
        storeLogin(response.data.user, response.data.token);
        showSuccess('Welcome back!', `Logged in as ${response.data.user.name}`);
        
        // Redirect based on role
        const redirectPath = response.data.user.role === 'admin' 
          ? '/admin/dashboard' 
          : '/faculty/dashboard';
        
        navigate(redirectPath, { replace: true });
        return { success: true };
      }
    } catch (error) {
      const message = error?.response?.data?.message || 'Login failed';
      showError('Login Failed', message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, [navigate, storeLogin, setLoading, showSuccess, showError]);

  /**
   * Logout user
   */
  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Ignore logout API errors
    } finally {
      storeLogout();
      showSuccess('Logged out successfully');
      navigate('/login', { replace: true });
    }
  }, [navigate, storeLogout, showSuccess]);

  /**
   * Check if user has specific role
   */
  const hasRole = useCallback((requiredRole) => {
    if (!role) return false;
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(role);
    }
    return role === requiredRole;
  }, [role]);

  /**
   * Check if user is admin
   */
  const isAdmin = useCallback(() => role === 'admin', [role]);

  /**
   * Check if user is faculty
   */
  const isFaculty = useCallback(() => role === 'faculty', [role]);

  /**
   * Check if token is valid
   */
  const isTokenValid = useCallback(() => {
    return authService.verifyToken(token);
  }, [token]);

  /**
   * Change password
   */
  const changePassword = useCallback(async (currentPassword, newPassword) => {
    setLoading(true);
    
    try {
      const response = await authService.changePassword(currentPassword, newPassword);
      
      if (response.success) {
        showSuccess('Password Changed', MESSAGES.SUCCESS.UPDATE);
        return { success: true };
      }
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to change password';
      showError('Error', message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, [setLoading, showSuccess, showError]);

  /**
   * Update profile
   */
  const updateProfile = useCallback(async (data) => {
    setLoading(true);
    
    try {
      const response = await authService.updateProfile(data);
      
      if (response.success) {
        showSuccess('Profile Updated', MESSAGES.SUCCESS.UPDATE);
        return { success: true };
      }
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to update profile';
      showError('Error', message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, [setLoading, showSuccess, showError]);

  return {
    // State
    user,
    token,
    role,
    isAuthenticated,
    isLoading,
    
    // Actions
    login,
    logout,
    changePassword,
    updateProfile,
    
    // Helpers
    hasRole,
    isAdmin,
    isFaculty,
    isTokenValid,
  };
};

export default useAuth;
