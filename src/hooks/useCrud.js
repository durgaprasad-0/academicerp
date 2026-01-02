/**
 * useCrud Hook
 * Reusable CRUD operations hook
 */

import { useState, useCallback, useEffect } from 'react';
import useAppStore from '@/store/useAppStore';
import { MESSAGES } from '@/utils/constants';

const useCrud = (apiService, options = {}) => {
  const {
    fetchOnMount = true,
    onSuccess = null,
    onError = null,
  } = options;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  
  const { showSuccess, showError } = useAppStore();

  /**
   * Fetch all records
   */
  const fetchAll = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.getAll(params);
      
      if (response.success) {
        setData(response.data);
        return response.data;
      }
    } catch (err) {
      const message = err?.response?.data?.message || MESSAGES.ERROR.FETCH;
      setError(message);
      showError('Error', message);
      onError?.(err);
    } finally {
      setLoading(false);
    }
  }, [apiService, showError, onError]);

  /**
   * Get single record by ID
   */
  const getById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.getById(id);
      
      if (response.success) {
        setSelectedItem(response.data);
        return response.data;
      }
    } catch (err) {
      const message = err?.response?.data?.message || MESSAGES.ERROR.FETCH;
      setError(message);
      showError('Error', message);
      onError?.(err);
    } finally {
      setLoading(false);
    }
  }, [apiService, showError, onError]);

  /**
   * Create new record
   */
  const create = useCallback(async (payload) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.create(payload);
      
      if (response.success) {
        setData(prev => [...prev, response.data]);
        showSuccess('Success', MESSAGES.SUCCESS.CREATE);
        onSuccess?.(response.data, 'create');
        return { success: true, data: response.data };
      }
    } catch (err) {
      const message = err?.response?.data?.message || MESSAGES.ERROR.CREATE;
      setError(message);
      showError('Error', message);
      onError?.(err);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, [apiService, showSuccess, showError, onSuccess, onError]);

  /**
   * Update existing record
   */
  const update = useCallback(async (id, payload) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.update(id, payload);
      
      if (response.success) {
        setData(prev => prev.map(item => 
          item.id === id ? { ...item, ...response.data } : item
        ));
        showSuccess('Success', MESSAGES.SUCCESS.UPDATE);
        onSuccess?.(response.data, 'update');
        return { success: true, data: response.data };
      }
    } catch (err) {
      const message = err?.response?.data?.message || MESSAGES.ERROR.UPDATE;
      setError(message);
      showError('Error', message);
      onError?.(err);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, [apiService, showSuccess, showError, onSuccess, onError]);

  /**
   * Delete record
   */
  const remove = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.delete(id);
      
      if (response.success) {
        setData(prev => prev.filter(item => item.id !== id));
        showSuccess('Success', MESSAGES.SUCCESS.DELETE);
        onSuccess?.(id, 'delete');
        return { success: true };
      }
    } catch (err) {
      const message = err?.response?.data?.message || MESSAGES.ERROR.DELETE;
      setError(message);
      showError('Error', message);
      onError?.(err);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, [apiService, showSuccess, showError, onSuccess, onError]);

  /**
   * Bulk delete
   */
  const bulkDelete = useCallback(async (ids) => {
    setLoading(true);
    setError(null);
    
    try {
      // Delete one by one (or use bulk API if available)
      for (const id of ids) {
        await apiService.delete(id);
      }
      
      setData(prev => prev.filter(item => !ids.includes(item.id)));
      showSuccess('Success', `${ids.length} records deleted successfully`);
      onSuccess?.(ids, 'bulkDelete');
      return { success: true };
    } catch (err) {
      const message = err?.response?.data?.message || MESSAGES.ERROR.DELETE;
      setError(message);
      showError('Error', message);
      onError?.(err);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, [apiService, showSuccess, showError, onSuccess, onError]);

  /**
   * Refresh data
   */
  const refresh = useCallback(() => {
    return fetchAll();
  }, [fetchAll]);

  /**
   * Clear selection
   */
  const clearSelection = useCallback(() => {
    setSelectedItem(null);
  }, []);

  /**
   * Set selected item
   */
  const selectItem = useCallback((item) => {
    setSelectedItem(item);
  }, []);

  // Fetch on mount if enabled
  useEffect(() => {
    if (fetchOnMount) {
      fetchAll();
    }
  }, [fetchOnMount, fetchAll]);

  return {
    // State
    data,
    loading,
    error,
    selectedItem,
    
    // CRUD Operations
    fetchAll,
    getById,
    create,
    update,
    remove,
    bulkDelete,
    
    // Helpers
    refresh,
    selectItem,
    clearSelection,
    setData,
  };
};

export default useCrud;
