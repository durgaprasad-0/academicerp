/**
 * Auth Service
 * Authentication related API calls and helpers
 */

import { apiService } from './api';
import { API_ENDPOINTS } from '@/utils/constants';

// Mock user data for demo purposes
const MOCK_USERS = {
  'admin@academicerp.com': {
    id: 1,
    email: 'admin@academicerp.com',
    password: 'admin123',
    name: 'Dr. Rajesh Kumar',
    role: 'admin',
    avatar: null,
    department: 'Administration',
    designation: 'Administrator',
  },
  'faculty@academicerp.com': {
    id: 2,
    email: 'faculty@academicerp.com',
    password: 'faculty123',
    name: 'Prof. Anjali Sharma',
    role: 'faculty',
    avatar: null,
    department: 'Computer Science',
    designation: 'Associate Professor',
  },
};

// Generate mock JWT token
const generateMockToken = (user) => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(
    JSON.stringify({
      sub: user.id,
      email: user.email,
      role: user.role,
      exp: Math.floor(Date.now() / 1000) + 86400, // 24 hours
    })
  );
  const signature = btoa('mock-signature');
  return `${header}.${payload}.${signature}`;
};

/**
 * Login with credentials
 */
export const login = async (email, password) => {
  // In production, use real API
  // return apiService.post(API_ENDPOINTS.AUTH.LOGIN, { email, password });
  
  // Mock login for demo
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = MOCK_USERS[email];
      
      if (user && user.password === password) {
        const token = generateMockToken(user);
        const { password: _, ...userData } = user;
        
        resolve({
          success: true,
          data: {
            user: userData,
            token,
          },
          message: 'Login successful',
        });
      } else {
        reject({
          response: {
            status: 401,
            data: {
              message: 'Invalid email or password',
            },
          },
        });
      }
    }, 800); // Simulate network delay
  });
};

/**
 * Logout
 */
export const logout = async () => {
  // In production, call logout API to invalidate token
  // return apiService.post(API_ENDPOINTS.AUTH.LOGOUT);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 300);
  });
};

/**
 * Get current user profile
 */
export const getProfile = async () => {
  // return apiService.get(API_ENDPOINTS.AUTH.PROFILE);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: MOCK_USERS['admin@academicerp.com'],
      });
    }, 300);
  });
};

/**
 * Update profile
 */
export const updateProfile = async (data) => {
  // return apiService.put(API_ENDPOINTS.AUTH.PROFILE, data);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Profile updated successfully',
        data,
      });
    }, 500);
  });
};

/**
 * Change password
 */
export const changePassword = async (currentPassword, newPassword) => {
  // return apiService.post(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, {
  //   currentPassword,
  //   newPassword,
  // });
  
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (currentPassword === 'admin123' || currentPassword === 'faculty123') {
        resolve({
          success: true,
          message: 'Password changed successfully',
        });
      } else {
        reject({
          response: {
            status: 400,
            data: {
              message: 'Current password is incorrect',
            },
          },
        });
      }
    }, 500);
  });
};

/**
 * Verify token validity
 */
export const verifyToken = (token) => {
  if (!token) return false;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

/**
 * Get role from token
 */
export const getRoleFromToken = (token) => {
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role;
  } catch {
    return null;
  }
};

/**
 * Refresh token
 */
export const refreshToken = async () => {
  // return apiService.post(API_ENDPOINTS.AUTH.REFRESH);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          token: generateMockToken({ id: 1, email: 'admin@academicerp.com', role: 'admin' }),
        },
      });
    }, 300);
  });
};

export default {
  login,
  logout,
  getProfile,
  updateProfile,
  changePassword,
  verifyToken,
  getRoleFromToken,
  refreshToken,
};
