/**
 * Header Component
 * Top navigation bar with user menu and actions
 */

import { 
  Layout, 
  Button, 
  Dropdown, 
  Avatar, 
  Badge, 
  Space, 
  Input,
  Tooltip,
} from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
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
import { getInitials } from '@/utils/helpers';
import { colors } from '@/theme/themeConfig';
import './Header.css';

const { Header: AntHeader } = Layout;

const Header = () => {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { sidebarCollapsed, toggleSidebar, isDarkMode, toggleDarkMode, isMobile, openMobileDrawer } = useThemeStore();
  const { logout } = useAuth();

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
          <Input
            placeholder="Search..."
            prefix={<SearchOutlined style={{ color: colors.text?.tertiary }} />}
            className="header-search"
            style={{ width: 260 }}
            allowClear
          />
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
          <Tooltip title="Notifications">
            <Badge count={3} size="small" offset={[-3, 3]}>
              <Button 
                type="text" 
                icon={<BellOutlined />} 
                className="header-icon-btn"
                aria-label="Notifications"
              />
            </Badge>
          </Tooltip>

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
  );
};

export default Header;
