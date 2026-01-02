/**
 * Helper Functions
 * Common utility functions used across the application
 */

import dayjs from 'dayjs';
import { DATE_FORMAT, DATE_TIME_FORMAT, API_DATE_FORMAT } from './constants';

/**
 * Format date for display
 */
export const formatDate = (date, format = DATE_FORMAT) => {
  if (!date) return '-';
  return dayjs(date).format(format);
};

/**
 * Format date with time
 */
export const formatDateTime = (date) => {
  if (!date) return '-';
  return dayjs(date).format(DATE_TIME_FORMAT);
};

/**
 * Format date for API
 */
export const formatDateForApi = (date) => {
  if (!date) return null;
  return dayjs(date).format(API_DATE_FORMAT);
};

/**
 * Get relative time (e.g., "2 hours ago")
 */
export const getRelativeTime = (date) => {
  if (!date) return '-';
  const now = dayjs();
  const then = dayjs(date);
  const diffMinutes = now.diff(then, 'minute');
  
  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
  if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)} hours ago`;
  if (diffMinutes < 10080) return `${Math.floor(diffMinutes / 1440)} days ago`;
  return formatDate(date);
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Capitalize first letter
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Convert string to title case
 */
export const toTitleCase = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Generate random ID
 */
export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Debounce function
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

/**
 * Deep clone object
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Check if object is empty
 */
export const isEmpty = (obj) => {
  if (!obj) return true;
  if (Array.isArray(obj)) return obj.length === 0;
  if (typeof obj === 'object') return Object.keys(obj).length === 0;
  return false;
};

/**
 * Get initials from name
 */
export const getInitials = (name) => {
  if (!name) return 'U';
  const parts = name.split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

/**
 * Format number with commas
 */
export const formatNumber = (num) => {
  if (num === null || num === undefined) return '0';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * Format file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Validate email
 */
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Validate phone number (Indian format)
 */
export const isValidPhone = (phone) => {
  const regex = /^[6-9]\d{9}$/;
  return regex.test(phone);
};

/**
 * Get color based on status
 */
export const getStatusColor = (status) => {
  const colors = {
    active: '#00B894',
    inactive: '#E17055',
    pending: '#FDCB6E',
    approved: '#00B894',
    rejected: '#E17055',
    draft: '#6B7280',
  };
  return colors[status?.toLowerCase()] || '#6B7280';
};

/**
 * Get color based on difficulty
 */
export const getDifficultyColor = (difficulty) => {
  const colors = {
    easy: '#00B894',
    medium: '#FDCB6E',
    hard: '#E17055',
  };
  return colors[difficulty?.toLowerCase()] || '#6B7280';
};

/**
 * Sort array by key
 */
export const sortByKey = (array, key, order = 'asc') => {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

/**
 * Filter array by search term
 */
export const filterBySearch = (array, searchTerm, keys) => {
  if (!searchTerm) return array;
  const term = searchTerm.toLowerCase();
  
  return array.filter((item) =>
    keys.some((key) => {
      const value = item[key];
      if (!value) return false;
      return value.toString().toLowerCase().includes(term);
    })
  );
};

/**
 * Group array by key
 */
export const groupBy = (array, key) => {
  return array.reduce((groups, item) => {
    const value = item[key];
    groups[value] = groups[value] || [];
    groups[value].push(item);
    return groups;
  }, {});
};

/**
 * Download file from blob
 */
export const downloadFile = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

/**
 * Get query params from URL
 */
export const getQueryParams = (search) => {
  return Object.fromEntries(new URLSearchParams(search));
};

/**
 * Build query string from object
 */
export const buildQueryString = (params) => {
  const filtered = Object.entries(params).filter(
    ([, value]) => value !== null && value !== undefined && value !== ''
  );
  return new URLSearchParams(filtered).toString();
};

export default {
  formatDate,
  formatDateTime,
  formatDateForApi,
  getRelativeTime,
  truncateText,
  capitalize,
  toTitleCase,
  generateId,
  debounce,
  deepClone,
  isEmpty,
  getInitials,
  formatNumber,
  formatFileSize,
  isValidEmail,
  isValidPhone,
  getStatusColor,
  getDifficultyColor,
  sortByKey,
  filterBySearch,
  groupBy,
  downloadFile,
  copyToClipboard,
  getQueryParams,
  buildQueryString,
};
