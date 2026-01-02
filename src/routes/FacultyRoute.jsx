/**
 * FacultyRoute Component
 * Route protection for faculty-only pages
 */

import { Navigate } from 'react-router-dom';
import useUserStore from '@/store/useUserStore';
import ProtectedRoute from './ProtectedRoute';

const FacultyRoute = ({ children }) => {
  const { role } = useUserStore();

  return (
    <ProtectedRoute>
      {role === 'faculty' ? children : <Navigate to="/403" replace />}
    </ProtectedRoute>
  );
};

export default FacultyRoute;
