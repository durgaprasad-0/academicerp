/**
 * Routes Metadata
 * Centralized route configuration for breadcrumbs and navigation
 */

import {
  DashboardOutlined,
  BookOutlined,
  BranchesOutlined,
  FileTextOutlined,
  TeamOutlined,
  LinkOutlined,
  AimOutlined,
  ThunderboltOutlined,
  AppstoreOutlined,
  QuestionCircleOutlined,
  FormOutlined,
  HistoryOutlined,
  UserOutlined,
  LockOutlined,
  SettingOutlined,
} from '@ant-design/icons';

export const routesMeta = {
  // Auth Routes
  '/login': {
    title: 'Login',
    breadcrumb: ['Login'],
    icon: LockOutlined,
    hideInMenu: true,
  },

  // Admin Routes
  '/admin/dashboard': {
    title: 'Admin Dashboard',
    breadcrumb: ['Admin', 'Dashboard'],
    icon: DashboardOutlined,
    role: 'admin',
  },
  '/admin/programs': {
    title: 'Programs',
    breadcrumb: ['Admin', 'Program Management', 'Programs'],
    icon: BookOutlined,
    role: 'admin',
  },
  '/admin/branches': {
    title: 'Branches',
    breadcrumb: ['Admin', 'Program Management', 'Branches'],
    icon: BranchesOutlined,
    role: 'admin',
  },
  '/admin/regulations': {
    title: 'Regulations',
    breadcrumb: ['Admin', 'Program Management', 'Regulations'],
    icon: FileTextOutlined,
    role: 'admin',
  },
  '/admin/program-branch-mapping': {
    title: 'Program-Branch Mapping',
    breadcrumb: ['Admin', 'Mapping', 'Program-Branch'],
    icon: LinkOutlined,
    role: 'admin',
  },
  '/admin/courses': {
    title: 'Course Master',
    breadcrumb: ['Admin', 'Course Management', 'Courses'],
    icon: AppstoreOutlined,
    role: 'admin',
  },
  '/admin/branch-course-mapping': {
    title: 'Branch-Course Mapping',
    breadcrumb: ['Admin', 'Mapping', 'Branch-Course'],
    icon: LinkOutlined,
    role: 'admin',
  },
  '/admin/faculty': {
    title: 'Faculty Management',
    breadcrumb: ['Admin', 'Faculty', 'All Faculty'],
    icon: TeamOutlined,
    role: 'admin',
  },
  '/admin/faculty-course-mapping': {
    title: 'Faculty-Course Mapping',
    breadcrumb: ['Admin', 'Mapping', 'Faculty-Course'],
    icon: LinkOutlined,
    role: 'admin',
  },

  // Faculty Routes
  '/faculty/dashboard': {
    title: 'Faculty Dashboard',
    breadcrumb: ['Faculty', 'Dashboard'],
    icon: DashboardOutlined,
    role: 'faculty',
  },
  '/faculty/course-outcomes': {
    title: 'Course Outcomes',
    breadcrumb: ['Faculty', 'Course Setup', 'Course Outcomes'],
    icon: AimOutlined,
    role: 'faculty',
  },
  '/faculty/bloom-levels': {
    title: 'Bloom Levels',
    breadcrumb: ['Faculty', 'Configuration', 'Bloom Levels'],
    icon: ThunderboltOutlined,
    role: 'faculty',
  },
  '/faculty/difficulty-levels': {
    title: 'Difficulty Levels',
    breadcrumb: ['Faculty', 'Configuration', 'Difficulty Levels'],
    icon: SettingOutlined,
    role: 'faculty',
  },
  '/faculty/units': {
    title: 'Unit Management',
    breadcrumb: ['Faculty', 'Course Setup', 'Units'],
    icon: AppstoreOutlined,
    role: 'faculty',
  },
  '/faculty/question-bank': {
    title: 'Question Bank',
    breadcrumb: ['Faculty', 'Questions', 'Question Bank'],
    icon: QuestionCircleOutlined,
    role: 'faculty',
  },

  // Question Paper Routes
  '/question-paper/generator': {
    title: 'Question Paper Generator',
    breadcrumb: ['Question Paper', 'Generator'],
    icon: FormOutlined,
    role: 'faculty',
  },
  '/question-paper/history': {
    title: 'Generated Papers',
    breadcrumb: ['Question Paper', 'History'],
    icon: HistoryOutlined,
    role: 'faculty',
  },

  // Common Routes
  '/profile': {
    title: 'Profile',
    breadcrumb: ['Profile'],
    icon: UserOutlined,
  },
  '/change-password': {
    title: 'Change Password',
    breadcrumb: ['Change Password'],
    icon: LockOutlined,
  },

  // Error Routes
  '/403': {
    title: 'Access Denied',
    breadcrumb: ['Error', '403'],
    hideInMenu: true,
  },
  '/404': {
    title: 'Page Not Found',
    breadcrumb: ['Error', '404'],
    hideInMenu: true,
  },
  '/500': {
    title: 'Server Error',
    breadcrumb: ['Error', '500'],
    hideInMenu: true,
  },
};

/**
 * Get route metadata by path
 */
export const getRouteMeta = (path) => {
  // Exact match
  if (routesMeta[path]) {
    return routesMeta[path];
  }

  // Check for dynamic routes (e.g., /admin/programs/123)
  const basePath = path.split('/').slice(0, -1).join('/');
  if (routesMeta[basePath]) {
    return {
      ...routesMeta[basePath],
      breadcrumb: [...routesMeta[basePath].breadcrumb, 'Details'],
    };
  }

  return {
    title: 'Page',
    breadcrumb: ['Home'],
    icon: null,
  };
};

/**
 * Get breadcrumb items for a path
 */
export const getBreadcrumbItems = (path) => {
  const meta = getRouteMeta(path);
  return meta.breadcrumb.map((item, index) => ({
    title: item,
    key: index,
  }));
};

/**
 * Admin menu structure
 */
export const adminMenuItems = [
  {
    key: 'dashboard',
    icon: DashboardOutlined,
    label: 'Dashboard',
    path: '/admin/dashboard',
  },
  {
    key: 'program-management',
    icon: BookOutlined,
    label: 'Program Management',
    children: [
      { key: 'programs', label: 'Programs', path: '/admin/programs' },
      { key: 'branches', label: 'Branches', path: '/admin/branches' },
      { key: 'regulations', label: 'Regulations', path: '/admin/regulations' },
      { key: 'program-branch-mapping', label: 'Program-Branch Mapping', path: '/admin/program-branch-mapping' },
    ],
  },
  {
    key: 'course-management',
    icon: AppstoreOutlined,
    label: 'Course Management',
    children: [
      { key: 'courses', label: 'Course Master', path: '/admin/courses' },
      { key: 'branch-course-mapping', label: 'Branch-Course Mapping', path: '/admin/branch-course-mapping' },
    ],
  },
  {
    key: 'faculty-management',
    icon: TeamOutlined,
    label: 'Faculty Management',
    children: [
      { key: 'faculty', label: 'All Faculty', path: '/admin/faculty' },
      { key: 'faculty-course-mapping', label: 'Faculty-Course Mapping', path: '/admin/faculty-course-mapping' },
    ],
  },
];

/**
 * Faculty menu structure
 */
export const facultyMenuItems = [
  {
    key: 'dashboard',
    icon: DashboardOutlined,
    label: 'Dashboard',
    path: '/faculty/dashboard',
  },
  {
    key: 'course-setup',
    icon: BookOutlined,
    label: 'Course Setup',
    children: [
      { key: 'course-outcomes', label: 'Course Outcomes', path: '/faculty/course-outcomes' },
      { key: 'units', label: 'Units', path: '/faculty/units' },
    ],
  },
  {
    key: 'configuration',
    icon: SettingOutlined,
    label: 'Configuration',
    children: [
      { key: 'bloom-levels', label: 'Bloom Levels', path: '/faculty/bloom-levels' },
      { key: 'difficulty-levels', label: 'Difficulty Levels', path: '/faculty/difficulty-levels' },
    ],
  },
  {
    key: 'question-bank',
    icon: QuestionCircleOutlined,
    label: 'Question Bank',
    path: '/faculty/question-bank',
  },
  {
    key: 'question-paper',
    icon: FormOutlined,
    label: 'Question Paper',
    children: [
      { key: 'generator', label: 'Generator', path: '/question-paper/generator' },
      { key: 'history', label: 'History', path: '/question-paper/history' },
    ],
  },
];

export default routesMeta;
