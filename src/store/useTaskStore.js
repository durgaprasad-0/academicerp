/**
 * Tasks Store
 * Manage task assignments between admin and faculty
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Initial mock tasks
const initialTasks = [
  {
    id: 1,
    title: 'Add questions for Unit 3 - Stacks and Queues',
    description: 'Please add at least 10 questions covering stack operations and queue implementations',
    courseId: 1,
    courseName: 'Data Structures',
    assignedTo: 2, // Faculty ID
    assignedBy: 'Admin',
    priority: 'high',
    status: 'pending',
    dueDate: '2024-02-15',
    createdAt: '2024-01-25',
  },
  {
    id: 2,
    title: 'Review Course Outcomes mapping',
    description: 'Verify that all COs are properly mapped to Bloom levels',
    courseId: 2,
    courseName: 'Database Management Systems',
    assignedTo: 2,
    assignedBy: 'Admin',
    priority: 'medium',
    status: 'pending',
    dueDate: '2024-02-20',
    createdAt: '2024-01-26',
  },
  {
    id: 3,
    title: 'Generate Mid Semester Question Paper',
    description: 'Generate and review the mid semester exam paper for CS201',
    courseId: 1,
    courseName: 'Data Structures',
    assignedTo: 2,
    assignedBy: 'Admin',
    priority: 'high',
    status: 'in_progress',
    dueDate: '2024-02-10',
    createdAt: '2024-01-20',
  },
];

const useTaskStore = create(
  persist(
    (set, get) => ({
      tasks: initialTasks,

      // Get tasks for a specific faculty (or all if admin)
      getTasksByFaculty: (facultyId) => {
        return get().tasks.filter(t => t.assignedTo === facultyId);
      },

      // Get all tasks
      getAllTasks: () => get().tasks,

      // Get pending tasks count
      getPendingCount: (facultyId) => {
        return get().tasks.filter(t => 
          t.assignedTo === facultyId && 
          (t.status === 'pending' || t.status === 'in_progress')
        ).length;
      },

      // Add new task
      addTask: (task) => {
        const newTask = {
          ...task,
          id: Date.now(),
          status: 'pending',
          createdAt: new Date().toISOString().split('T')[0],
        };
        set((state) => ({
          tasks: [...state.tasks, newTask],
        }));
        return newTask;
      },

      // Update task
      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        }));
      },

      // Update task status
      updateTaskStatus: (id, status) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, status } : t
          ),
        }));
      },

      // Delete task
      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        }));
      },

      // Complete task
      completeTask: (id) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, status: 'completed', completedAt: new Date().toISOString() } : t
          ),
        }));
      },
    }),
    {
      name: 'academic-erp-tasks',
    }
  )
);

export default useTaskStore;
