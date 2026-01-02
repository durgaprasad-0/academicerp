/**
 * Global Search Component
 * Command palette style search with keyboard navigation
 */

import { useState, useEffect, useRef, useMemo } from 'react';
import { Modal, Input, List, Tag, Empty, Typography, Spin } from 'antd';
import {
  SearchOutlined,
  BookOutlined,
  BranchesOutlined,
  TeamOutlined,
  QuestionCircleOutlined,
  AppstoreOutlined,
  FileTextOutlined,
  SettingOutlined,
  DashboardOutlined,
  EnterOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import useUserStore from '@/store/useUserStore';
import { colors } from '@/theme/themeConfig';
import './GlobalSearch.css';

const { Text } = Typography;

// Searchable items
const getSearchableItems = (role) => {
  const commonItems = [
    { id: 'profile', title: 'My Profile', category: 'Settings', icon: <SettingOutlined />, path: '/profile' },
    { id: 'password', title: 'Change Password', category: 'Settings', icon: <SettingOutlined />, path: '/change-password' },
  ];

  const adminItems = [
    { id: 'admin-dashboard', title: 'Admin Dashboard', category: 'Dashboard', icon: <DashboardOutlined />, path: '/admin/dashboard' },
    { id: 'programs', title: 'Programs', category: 'Admin', icon: <BookOutlined />, path: '/admin/programs', keywords: ['degree', 'btech', 'mtech'] },
    { id: 'branches', title: 'Branches', category: 'Admin', icon: <BranchesOutlined />, path: '/admin/branches', keywords: ['department', 'cse', 'ece'] },
    { id: 'regulations', title: 'Regulations', category: 'Admin', icon: <FileTextOutlined />, path: '/admin/regulations', keywords: ['curriculum', 'r20'] },
    { id: 'courses', title: 'Course Master', category: 'Admin', icon: <AppstoreOutlined />, path: '/admin/courses', keywords: ['subject'] },
    { id: 'faculty', title: 'Faculty Management', category: 'Admin', icon: <TeamOutlined />, path: '/admin/faculty', keywords: ['teacher', 'professor'] },
    { id: 'pb-mapping', title: 'Program-Branch Mapping', category: 'Admin', icon: <BranchesOutlined />, path: '/admin/program-branch-mapping' },
    { id: 'bc-mapping', title: 'Branch-Course Mapping', category: 'Admin', icon: <AppstoreOutlined />, path: '/admin/branch-course-mapping' },
    { id: 'fc-mapping', title: 'Faculty-Course Mapping', category: 'Admin', icon: <TeamOutlined />, path: '/admin/faculty-course-mapping' },
  ];

  const facultyItems = [
    { id: 'faculty-dashboard', title: 'Faculty Dashboard', category: 'Dashboard', icon: <DashboardOutlined />, path: '/faculty/dashboard' },
    { id: 'course-outcomes', title: 'Course Outcomes', category: 'Faculty', icon: <BookOutlined />, path: '/faculty/course-outcomes', keywords: ['co', 'learning'] },
    { id: 'bloom-levels', title: 'Bloom Levels', category: 'Faculty', icon: <AppstoreOutlined />, path: '/faculty/bloom-levels', keywords: ['taxonomy', 'cognitive'] },
    { id: 'difficulty-levels', title: 'Difficulty Levels', category: 'Faculty', icon: <AppstoreOutlined />, path: '/faculty/difficulty-levels', keywords: ['easy', 'medium', 'hard'] },
    { id: 'units', title: 'Units', category: 'Faculty', icon: <BookOutlined />, path: '/faculty/units', keywords: ['chapter', 'module'] },
    { id: 'question-bank', title: 'Question Bank', category: 'Faculty', icon: <QuestionCircleOutlined />, path: '/faculty/question-bank', keywords: ['questions', 'mcq'] },
    { id: 'generator', title: 'Question Paper Generator', category: 'Question Paper', icon: <FileTextOutlined />, path: '/question-paper/generator', keywords: ['generate', 'auto'] },
    { id: 'history', title: 'Generated Papers History', category: 'Question Paper', icon: <FileTextOutlined />, path: '/question-paper/history', keywords: ['past', 'download'] },
  ];

  if (role === 'admin') {
    return [...adminItems, ...commonItems];
  }
  return [...facultyItems, ...commonItems];
};

const GlobalSearch = ({ open, onClose }) => {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  const searchableItems = useMemo(() => getSearchableItems(user?.role), [user?.role]);

  // Filter results based on search query
  const filteredResults = useMemo(() => {
    if (!searchQuery.trim()) return searchableItems.slice(0, 8);
    
    const query = searchQuery.toLowerCase();
    return searchableItems.filter((item) => {
      const titleMatch = item.title.toLowerCase().includes(query);
      const categoryMatch = item.category.toLowerCase().includes(query);
      const keywordMatch = item.keywords?.some((kw) => kw.includes(query));
      return titleMatch || categoryMatch || keywordMatch;
    });
  }, [searchQuery, searchableItems]);

  // Reset on open
  useEffect(() => {
    if (open) {
      setSearchQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, filteredResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredResults[selectedIndex]) {
        handleSelect(filteredResults[selectedIndex]);
      }
    }
  };

  const handleSelect = (item) => {
    navigate(item.path);
    onClose();
    setSearchQuery('');
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      closable={false}
      centered
      width={560}
      className="global-search-modal"
      styles={{ mask: { backdropFilter: 'blur(4px)' } }}
    >
      <div className="search-container">
        <Input
          ref={inputRef}
          size="large"
          placeholder="Search pages, actions, settings..."
          prefix={<SearchOutlined style={{ color: colors.text?.tertiary, fontSize: 18 }} />}
          suffix={
            <Tag className="search-shortcut">ESC to close</Tag>
          }
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setSelectedIndex(0);
          }}
          onKeyDown={handleKeyDown}
          className="search-input"
          autoComplete="off"
        />

        <div className="search-results">
          {filteredResults.length > 0 ? (
            <List
              dataSource={filteredResults}
              renderItem={(item, index) => (
                <List.Item
                  className={`search-result-item ${index === selectedIndex ? 'selected' : ''}`}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div className="result-icon" style={{ color: colors.primary }}>
                    {item.icon}
                  </div>
                  <div className="result-content">
                    <Text strong>{item.title}</Text>
                    <Text type="secondary" className="result-category">{item.category}</Text>
                  </div>
                  <div className="result-action">
                    <EnterOutlined style={{ color: colors.text?.tertiary }} />
                  </div>
                </List.Item>
              )}
            />
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={`No results for "${searchQuery}"`}
              style={{ padding: '32px 0' }}
            />
          )}
        </div>

        <div className="search-footer">
          <span><Tag>↑↓</Tag> Navigate</span>
          <span><Tag>↵</Tag> Select</span>
          <span><Tag>ESC</Tag> Close</span>
        </div>
      </div>
    </Modal>
  );
};

export default GlobalSearch;
