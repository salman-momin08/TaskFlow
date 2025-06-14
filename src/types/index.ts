
export type UserRole = 'Developer' | 'Manager';

export interface User {
  id: string;
  name: string;
  email: string; 
  role: UserRole;
  avatarUrl?: string;
}

export type Priority = 'Low' | 'Medium' | 'High';
export const priorities: Priority[] = ['Low', 'Medium', 'High'];

export type Status = 'Open' | 'In Progress' | 'Pending Approval' | 'Closed' | 'Reopened';
export const statuses: Status[] = ['Open', 'In Progress', 'Pending Approval', 'Closed', 'Reopened'];

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  assigneeId?: string;
  reporterId: string; 
  createdAt: string; 
  updatedAt: string; 
  timeLoggedMinutes: number;
}

export interface TimeLog {
  id: string;
  taskId: string;
  developerId: string;
  loggedAt: string; 
  durationMinutes: number;
  notes?: string;
}

export interface DeveloperPerformanceMetric {
  developerId: string;
  name: string;
  avatarUrl?: string;
  averageTaskCompletionTime: number; // hours
  tasksCompleted: number;
  successRate: number; // 0-1, (tasks successfully closed / tasks assigned)
  currentOpenTasks: number;
};

// For AI task assignment
export type AISuggestion = {
  suggestedAssigneeId: string;
  reasoning: string;
}
