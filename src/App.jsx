/**
 * App Component
 * Root application component with providers and dark mode support
 */

import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { ConfigProvider, App as AntApp } from 'antd';
import router from '@/routes';
import { lightTheme, darkTheme } from '@/theme/themeConfig';
import NotificationManager from '@/components/common/NotificationManager';
import useThemeStore from '@/store/useThemeStore';

const App = () => {
  const { isDarkMode } = useThemeStore();

  // Apply dark mode class to document for CSS variables
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  const currentTheme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ConfigProvider theme={currentTheme}>
      <AntApp>
        <NotificationManager />
        <RouterProvider router={router} />
      </AntApp>
    </ConfigProvider>
  );
};

export default App;
