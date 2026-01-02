/**
 * Application Routes
 * Centralized routing with lazy loading and role-based guards
 */

import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';
import FacultyRoute from './FacultyRoute';
import PageLoader from '@/components/common/PageLoader';

// Lazy load pages for code splitting
const Login = lazy(() => import('@/pages/auth/Login'));

// Error pages
const Forbidden = lazy(() => import('@/pages/error/Forbidden'));
const NotFound = lazy(() => import('@/pages/error/NotFound'));
const ServerError = lazy(() => import('@/pages/error/ServerError'));

// Admin pages
const AdminDashboard = lazy(() => import('@/pages/admin/Dashboard'));
const Programs = lazy(() => import('@/pages/admin/Programs'));
const Branches = lazy(() => import('@/pages/admin/Branches'));
const Regulations = lazy(() => import('@/pages/admin/Regulations'));
const Courses = lazy(() => import('@/pages/admin/Courses'));
const Faculty = lazy(() => import('@/pages/admin/Faculty'));
const ProgramBranchMapping = lazy(() => import('@/pages/admin/ProgramBranchMapping'));
const BranchCourseMapping = lazy(() => import('@/pages/admin/BranchCourseMapping'));
const FacultyCourseMapping = lazy(() => import('@/pages/admin/FacultyCourseMapping'));

// Faculty pages
const FacultyDashboard = lazy(() => import('@/pages/faculty/Dashboard'));
const CourseOutcomes = lazy(() => import('@/pages/faculty/CourseOutcomes'));
const BloomLevels = lazy(() => import('@/pages/faculty/BloomLevels'));
const DifficultyLevels = lazy(() => import('@/pages/faculty/DifficultyLevels'));
const Units = lazy(() => import('@/pages/faculty/Units'));
const QuestionBank = lazy(() => import('@/pages/faculty/QuestionBank'));

// Question Paper pages
const QuestionPaperGenerator = lazy(() => import('@/pages/questionpaper/Generator'));
const PaperHistory = lazy(() => import('@/pages/questionpaper/History'));

// Common pages
const Profile = lazy(() => import('@/pages/common/Profile'));
const ChangePassword = lazy(() => import('@/pages/common/ChangePassword'));

// Suspense wrapper
const LazyComponent = ({ children }) => (
  <Suspense fallback={<PageLoader />}>
    {children}
  </Suspense>
);

// Router configuration
const router = createBrowserRouter([
  // Public routes
  {
    path: '/login',
    element: <LazyComponent><Login /></LazyComponent>,
  },

  // Error pages
  {
    path: '/403',
    element: <LazyComponent><Forbidden /></LazyComponent>,
  },
  {
    path: '/500',
    element: <LazyComponent><ServerError /></LazyComponent>,
  },

  // Protected routes with layout
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      // Root redirect
      {
        index: true,
        element: <Navigate to="/admin/dashboard" replace />,
      },

      // Admin routes
      {
        path: 'admin',
        children: [
          {
            path: 'dashboard',
            element: (
              <AdminRoute>
                <LazyComponent><AdminDashboard /></LazyComponent>
              </AdminRoute>
            ),
          },
          {
            path: 'programs',
            element: (
              <AdminRoute>
                <LazyComponent><Programs /></LazyComponent>
              </AdminRoute>
            ),
          },
          {
            path: 'branches',
            element: (
              <AdminRoute>
                <LazyComponent><Branches /></LazyComponent>
              </AdminRoute>
            ),
          },
          {
            path: 'regulations',
            element: (
              <AdminRoute>
                <LazyComponent><Regulations /></LazyComponent>
              </AdminRoute>
            ),
          },
          {
            path: 'program-branch-mapping',
            element: (
              <AdminRoute>
                <LazyComponent><ProgramBranchMapping /></LazyComponent>
              </AdminRoute>
            ),
          },
          {
            path: 'courses',
            element: (
              <AdminRoute>
                <LazyComponent><Courses /></LazyComponent>
              </AdminRoute>
            ),
          },
          {
            path: 'branch-course-mapping',
            element: (
              <AdminRoute>
                <LazyComponent><BranchCourseMapping /></LazyComponent>
              </AdminRoute>
            ),
          },
          {
            path: 'faculty',
            element: (
              <AdminRoute>
                <LazyComponent><Faculty /></LazyComponent>
              </AdminRoute>
            ),
          },
          {
            path: 'faculty-course-mapping',
            element: (
              <AdminRoute>
                <LazyComponent><FacultyCourseMapping /></LazyComponent>
              </AdminRoute>
            ),
          },
        ],
      },

      // Faculty routes
      {
        path: 'faculty',
        children: [
          {
            path: 'dashboard',
            element: (
              <FacultyRoute>
                <LazyComponent><FacultyDashboard /></LazyComponent>
              </FacultyRoute>
            ),
          },
          {
            path: 'course-outcomes',
            element: (
              <FacultyRoute>
                <LazyComponent><CourseOutcomes /></LazyComponent>
              </FacultyRoute>
            ),
          },
          {
            path: 'bloom-levels',
            element: (
              <FacultyRoute>
                <LazyComponent><BloomLevels /></LazyComponent>
              </FacultyRoute>
            ),
          },
          {
            path: 'difficulty-levels',
            element: (
              <FacultyRoute>
                <LazyComponent><DifficultyLevels /></LazyComponent>
              </FacultyRoute>
            ),
          },
          {
            path: 'units',
            element: (
              <FacultyRoute>
                <LazyComponent><Units /></LazyComponent>
              </FacultyRoute>
            ),
          },
          {
            path: 'question-bank',
            element: (
              <FacultyRoute>
                <LazyComponent><QuestionBank /></LazyComponent>
              </FacultyRoute>
            ),
          },
        ],
      },

      // Question Paper routes (accessible by faculty)
      {
        path: 'question-paper',
        children: [
          {
            path: 'generator',
            element: (
              <FacultyRoute>
                <LazyComponent><QuestionPaperGenerator /></LazyComponent>
              </FacultyRoute>
            ),
          },
          {
            path: 'history',
            element: (
              <FacultyRoute>
                <LazyComponent><PaperHistory /></LazyComponent>
              </FacultyRoute>
            ),
          },
        ],
      },

      // Common routes (accessible by all authenticated users)
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <LazyComponent><Profile /></LazyComponent>
          </ProtectedRoute>
        ),
      },
      {
        path: 'change-password',
        element: (
          <ProtectedRoute>
            <LazyComponent><ChangePassword /></LazyComponent>
          </ProtectedRoute>
        ),
      },
    ],
  },

  // Catch-all 404
  {
    path: '*',
    element: <LazyComponent><NotFound /></LazyComponent>,
  },
]);

export default router;
