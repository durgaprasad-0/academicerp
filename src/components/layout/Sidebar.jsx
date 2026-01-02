/**
 * Sidebar Component
 * Role-based navigation sidebar with collapsible menu
 */

import { useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  BookOutlined,
  BranchesOutlined,
  FileTextOutlined,
  TeamOutlined,
  LinkOutlined,
  AppstoreOutlined,
  QuestionCircleOutlined,
  FormOutlined,
  HistoryOutlined,
  SettingOutlined,
  AimOutlined,
} from '@ant-design/icons';
import useUserStore from '@/store/useUserStore';
import useThemeStore from '@/store/useThemeStore';
import './Sidebar.css';

const { Sider } = Layout;

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { role } = useUserStore();
  const { sidebarCollapsed, isMobile, closeMobileDrawer, isDarkMode } = useThemeStore();

  // Admin menu items
  const adminMenuItems = useMemo(() => [
    {
      key: '/admin/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: 'program-management',
      icon: <BookOutlined />,
      label: 'Program Management',
      children: [
        { key: '/admin/programs', label: 'Programs' },
        { key: '/admin/branches', label: 'Branches' },
        { key: '/admin/regulations', label: 'Regulations' },
        { key: '/admin/program-branch-mapping', label: 'Program-Branch Mapping' },
      ],
    },
    {
      key: 'course-management',
      icon: <AppstoreOutlined />,
      label: 'Course Management',
      children: [
        { key: '/admin/courses', label: 'Course Master' },
        { key: '/admin/branch-course-mapping', label: 'Branch-Course Mapping' },
      ],
    },
    {
      key: 'faculty-management',
      icon: <TeamOutlined />,
      label: 'Faculty Management',
      children: [
        { key: '/admin/faculty', label: 'All Faculty' },
        { key: '/admin/faculty-course-mapping', label: 'Faculty-Course Mapping' },
      ],
    },
    {
      key: '/admin/task-assignment',
      icon: <FormOutlined />,
      label: 'Task Assignment',
    },
  ], []);

  // Faculty menu items
  const facultyMenuItems = useMemo(() => [
    {
      key: '/faculty/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: 'course-setup',
      icon: <BookOutlined />,
      label: 'Course Setup',
      children: [
        { key: '/faculty/course-outcomes', icon: <AimOutlined />, label: 'Course Outcomes' },
        { key: '/faculty/units', icon: <AppstoreOutlined />, label: 'Units' },
      ],
    },
    {
      key: 'configuration',
      icon: <SettingOutlined />,
      label: 'Configuration',
      children: [
        { key: '/faculty/bloom-levels', label: 'Bloom Levels' },
        { key: '/faculty/difficulty-levels', label: 'Difficulty Levels' },
      ],
    },
    {
      key: '/faculty/question-bank',
      icon: <QuestionCircleOutlined />,
      label: 'Question Bank',
    },
    {
      key: 'question-paper',
      icon: <FormOutlined />,
      label: 'Question Paper',
      children: [
        { key: '/question-paper/generator', label: 'Generator' },
        { key: '/question-paper/history', icon: <HistoryOutlined />, label: 'History' },
      ],
    },
  ], []);

  const menuItems = role === 'admin' ? adminMenuItems : facultyMenuItems;

  // Find the currently selected key and open keys
  const selectedKey = location.pathname;
  const openKeys = useMemo(() => {
    // Find parent keys for current path
    const findParentKeys = (items, path, parents = []) => {
      for (const item of items) {
        if (item.children) {
          const childMatch = item.children.find(child => child.key === path);
          if (childMatch) {
            return [...parents, item.key];
          }
          const nestedParents = findParentKeys(item.children, path, [...parents, item.key]);
          if (nestedParents.length > parents.length) {
            return nestedParents;
          }
        }
      }
      return parents;
    };

    return findParentKeys(menuItems, selectedKey);
  }, [menuItems, selectedKey]);

  const handleMenuClick = ({ key }) => {
    navigate(key);
    if (isMobile) {
      closeMobileDrawer();
    }
  };

  // Dynamic colors based on theme
  const siderStyle = {
    background: isDarkMode ? '#1E293B' : '#fff',
    borderRight: `1px solid ${isDarkMode ? '#334155' : '#E5E7EB'}`,
    height: '100vh',
    position: 'fixed',
    left: 0,
    top: 0,
    bottom: 0,
    zIndex: 100,
    overflow: 'auto',
  };

  const logoBackground = isDarkMode ? '#4E73DF' : '#1F3C88';

  return (
    <Sider
      className="sidebar"
      width={260}
      collapsedWidth={80}
      collapsed={sidebarCollapsed}
      trigger={null}
      style={siderStyle}
      theme={isDarkMode ? 'dark' : 'light'}
    >
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon" style={{ background: logoBackground }}>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: sidebarCollapsed ? 16 : 20 }}>
            {sidebarCollapsed ? 'A' : 'AE'}
          </span>
        </div>
        {!sidebarCollapsed && (
          <div className="logo-text">
            <h1 style={{ color: isDarkMode ? '#60A5FA' : '#1F3C88' }}>Academic ERP</h1>
            <span>{role === 'admin' ? 'Administrator' : 'Faculty Portal'}</span>
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        defaultOpenKeys={openKeys}
        items={menuItems}
        onClick={handleMenuClick}
        theme={isDarkMode ? 'dark' : 'light'}
        style={{ 
          border: 'none',
          background: 'transparent',
        }}
        className="sidebar-menu"
      />

      {/* Version Info */}
      {!sidebarCollapsed && (
        <div className="sidebar-footer">
          <span>v1.0.0</span>
        </div>
      )}
    </Sider>
  );
};

export default Sidebar;

