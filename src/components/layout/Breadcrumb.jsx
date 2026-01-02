/**
 * Breadcrumb Component
 * Dynamic breadcrumb navigation based on current route
 */

import { useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Breadcrumb as AntBreadcrumb } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { getRouteMeta } from '@/utils/routesMeta';
import useUserStore from '@/store/useUserStore';
import './Breadcrumb.css';

const Breadcrumb = () => {
  const location = useLocation();
  const { role } = useUserStore();

  const breadcrumbItems = useMemo(() => {
    const meta = getRouteMeta(location.pathname);
    const items = [];

    // Home item
    items.push({
      key: 'home',
      title: (
        <Link to={role === 'admin' ? '/admin/dashboard' : '/faculty/dashboard'}>
          <HomeOutlined />
        </Link>
      ),
    });

    // Build breadcrumb path
    meta.breadcrumb.forEach((item, index) => {
      const isLast = index === meta.breadcrumb.length - 1;
      
      items.push({
        key: index,
        title: isLast ? (
          <span className="breadcrumb-current">{item}</span>
        ) : (
          <span className="breadcrumb-item">{item}</span>
        ),
      });
    });

    return items;
  }, [location.pathname, role]);

  return (
    <div className="breadcrumb-container">
      <AntBreadcrumb items={breadcrumbItems} />
    </div>
  );
};

export default Breadcrumb;
