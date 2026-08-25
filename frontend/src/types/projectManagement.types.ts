/**
 * Project Management Domain Types
 * Defines interfaces and types for administration of AI & Data programme projects.
 */

export type ProjectCategory =
  | 'AI'
  | 'Data Science'
  | 'Data Analytics'
  | 'Software Development'
  | 'Research'
  | (string & {});

export type ProjectStatus =
  | 'Planned'
  | 'Active'
  | 'On Hold'
  | 'Completed'
  | (string & {});

export type ProjectPriority =
  | 'Low'
  | 'Medium'
  | 'High'
  | 'Critical'
  | (string & {});

export interface ManagedProject {
  id: string;
  name: string;
  projectId: string;
  category: ProjectCategory;
  description: string;
  technologyStack?: string;
  department: string;
  projectLead?: string;
  assignedMembersCount?: number;
  startDate: string;
  targetDate: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  progress?: number;
  milestoneInfo?: string;
  createdAt?: string;
  updatedAt?: string;
}
