/**
 * Header Component
 * Top navigation bar with search, notifications, and user menu
 */

import { useState, useEffect } from 'react';
import { 
  Layout, 
  Button, 
  Dropdown, 
  Avatar, 
  Space, 
  Input,
  Tooltip,
  Tag,
} from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  SearchOutlined,
  SunOutlined,
  MoonOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import useUserStore from '@/store/useUserStore';
import useThemeStore from '@/store/useThemeStore';
import useAuth from '@/hooks/useAuth';
import GlobalSearch from '@/components/common/GlobalSearch';
import NotificationsDropdown from '@/components/common/NotificationsDropdown';
import { getInitials } from '@/utils/helpers';
import { colors } from '@/theme/themeConfig';
import './Header.css';

const { Header: AntHeader } = Layout;

const Header = () => {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { sidebarCollapsed, toggleSidebar, isDarkMode, toggleDarkMode, isMobile, openMobileDrawer } = useThemeStore();
  const { logout } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);

  // Keyboard shortcut for search (Ctrl/Cmd + K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'My Profile',
      onClick: () => navigate('/profile'),
    },
    {
      key: 'change-password',
      icon: <SettingOutlined />,
      label: 'Change Password',
      onClick: () => navigate('/change-password'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      danger: true,
      onClick: logout,
    },
  ];

  const handleToggleSidebar = () => {
    if (isMobile) {
      openMobileDrawer();
    } else {
      toggleSidebar();
    }
  };

  return (
    <>
      <AntHeader className="app-header">
        <div className="header-left">
          <Button
            type="text"
            icon={sidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={handleToggleSidebar}
            className="sidebar-toggle"
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          />
          
          {!isMobile && (
            <div className="search-trigger" onClick={() => setSearchOpen(true)}>
              <SearchOutlined style={{ color: colors.text?.tertiary }} />
              <span className="search-placeholder">Search...</span>
              <Tag className="search-shortcut">⌘K</Tag>
            </div>
          )}
        </div>

        <div className="header-right">
          <Space size="middle">
            {/* Mobile Search */}
            {isMobile && (
              <Tooltip title="Search">
                <Button 
                  type="text" 
                  icon={<SearchOutlined />} 
                  className="header-icon-btn"
                  aria-label="Search"
                  onClick={() => setSearchOpen(true)}
                />
              </Tooltip>
            )}

            {/* Theme Toggle */}
            <Tooltip title={isDarkMode ? 'Light Mode' : 'Dark Mode'}>
              <Button
                type="text"
                icon={isDarkMode ? <SunOutlined /> : <MoonOutlined />}
                onClick={toggleDarkMode}
                className="header-icon-btn"
                aria-label="Toggle theme"
              />
            </Tooltip>

            {/* Notifications */}
            <NotificationsDropdown />

            {/* User Menu */}
            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
              trigger={['click']}
              arrow
            >
              <div className="user-menu" role="button" tabIndex={0} aria-label="User menu">
                <Avatar
                  size={36}
                  style={{ 
                    backgroundColor: colors.primary,
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                  src={user?.avatar}
                >
                  {user ? getInitials(user.name) : 'U'}
                </Avatar>
                {!isMobile && (
                  <div className="user-info">
                    <span className="user-name">{user?.name || 'User'}</span>
                    <span className="user-role">{user?.designation || user?.role}</span>
                  </div>
                )}
              </div>
            </Dropdown>
          </Space>
        </div>
      </AntHeader>

      {/* Global Search Modal */}
      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};

export default Header;
