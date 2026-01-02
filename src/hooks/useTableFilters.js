/**
 * useTableFilters Hook
 * Manages table filters with session storage persistence
 */

import { useState, useCallback, useEffect, useMemo } from 'react';
import { DEFAULT_PAGE_SIZE } from '@/utils/constants';

const useTableFilters = (tableId, options = {}) => {
  const {
    defaultFilters = {},
    defaultSorter = null,
    defaultPageSize = DEFAULT_PAGE_SIZE,
    persistFilters = true,
  } = options;

  const storageKey = `table_filters_${tableId}`;

  // Get initial state from session storage or defaults
  const getInitialState = () => {
    if (persistFilters) {
      try {
        const stored = sessionStorage.getItem(storageKey);
        if (stored) {
          return JSON.parse(stored);
        }
      } catch {
        // Ignore parse errors
      }
    }
    
    return {
      filters: defaultFilters,
      sorter: defaultSorter,
      pagination: {
        current: 1,
        pageSize: defaultPageSize,
      },
      searchText: '',
    };
  };

  const [state, setState] = useState(getInitialState);

  // Persist to session storage
  useEffect(() => {
    if (persistFilters) {
      try {
        sessionStorage.setItem(storageKey, JSON.stringify(state));
      } catch {
        // Ignore storage errors
      }
    }
  }, [state, storageKey, persistFilters]);

  /**
   * Update filters
   */
  const setFilters = useCallback((newFilters) => {
    setState(prev => ({
      ...prev,
      filters: typeof newFilters === 'function' 
        ? newFilters(prev.filters) 
        : { ...prev.filters, ...newFilters },
      pagination: { ...prev.pagination, current: 1 }, // Reset to first page
    }));
  }, []);

  /**
   * Update single filter
   */
  const setFilter = useCallback((key, value) => {
    setState(prev => ({
      ...prev,
      filters: { ...prev.filters, [key]: value },
      pagination: { ...prev.pagination, current: 1 },
    }));
  }, []);

  /**
   * Clear single filter
   */
  const clearFilter = useCallback((key) => {
    setState(prev => {
      const newFilters = { ...prev.filters };
      delete newFilters[key];
      return {
        ...prev,
        filters: newFilters,
        pagination: { ...prev.pagination, current: 1 },
      };
    });
  }, []);

  /**
   * Update sorter
   */
  const setSorter = useCallback((sorter) => {
    setState(prev => ({
      ...prev,
      sorter,
    }));
  }, []);

  /**
   * Update pagination
   */
  const setPagination = useCallback((pagination) => {
    setState(prev => ({
      ...prev,
      pagination: typeof pagination === 'function'
        ? pagination(prev.pagination)
        : { ...prev.pagination, ...pagination },
    }));
  }, []);

  /**
   * Update search text
   */
  const setSearchText = useCallback((text) => {
    setState(prev => ({
      ...prev,
      searchText: text,
      pagination: { ...prev.pagination, current: 1 },
    }));
  }, []);

  /**
   * Handle Ant Design table change
   */
  const handleTableChange = useCallback((pagination, filters, sorter) => {
    setState(prev => ({
      ...prev,
      pagination: {
        current: pagination.current,
        pageSize: pagination.pageSize,
      },
      filters: { ...prev.filters, ...filters },
      sorter: sorter.order ? {
        field: sorter.field,
        order: sorter.order,
      } : null,
    }));
  }, []);

  /**
   * Reset all filters
   */
  const resetFilters = useCallback(() => {
    setState({
      filters: defaultFilters,
      sorter: defaultSorter,
      pagination: {
        current: 1,
        pageSize: defaultPageSize,
      },
      searchText: '',
    });
  }, [defaultFilters, defaultSorter, defaultPageSize]);

  /**
   * Clear all stored filters for this table
   */
  const clearStorage = useCallback(() => {
    if (persistFilters) {
      sessionStorage.removeItem(storageKey);
    }
    resetFilters();
  }, [storageKey, persistFilters, resetFilters]);

  /**
   * Check if any filters are active
   */
  const hasActiveFilters = useMemo(() => {
    const hasFilters = Object.values(state.filters).some(v => 
      v !== null && v !== undefined && v !== '' && 
      (!Array.isArray(v) || v.length > 0)
    );
    return hasFilters || state.searchText !== '';
  }, [state.filters, state.searchText]);

  /**
   * Get filtered and sorted data
   */
  const getFilteredData = useCallback((data, searchKeys = []) => {
    let result = [...data];

    // Apply search filter
    if (state.searchText && searchKeys.length > 0) {
      const searchLower = state.searchText.toLowerCase();
      result = result.filter(item =>
        searchKeys.some(key => {
          const value = item[key];
          return value && value.toString().toLowerCase().includes(searchLower);
        })
      );
    }

    // Apply column filters
    Object.entries(state.filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        if (Array.isArray(value) && value.length > 0) {
          result = result.filter(item => value.includes(item[key]));
        } else {
          result = result.filter(item => item[key] === value);
        }
      }
    });

    // Apply sorting
    if (state.sorter?.field && state.sorter?.order) {
      const { field, order } = state.sorter;
      result.sort((a, b) => {
        const aVal = a[field];
        const bVal = b[field];
        
        if (aVal < bVal) return order === 'ascend' ? -1 : 1;
        if (aVal > bVal) return order === 'ascend' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [state.searchText, state.filters, state.sorter]);

  /**
   * Get paginated data
   */
  const getPaginatedData = useCallback((data) => {
    const { current, pageSize } = state.pagination;
    const startIndex = (current - 1) * pageSize;
    return data.slice(startIndex, startIndex + pageSize);
  }, [state.pagination]);

  return {
    // State
    filters: state.filters,
    sorter: state.sorter,
    pagination: state.pagination,
    searchText: state.searchText,
    hasActiveFilters,

    // Actions
    setFilters,
    setFilter,
    clearFilter,
    setSorter,
    setPagination,
    setSearchText,
    handleTableChange,
    resetFilters,
    clearStorage,

    // Data helpers
    getFilteredData,
    getPaginatedData,
  };
};

export default useTableFilters;
