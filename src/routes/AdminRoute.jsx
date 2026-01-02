/**
 * AdminRoute Component
 * Route protection for admin-only pages
 */

import { Navigate } from 'react-router-dom';
import useUserStore from '@/store/useUserStore';
import ProtectedRoute from './ProtectedRoute';

const AdminRoute = ({ children }) => {
  const { role } = useUserStore();

  return (
    <ProtectedRoute>
      {role === 'admin' ? children : <Navigate to="/403" replace />}
    </ProtectedRoute>
  );
};

export default AdminRoute;
