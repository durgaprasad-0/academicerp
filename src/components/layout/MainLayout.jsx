/**
 * MainLayout Component
 * Primary layout wrapper with sidebar, header, and content area
 */

import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Layout, Drawer } from 'antd';
import Sidebar from './Sidebar';
import Header from './Header';
import Breadcrumb from './Breadcrumb';
import useThemeStore from '@/store/useThemeStore';
import './MainLayout.css';

const { Content } = Layout;

const MainLayout = () => {
  const { 
    sidebarCollapsed, 
    isMobile, 
    setMobile, 
    mobileDrawerOpen, 
    closeMobileDrawer,
  } = useThemeStore();

  // Detect mobile viewport
  useEffect(() => {
    const handleResize = () => {
      setMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, [setMobile]);

  const sidebarWidth = sidebarCollapsed ? 80 : 260;

  return (
    <Layout className="main-layout">
      {/* Skip Link for Accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Desktop Sidebar */}
      {!isMobile && <Sidebar />}

      {/* Mobile Drawer Sidebar */}
      {isMobile && (
        <Drawer
          placement="left"
          open={mobileDrawerOpen}
          onClose={closeMobileDrawer}
          width={280}
          styles={{ body: { padding: 0 } }}
          className="mobile-sidebar-drawer"
        >
          <Sidebar />
        </Drawer>
      )}

      {/* Main Content Area */}
      <Layout
        className="content-layout"
        style={{
          marginLeft: isMobile ? 0 : sidebarWidth,
          transition: 'margin-left 0.2s ease',
        }}
      >
        <Header />
        
        <Content 
          id="main-content"
          className="main-content"
          role="main"
          tabIndex={-1}
        >
          <Breadcrumb />
          <div className="page-wrapper animate-fade-in">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
