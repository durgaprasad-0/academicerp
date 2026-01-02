/**
 * ProtectedRoute Component
 * Base route protection with authentication check
 */

import { Navigate, useLocation } from 'react-router-dom';
import useUserStore from '@/store/useUserStore';
import { verifyToken } from '@/services/auth';
import PageLoader from '@/components/common/PageLoader';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated, token, isLoading, logout } = useUserStore();

  // Check if still loading auth state
  if (isLoading) {
    return <PageLoader tip="Checking authentication..." />;
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated || !token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Token expired - logout and redirect
  if (!verifyToken(token)) {
    logout();
    return <Navigate to="/login" state={{ from: location, expired: true }} replace />;
  }

  return children;
};

export default ProtectedRoute;
