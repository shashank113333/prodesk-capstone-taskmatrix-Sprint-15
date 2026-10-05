import { create } from 'zustand';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'in_review' | 'done';
  priority: 'Low' | 'Medium' | 'High';
  userEmail: string;
  createdAt: string;
  dueDate: string;
}

interface TaskState {
  tasks: Task[];
  searchQuery: string;
  priorityFilter: string;
  
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updatedFields: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  hydrateTasks: (userEmail: string) => void;
  setSearchQuery: (query: string) => void;
  setPriorityFilter: (priority: string) => void;
}

const initialDefaultTasks: Task[] = [
  {
    id: 'tsk_101',
    title: 'Implement Next.js App Router Auth Guards',
    description: 'Protect /dashboard viewport using Zustand state serialization and client-side guards.',
    status: 'done',
    priority: 'High',
    userEmail: 'developer@prodesk.io',
    createdAt: '2026-09-28',
    dueDate: '2026-10-05',
  },
  {
    id: 'tsk_102',
    title: 'Architect Full BaaS CRUD Operations',
    description: 'Build Create, Read, Update, Delete state handlers with localStorage persistence.',
    status: 'in_progress',
    priority: 'High',
    userEmail: 'developer@prodesk.io',
    createdAt: '2026-10-01',
    dueDate: '2026-10-06',
  },
  {
    id: 'tsk_103',
    title: 'Integrate Recharts Analytics Component',
    description: 'Aggregate task metrics using .reduce() and render dynamic task distribution charts.',
    status: 'in_review',
    priority: 'Medium',
    userEmail: 'developer@prodesk.io',
    createdAt: '2026-10-02',
    dueDate: '2026-10-07',
  },
  {
    id: 'tsk_104',
    title: 'Setup Mobile Responsive Layout & Touch Targets',
    description: 'Ensure touch targets exceed 48px and layout adapts cleanly down to 320px screens.',
    status: 'todo',
    priority: 'Low',
    userEmail: 'developer@prodesk.io',
    createdAt: '2026-10-02',
    dueDate: '2026-10-08',
  },
];

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  searchQuery: '',
  priorityFilter: 'ALL',

  hydrateTasks: (userEmail: string) => {
    if (typeof window === 'undefined') return;

    const savedTasks = localStorage.getItem('taskmatrix_tasks');
    if (savedTasks) {
      try {
        const parsed = JSON.parse(savedTasks);
        set({ tasks: parsed });
      } catch (err) {
        console.error('Failed to parse tasks', err);
        set({ tasks: initialDefaultTasks });
      }
    } else {
      const seeded = initialDefaultTasks.map((t) => ({
        ...t,
        userEmail: userEmail || t.userEmail,
      }));
      localStorage.setItem('taskmatrix_tasks', JSON.stringify(seeded));
      set({ tasks: seeded });
    }
  },

  addTask: (newTaskData) => {
    const newTask: Task = {
      ...newTaskData,
      id: `tsk_${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };

    const updated = [newTask, ...get().tasks];
    if (typeof window !== 'undefined') {
      localStorage.setItem('taskmatrix_tasks', JSON.stringify(updated));
    }
    set({ tasks: updated });
  },

  updateTask: (id, updatedFields) => {
    const updated = get().tasks.map((task) =>
      task.id === id ? { ...task, ...updatedFields } : task
    );
    if (typeof window !== 'undefined') {
      localStorage.setItem('taskmatrix_tasks', JSON.stringify(updated));
    }
    set({ tasks: updated });
  },

  deleteTask: (id) => {
    const updated = get().tasks.filter((task) => task.id !== id);
    if (typeof window !== 'undefined') {
      localStorage.setItem('taskmatrix_tasks', JSON.stringify(updated));
    }
    set({ tasks: updated });
  },

  setSearchQuery: (query) => set({ searchQuery: query }),
  setPriorityFilter: (priority) => set({ priorityFilter: priority }),
}));