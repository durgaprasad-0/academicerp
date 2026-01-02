/**
 * Mock Data Service
 * Provides mock data for all modules during development
 */

import { generateId } from '@/utils/helpers';

// ============================================
// PROGRAMS
// ============================================
export const programs = [
  { id: 1, name: 'Bachelor of Technology', code: 'B.Tech', duration: 4, type: 'ug', status: 'active', description: 'Undergraduate engineering program' },
  { id: 2, name: 'Master of Technology', code: 'M.Tech', duration: 2, type: 'pg', status: 'active', description: 'Postgraduate engineering program' },
  { id: 3, name: 'Bachelor of Science', code: 'B.Sc', duration: 3, type: 'ug', status: 'active', description: 'Undergraduate science program' },
  { id: 4, name: 'Master of Computer Applications', code: 'MCA', duration: 2, type: 'pg', status: 'active', description: 'Postgraduate computer applications' },
  { id: 5, name: 'Diploma in Engineering', code: 'Diploma', duration: 3, type: 'diploma', status: 'active', description: 'Diploma engineering program' },
];

// ============================================
// BRANCHES
// ============================================
export const branches = [
  { id: 1, name: 'Computer Science and Engineering', code: 'CSE', programId: 1, status: 'active' },
  { id: 2, name: 'Electronics and Communication Engineering', code: 'ECE', programId: 1, status: 'active' },
  { id: 3, name: 'Mechanical Engineering', code: 'ME', programId: 1, status: 'active' },
  { id: 4, name: 'Electrical Engineering', code: 'EE', programId: 1, status: 'active' },
  { id: 5, name: 'Civil Engineering', code: 'CE', programId: 1, status: 'active' },
  { id: 6, name: 'Information Technology', code: 'IT', programId: 1, status: 'active' },
  { id: 7, name: 'Artificial Intelligence', code: 'AI', programId: 2, status: 'active' },
  { id: 8, name: 'Data Science', code: 'DS', programId: 2, status: 'active' },
];

// ============================================
// REGULATIONS
// ============================================
export const regulations = [
  { id: 1, name: 'R20', year: 2020, status: 'active', description: 'Regulation 2020 - Current' },
  { id: 2, name: 'R19', year: 2019, status: 'active', description: 'Regulation 2019' },
  { id: 3, name: 'R18', year: 2018, status: 'inactive', description: 'Regulation 2018 - Phased out' },
  { id: 4, name: 'R17', year: 2017, status: 'inactive', description: 'Regulation 2017 - Phased out' },
];

// ============================================
// COURSES
// ============================================
export const courses = [
  { id: 1, name: 'Data Structures', code: 'CS201', credits: 4, type: 'theory', status: 'active' },
  { id: 2, name: 'Database Management Systems', code: 'CS301', credits: 4, type: 'theory_practical', status: 'active' },
  { id: 3, name: 'Operating Systems', code: 'CS302', credits: 3, type: 'theory', status: 'active' },
  { id: 4, name: 'Computer Networks', code: 'CS401', credits: 4, type: 'theory', status: 'active' },
  { id: 5, name: 'Machine Learning', code: 'CS501', credits: 4, type: 'theory_practical', status: 'active' },
  { id: 6, name: 'Web Technologies', code: 'CS303', credits: 3, type: 'theory_practical', status: 'active' },
  { id: 7, name: 'Software Engineering', code: 'CS402', credits: 3, type: 'theory', status: 'active' },
  { id: 8, name: 'Artificial Intelligence', code: 'CS502', credits: 4, type: 'theory', status: 'active' },
  { id: 9, name: 'Cloud Computing', code: 'CS601', credits: 3, type: 'theory_practical', status: 'active' },
  { id: 10, name: 'Cyber Security', code: 'CS602', credits: 3, type: 'theory', status: 'active' },
];

// ============================================
// FACULTY
// ============================================
export const faculty = [
  { id: 1, name: 'Dr. Rajesh Kumar', email: 'rajesh.kumar@academicerp.com', phone: '9876543210', department: 'Computer Science', designation: 'professor', status: 'active', joinDate: '2015-06-15' },
  { id: 2, name: 'Prof. Anjali Sharma', email: 'anjali.sharma@academicerp.com', phone: '9876543211', department: 'Computer Science', designation: 'associate_professor', status: 'active', joinDate: '2017-08-01' },
  { id: 3, name: 'Dr. Vikram Singh', email: 'vikram.singh@academicerp.com', phone: '9876543212', department: 'Electronics', designation: 'professor', status: 'active', joinDate: '2014-03-20' },
  { id: 4, name: 'Ms. Priya Patel', email: 'priya.patel@academicerp.com', phone: '9876543213', department: 'Computer Science', designation: 'assistant_professor', status: 'active', joinDate: '2019-07-10' },
  { id: 5, name: 'Mr. Arjun Reddy', email: 'arjun.reddy@academicerp.com', phone: '9876543214', department: 'Information Technology', designation: 'assistant_professor', status: 'active', joinDate: '2020-01-15' },
  { id: 6, name: 'Dr. Sunita Rao', email: 'sunita.rao@academicerp.com', phone: '9876543215', department: 'Computer Science', designation: 'associate_professor', status: 'inactive', joinDate: '2016-09-01' },
];

// ============================================
// COURSE OUTCOMES
// ============================================
export const courseOutcomes = [
  { id: 1, courseId: 1, code: 'CO1', description: 'Apply fundamental data structure concepts', bloomLevel: 3 },
  { id: 2, courseId: 1, code: 'CO2', description: 'Analyze time and space complexity of algorithms', bloomLevel: 4 },
  { id: 3, courseId: 1, code: 'CO3', description: 'Implement various data structures using programming', bloomLevel: 3 },
  { id: 4, courseId: 1, code: 'CO4', description: 'Select appropriate data structures for given problems', bloomLevel: 5 },
  { id: 5, courseId: 2, code: 'CO1', description: 'Design ER diagrams for database systems', bloomLevel: 6 },
  { id: 6, courseId: 2, code: 'CO2', description: 'Apply normalization techniques', bloomLevel: 3 },
  { id: 7, courseId: 2, code: 'CO3', description: 'Write complex SQL queries', bloomLevel: 3 },
  { id: 8, courseId: 2, code: 'CO4', description: 'Evaluate database transaction processing', bloomLevel: 5 },
];

// ============================================
// UNITS
// ============================================
export const units = [
  { id: 1, courseId: 1, name: 'Introduction to Data Structures', unitNumber: 1, hours: 8, status: 'active' },
  { id: 2, courseId: 1, name: 'Arrays and Linked Lists', unitNumber: 2, hours: 10, status: 'active' },
  { id: 3, courseId: 1, name: 'Stacks and Queues', unitNumber: 3, hours: 8, status: 'active' },
  { id: 4, courseId: 1, name: 'Trees and Graphs', unitNumber: 4, hours: 12, status: 'active' },
  { id: 5, courseId: 1, name: 'Sorting and Searching', unitNumber: 5, hours: 10, status: 'active' },
  { id: 6, courseId: 2, name: 'Introduction to DBMS', unitNumber: 1, hours: 8, status: 'active' },
  { id: 7, courseId: 2, name: 'ER Model and Relational Model', unitNumber: 2, hours: 10, status: 'active' },
  { id: 8, courseId: 2, name: 'SQL and Query Processing', unitNumber: 3, hours: 12, status: 'active' },
  { id: 9, courseId: 2, name: 'Normalization', unitNumber: 4, hours: 8, status: 'active' },
  { id: 10, courseId: 2, name: 'Transaction Management', unitNumber: 5, hours: 10, status: 'active' },
];

// ============================================
// BLOOM LEVELS (Custom)
// ============================================
export const bloomLevels = [
  { id: 1, level: 1, name: 'Remember', description: 'Recall facts and basic concepts', keywords: 'define, list, recall, identify', color: '#FF6B6B' },
  { id: 2, level: 2, name: 'Understand', description: 'Explain ideas or concepts', keywords: 'describe, explain, summarize, interpret', color: '#4ECDC4' },
  { id: 3, level: 3, name: 'Apply', description: 'Use information in new situations', keywords: 'apply, demonstrate, implement, solve', color: '#45B7D1' },
  { id: 4, level: 4, name: 'Analyze', description: 'Draw connections among ideas', keywords: 'analyze, compare, contrast, examine', color: '#96CEB4' },
  { id: 5, level: 5, name: 'Evaluate', description: 'Justify a decision or course of action', keywords: 'evaluate, justify, critique, assess', color: '#FFEAA7' },
  { id: 6, level: 6, name: 'Create', description: 'Produce new or original work', keywords: 'create, design, develop, construct', color: '#DDA0DD' },
];

// ============================================
// DIFFICULTY LEVELS
// ============================================
export const difficultyLevels = [
  { id: 1, name: 'Easy', value: 'easy', weight: 1, color: '#00B894', description: 'Basic understanding questions' },
  { id: 2, name: 'Medium', value: 'medium', weight: 2, color: '#FDCB6E', description: 'Application level questions' },
  { id: 3, name: 'Hard', value: 'hard', weight: 3, color: '#E17055', description: 'Advanced analytical questions' },
];

// ============================================
// QUESTIONS
// ============================================
export const questions = [
  { id: 1, courseId: 1, unitId: 1, coId: 1, bloomLevel: 1, difficulty: 'easy', marks: 2, type: 'short', question: 'Define data structure and list its types.', answer: 'A data structure is a way of organizing and storing data...', status: 'active', createdAt: '2024-01-15' },
  { id: 2, courseId: 1, unitId: 1, coId: 2, bloomLevel: 2, difficulty: 'easy', marks: 2, type: 'short', question: 'Explain the difference between linear and non-linear data structures.', answer: 'Linear data structures store elements in a sequential manner...', status: 'active', createdAt: '2024-01-15' },
  { id: 3, courseId: 1, unitId: 2, coId: 3, bloomLevel: 3, difficulty: 'medium', marks: 5, type: 'long', question: 'Implement a function to reverse a linked list.', answer: 'Algorithm to reverse linked list...', status: 'active', createdAt: '2024-01-16' },
  { id: 4, courseId: 1, unitId: 2, coId: 3, bloomLevel: 3, difficulty: 'medium', marks: 5, type: 'long', question: 'Write a program to detect a cycle in a linked list.', answer: 'Floyd cycle detection algorithm...', status: 'active', createdAt: '2024-01-16' },
  { id: 5, courseId: 1, unitId: 3, coId: 4, bloomLevel: 4, difficulty: 'medium', marks: 5, type: 'long', question: 'Analyze the applications of stack in expression evaluation.', answer: 'Stack is used for infix to postfix conversion...', status: 'active', createdAt: '2024-01-17' },
  { id: 6, courseId: 1, unitId: 4, coId: 4, bloomLevel: 4, difficulty: 'hard', marks: 10, type: 'descriptive', question: 'Explain BFS and DFS traversal techniques with examples.', answer: 'Breadth First Search and Depth First Search...', status: 'active', createdAt: '2024-01-18' },
  { id: 7, courseId: 1, unitId: 5, coId: 2, bloomLevel: 4, difficulty: 'hard', marks: 10, type: 'descriptive', question: 'Compare and analyze various sorting algorithms based on time complexity.', answer: 'Bubble Sort O(n²), Quick Sort O(n log n)...', status: 'active', createdAt: '2024-01-19' },
  { id: 8, courseId: 2, unitId: 6, coId: 5, bloomLevel: 2, difficulty: 'easy', marks: 2, type: 'short', question: 'What is DBMS? Explain its advantages.', answer: 'Database Management System is software...', status: 'active', createdAt: '2024-01-20' },
  { id: 9, courseId: 2, unitId: 7, coId: 5, bloomLevel: 6, difficulty: 'medium', marks: 7, type: 'long', question: 'Design an ER diagram for a library management system.', answer: 'Entities: Book, Member, Loan...', status: 'active', createdAt: '2024-01-21' },
  { id: 10, courseId: 2, unitId: 8, coId: 7, bloomLevel: 3, difficulty: 'medium', marks: 5, type: 'long', question: 'Write SQL queries to perform join operations.', answer: 'SELECT * FROM orders INNER JOIN customers...', status: 'active', createdAt: '2024-01-22' },
];

// ============================================
// GENERATED PAPERS
// ============================================
export const generatedPapers = [
  { id: 1, courseId: 1, courseName: 'Data Structures', examType: 'Mid Exam', totalMarks: 30, duration: 90, generatedBy: 'Prof. Anjali Sharma', generatedAt: '2024-01-25', status: 'final' },
  { id: 2, courseId: 1, courseName: 'Data Structures', examType: 'End Exam', totalMarks: 70, duration: 180, generatedBy: 'Prof. Anjali Sharma', generatedAt: '2024-02-10', status: 'draft' },
  { id: 3, courseId: 2, courseName: 'Database Management Systems', examType: 'Mid Exam', totalMarks: 30, duration: 90, generatedBy: 'Dr. Rajesh Kumar', generatedAt: '2024-02-15', status: 'final' },
];

// ============================================
// MAPPINGS
// ============================================
export const programBranchMappings = [
  { id: 1, programId: 1, branchId: 1 },
  { id: 2, programId: 1, branchId: 2 },
  { id: 3, programId: 1, branchId: 3 },
  { id: 4, programId: 1, branchId: 4 },
  { id: 5, programId: 1, branchId: 5 },
  { id: 6, programId: 1, branchId: 6 },
  { id: 7, programId: 2, branchId: 7 },
  { id: 8, programId: 2, branchId: 8 },
];

export const branchCourseMappings = [
  { id: 1, branchId: 1, courseId: 1, semester: 3, regulationId: 1 },
  { id: 2, branchId: 1, courseId: 2, semester: 4, regulationId: 1 },
  { id: 3, branchId: 1, courseId: 3, semester: 4, regulationId: 1 },
  { id: 4, branchId: 1, courseId: 4, semester: 5, regulationId: 1 },
  { id: 5, branchId: 1, courseId: 5, semester: 6, regulationId: 1 },
  { id: 6, branchId: 6, courseId: 6, semester: 4, regulationId: 1 },
];

export const facultyCourseMappings = [
  { id: 1, facultyId: 2, courseId: 1, branchId: 1, semester: 3, academicYear: '2024-2025' },
  { id: 2, facultyId: 2, courseId: 2, branchId: 1, semester: 4, academicYear: '2024-2025' },
  { id: 3, facultyId: 1, courseId: 5, branchId: 1, semester: 6, academicYear: '2024-2025' },
  { id: 4, facultyId: 4, courseId: 6, branchId: 6, semester: 4, academicYear: '2024-2025' },
];

// ============================================
// DASHBOARD STATS
// ============================================
export const adminDashboardStats = {
  totalPrograms: programs.length,
  totalBranches: branches.length,
  totalCourses: courses.length,
  totalFaculty: faculty.filter(f => f.status === 'active').length,
  recentActivities: [
    { id: 1, action: 'New faculty added', user: 'Admin', timestamp: '2024-01-25T10:30:00' },
    { id: 2, action: 'Course updated', user: 'Admin', timestamp: '2024-01-25T09:15:00' },
    { id: 3, action: 'New regulation created', user: 'Admin', timestamp: '2024-01-24T16:45:00' },
    { id: 4, action: 'Branch mapping updated', user: 'Admin', timestamp: '2024-01-24T14:20:00' },
  ],
};

export const facultyDashboardStats = {
  assignedCourses: 2,
  totalQuestions: questions.length,
  papersGenerated: generatedPapers.length,
  pendingTasks: 3,
  courses: [
    { id: 1, name: 'Data Structures', code: 'CS201', questions: 7, outcomes: 4 },
    { id: 2, name: 'Database Management Systems', code: 'CS301', questions: 3, outcomes: 4 },
  ],
};

// ============================================
// CRUD HELPER
// ============================================
export const createMockCrud = (initialData) => {
  let data = [...initialData];

  return {
    getAll: () => Promise.resolve({ success: true, data }),
    
    getById: (id) => {
      const item = data.find(d => d.id === id);
      return Promise.resolve({ success: true, data: item });
    },
    
    create: (newItem) => {
      const item = { ...newItem, id: data.length + 1 };
      data.push(item);
      return Promise.resolve({ success: true, data: item, message: 'Created successfully' });
    },
    
    update: (id, updates) => {
      const index = data.findIndex(d => d.id === id);
      if (index !== -1) {
        data[index] = { ...data[index], ...updates };
        return Promise.resolve({ success: true, data: data[index], message: 'Updated successfully' });
      }
      return Promise.reject({ message: 'Item not found' });
    },
    
    delete: (id) => {
      const index = data.findIndex(d => d.id === id);
      if (index !== -1) {
        data.splice(index, 1);
        return Promise.resolve({ success: true, message: 'Deleted successfully' });
      }
      return Promise.reject({ message: 'Item not found' });
    },
  };
};

export default {
  programs,
  branches,
  regulations,
  courses,
  faculty,
  courseOutcomes,
  units,
  bloomLevels,
  difficultyLevels,
  questions,
  generatedPapers,
  programBranchMappings,
  branchCourseMappings,
  facultyCourseMappings,
  adminDashboardStats,
  facultyDashboardStats,
};
