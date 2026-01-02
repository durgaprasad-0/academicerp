/**
 * App Component
 * Root application component with providers
 */

import { RouterProvider } from 'react-router-dom';
import { ConfigProvider, App as AntApp } from 'antd';
import router from '@/routes';
import { themeConfig } from '@/theme/themeConfig';
import NotificationManager from '@/components/common/NotificationManager';

const App = () => {
  return (
    <ConfigProvider theme={themeConfig}>
      <AntApp>
        <NotificationManager />
        <RouterProvider router={router} />
      </AntApp>
    </ConfigProvider>
  );
};

export default App;
