import type { User, Task, DeveloperPerformanceMetric } from '@/types';

export const mockUsers: User[] = [
  { id: 'dev1', name: 'Alice Smith', email: 'alice.smith@example.com', role: 'Developer', avatarUrl: 'https://placehold.co/100x100/29ABE2/FFFFFF.png?text=AS' },
  { id: 'dev2', name: 'Bob Johnson', email: 'bob.johnson@example.com', role: 'Developer', avatarUrl: 'https://placehold.co/100x100/FF8C00/FFFFFF.png?text=BJ' },
  { id: 'man1', name: 'Charlie Brown', email: 'charlie.brown@example.com', role: 'Manager', avatarUrl: 'https://placehold.co/100x100/4CAF50/FFFFFF.png?text=CB' },
];

export const mockTasks: Task[] = [
  {
    id: 'task1',
    title: 'Implement Login Page UI',
    description: 'Create the UI for the login page as per Figma design.',
    priority: 'High',
    status: 'In Progress',
    assigneeId: 'dev1',
    reporterId: 'man1',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    timeLoggedMinutes: 120,
  },
  {
    id: 'task2',
    title: 'Fix Bug #102 - User Profile Crash',
    description: 'User profile page crashes when avatar is not set.',
    priority: 'High',
    status: 'Open',
    reporterId: 'dev1',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    timeLoggedMinutes: 0,
  },
  {
    id: 'task3',
    title: 'Setup Database Schema',
    description: 'Define and implement the initial database schema for tasks and users.',
    priority: 'Medium',
    status: 'Pending Approval',
    assigneeId: 'dev2',
    reporterId: 'man1',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    timeLoggedMinutes: 300,
  },
  {
    id: 'task4',
    title: 'Write API Documentation',
    description: 'Document all available API endpoints for the TaskFlow application.',
    priority: 'Low',
    status: 'Open',
    assigneeId: 'dev1',
    reporterId: 'man1',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    timeLoggedMinutes: 0,
  },
  {
    id: 'task5',
    title: 'Test Payment Gateway Integration',
    description: 'Thoroughly test the new payment gateway integration in the staging environment.',
    priority: 'High',
    status: 'Closed',
    assigneeId: 'dev2',
    reporterId: 'man1',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    timeLoggedMinutes: 480,
  },
];

export const mockDeveloperPerformanceMetrics: DeveloperPerformanceMetric[] = [
    {
        developerId: 'dev1',
        name: 'Alice Smith',
        avatarUrl: 'https://placehold.co/100x100/29ABE2/FFFFFF.png?text=AS',
        averageTaskCompletionTime: 5.5, // hours
        tasksCompleted: 15,
        successRate: 0.93, // 93%
        currentOpenTasks: 2,
    },
    {
        developerId: 'dev2',
        name: 'Bob Johnson',
        avatarUrl: 'https://placehold.co/100x100/FF8C00/FFFFFF.png?text=BJ',
        averageTaskCompletionTime: 7.0, // hours
        tasksCompleted: 12,
        successRate: 0.88, // 88%
        currentOpenTasks: 4,
    }
];
