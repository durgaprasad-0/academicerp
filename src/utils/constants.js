/**
 * Application Constants
 * Centralized configuration for dropdowns, options, and static data
 */

// Bloom's Taxonomy Levels
export const BLOOM_LEVELS = [
  { value: 1, label: 'Remember', shortLabel: 'L1', color: '#FF6B6B', description: 'Recall facts and basic concepts' },
  { value: 2, label: 'Understand', shortLabel: 'L2', color: '#4ECDC4', description: 'Explain ideas or concepts' },
  { value: 3, label: 'Apply', shortLabel: 'L3', color: '#45B7D1', description: 'Use information in new situations' },
  { value: 4, label: 'Analyze', shortLabel: 'L4', color: '#96CEB4', description: 'Draw connections among ideas' },
  { value: 5, label: 'Evaluate', shortLabel: 'L5', color: '#FFEAA7', description: 'Justify a decision or course of action' },
  { value: 6, label: 'Create', shortLabel: 'L6', color: '#DDA0DD', description: 'Produce new or original work' },
];

// Difficulty Levels
export const DIFFICULTY_LEVELS = [
  { value: 'easy', label: 'Easy', color: '#00B894', weight: 1 },
  { value: 'medium', label: 'Medium', color: '#FDCB6E', weight: 2 },
  { value: 'hard', label: 'Hard', color: '#E17055', weight: 3 },
];

// Question Types
export const QUESTION_TYPES = [
  { value: 'mcq', label: 'Multiple Choice', shortLabel: 'MCQ' },
  { value: 'short', label: 'Short Answer', shortLabel: 'SA' },
  { value: 'long', label: 'Long Answer', shortLabel: 'LA' },
  { value: 'descriptive', label: 'Descriptive', shortLabel: 'DESC' },
  { value: 'numerical', label: 'Numerical', shortLabel: 'NUM' },
  { value: 'true_false', label: 'True/False', shortLabel: 'T/F' },
  { value: 'fill_blank', label: 'Fill in the Blank', shortLabel: 'FIB' },
];

// Mark Options for Questions
export const MARK_OPTIONS = [
  { value: 1, label: '1 Mark' },
  { value: 2, label: '2 Marks' },
  { value: 3, label: '3 Marks' },
  { value: 4, label: '4 Marks' },
  { value: 5, label: '5 Marks' },
  { value: 7, label: '7 Marks' },
  { value: 10, label: '10 Marks' },
  { value: 12, label: '12 Marks' },
  { value: 15, label: '15 Marks' },
];

// Semester Options
export const SEMESTERS = [
  { value: 1, label: 'Semester 1' },
  { value: 2, label: 'Semester 2' },
  { value: 3, label: 'Semester 3' },
  { value: 4, label: 'Semester 4' },
  { value: 5, label: 'Semester 5' },
  { value: 6, label: 'Semester 6' },
  { value: 7, label: 'Semester 7' },
  { value: 8, label: 'Semester 8' },
];

// Academic Years
export const generateAcademicYears = (startYear = 2020, count = 10) => {
  const years = [];
  const currentYear = new Date().getFullYear();
  for (let i = 0; i < count; i++) {
    const year = startYear + i;
    if (year <= currentYear + 1) {
      years.push({
        value: `${year}-${year + 1}`,
        label: `${year}-${year + 1}`,
      });
    }
  }
  return years.reverse();
};

export const ACADEMIC_YEARS = generateAcademicYears();

// Program Types
export const PROGRAM_TYPES = [
  { value: 'ug', label: 'Undergraduate (UG)' },
  { value: 'pg', label: 'Postgraduate (PG)' },
  { value: 'diploma', label: 'Diploma' },
  { value: 'phd', label: 'Ph.D.' },
];

// Course Types
export const COURSE_TYPES = [
  { value: 'theory', label: 'Theory' },
  { value: 'practical', label: 'Practical' },
  { value: 'theory_practical', label: 'Theory + Practical' },
  { value: 'project', label: 'Project' },
  { value: 'seminar', label: 'Seminar' },
  { value: 'internship', label: 'Internship' },
];

// Faculty Designations
export const DESIGNATIONS = [
  { value: 'professor', label: 'Professor' },
  { value: 'associate_professor', label: 'Associate Professor' },
  { value: 'assistant_professor', label: 'Assistant Professor' },
  { value: 'senior_lecturer', label: 'Senior Lecturer' },
  { value: 'lecturer', label: 'Lecturer' },
  { value: 'guest_faculty', label: 'Guest Faculty' },
];

// Status Options
export const STATUS_OPTIONS = [
  { value: 'active', label: 'Active', color: '#00B894' },
  { value: 'inactive', label: 'Inactive', color: '#E17055' },
  { value: 'pending', label: 'Pending', color: '#FDCB6E' },
];

// Pagination Options
export const PAGINATION_OPTIONS = ['10', '20', '50', '100'];
export const DEFAULT_PAGE_SIZE = 10;

// Date Formats
export const DATE_FORMAT = 'DD-MM-YYYY';
export const DATE_TIME_FORMAT = 'DD-MM-YYYY HH:mm';
export const API_DATE_FORMAT = 'YYYY-MM-DD';

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  FACULTY: 'faculty',
  HOD: 'hod',
  STUDENT: 'student',
};

// Route Permissions
export const ROLE_PERMISSIONS = {
  admin: [
    '/admin',
    '/admin/dashboard',
    '/admin/programs',
    '/admin/branches',
    '/admin/regulations',
    '/admin/program-branch-mapping',
    '/admin/courses',
    '/admin/branch-course-mapping',
    '/admin/faculty',
    '/admin/faculty-course-mapping',
    '/profile',
    '/change-password',
  ],
  faculty: [
    '/faculty',
    '/faculty/dashboard',
    '/faculty/course-outcomes',
    '/faculty/bloom-levels',
    '/faculty/difficulty-levels',
    '/faculty/units',
    '/faculty/question-bank',
    '/question-paper/generator',
    '/question-paper/history',
    '/profile',
    '/change-password',
  ],
};

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
    CHANGE_PASSWORD: '/auth/change-password',
  },
  ADMIN: {
    PROGRAMS: '/admin/programs',
    BRANCHES: '/admin/branches',
    REGULATIONS: '/admin/regulations',
    COURSES: '/admin/courses',
    FACULTY: '/admin/faculty',
    MAPPINGS: {
      PROGRAM_BRANCH: '/admin/program-branch-mapping',
      BRANCH_COURSE: '/admin/branch-course-mapping',
      FACULTY_COURSE: '/admin/faculty-course-mapping',
    },
  },
  FACULTY: {
    COURSE_OUTCOMES: '/faculty/course-outcomes',
    BLOOM_LEVELS: '/faculty/bloom-levels',
    DIFFICULTY_LEVELS: '/faculty/difficulty-levels',
    UNITS: '/faculty/units',
    QUESTIONS: '/faculty/questions',
    BULK_UPLOAD: '/faculty/questions/bulk-upload',
  },
  QUESTION_PAPER: {
    GENERATE: '/question-paper/generate',
    HISTORY: '/question-paper/history',
    DOWNLOAD: '/question-paper/download',
  },
};

// Notification Messages
export const MESSAGES = {
  SUCCESS: {
    CREATE: 'Record created successfully',
    UPDATE: 'Record updated successfully',
    DELETE: 'Record deleted successfully',
    SAVE: 'Changes saved successfully',
    UPLOAD: 'File uploaded successfully',
  },
  ERROR: {
    CREATE: 'Failed to create record',
    UPDATE: 'Failed to update record',
    DELETE: 'Failed to delete record',
    FETCH: 'Failed to fetch data',
    UPLOAD: 'Failed to upload file',
    NETWORK: 'Network error. Please check your connection.',
    UNAUTHORIZED: 'Session expired. Please login again.',
    FORBIDDEN: 'You do not have permission to perform this action.',
    SERVER: 'Server error. Please try again later.',
  },
  CONFIRM: {
    DELETE: 'Are you sure you want to delete this record? This action cannot be undone.',
    LOGOUT: 'Are you sure you want to logout?',
    UNSAVED: 'You have unsaved changes. Are you sure you want to leave?',
  },
};

// Empty State Messages
export const EMPTY_STATES = {
  programs: { title: 'No Programs Found', description: 'Start by adding your first academic program.' },
  branches: { title: 'No Branches Found', description: 'Add branches to organize your departments.' },
  courses: { title: 'No Courses Found', description: 'Create courses for your curriculum.' },
  faculty: { title: 'No Faculty Found', description: 'Add faculty members to get started.' },
  questions: { title: 'No Questions Found', description: 'Build your question bank by adding questions.' },
  papers: { title: 'No Papers Generated', description: 'Use the generator to create question papers.' },
};

export default {
  BLOOM_LEVELS,
  DIFFICULTY_LEVELS,
  QUESTION_TYPES,
  MARK_OPTIONS,
  SEMESTERS,
  ACADEMIC_YEARS,
  PROGRAM_TYPES,
  COURSE_TYPES,
  DESIGNATIONS,
  STATUS_OPTIONS,
  PAGINATION_OPTIONS,
  DEFAULT_PAGE_SIZE,
  USER_ROLES,
  API_ENDPOINTS,
  MESSAGES,
  EMPTY_STATES,
};
