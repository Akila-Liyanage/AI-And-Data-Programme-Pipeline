/**
 * API Data Service for Workspace Data Integration
 * Connects frontend views seamlessly to live MongoDB endpoints
 */

import { API_BASE_URL } from '../config/api';

const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export interface ApiWorkItem {
  workItemId: string;
  title: string;
  role: string;
  percentage: number;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
}

export interface ApiProject {
  _id?: string;
  projectId: string;
  name: string;
  category: string;
  description?: string;
  technologyStack?: string;
  department: string;
  projectLead?: string;
  assignedMembersCount?: number;
  startDate: string;
  targetDate: string;
  status: 'Not Started' | 'Ongoing' | 'On Hold' | 'Completed' | 'Cancelled' | 'Planned' | 'Active' | string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical' | string;
  progress: number;
  workItems: ApiWorkItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiAssignment {
  _id?: string;
  assignmentId: string;
  projectId: string;
  projectName: string;
  userId: string;
  userName: string;
  userCategory: string;
  professionalRole: string;
  assignmentRole: string;
  startDate: string;
  expectedEndDate?: string;
  status: string;
  allocationNotes?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Fetch all assignments, optionally filtered by userId
 */
export async function fetchAssignments(userId?: string): Promise<ApiAssignment[]> {
  try {
    const url = userId
      ? `${API_BASE_URL}/assignments?userId=${encodeURIComponent(userId)}`
      : `${API_BASE_URL}/assignments`;
    const res = await fetch(url, { headers: getAuthHeaders() });
    if (!res.ok) {
      throw new Error(`Failed to fetch assignments: ${res.statusText}`);
    }
    const data = await res.json();
    return data.assignments || [];
  } catch (err) {
    console.error('Error fetching assignments:', err);
    return [];
  }
}

/**
 * Fetch all projects
 */
export async function fetchProjects(): Promise<ApiProject[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/projects`, { headers: getAuthHeaders() });
    if (!res.ok) {
      throw new Error(`Failed to fetch projects: ${res.statusText}`);
    }
    const data = await res.json();
    return data.projects || [];
  } catch (err) {
    console.error('Error fetching projects:', err);
    return [];
  }
}


/**
 * Fetch single project by ID
 */
export async function fetchProjectById(id: string): Promise<ApiProject | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/projects/${encodeURIComponent(id)}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.project || null;
  } catch (err) {
    console.error(`Error fetching project ${id}:`, err);
    return null;
  }
}

/**
 * Update work item status in MongoDB
 */
export async function updateWorkItemStatus(
  projectId: string,
  workItemId: string,
  status: 'TODO' | 'IN_PROGRESS' | 'DONE' | string
): Promise<{ success: boolean; message?: string; project?: ApiProject; progress?: number }> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/projects/${encodeURIComponent(projectId)}/work-items/${encodeURIComponent(workItemId)}/status`,
      {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
      }
    );
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to update work item status');
    }
    return data;
  } catch (err: unknown) {
    console.error('Error updating work item status:', err);
    const msg = err instanceof Error ? err.message : 'Failed to update status';
    return { success: false, message: msg };
  }
}

/**
 * Self-enroll an authenticated user (Intern/Staff) into a project with role-matching
 */
export async function selfEnrollProject(
  projectId: string
): Promise<{ success: boolean; message?: string; assignment?: ApiAssignment; roleMatched?: boolean }> {
  try {
    const res = await fetch(`${API_BASE_URL}/assignments/self-enroll`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ projectId }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to enroll in project');
    }
    return data;
  } catch (err: unknown) {
    console.error('Error self-enrolling in project:', err);
    const msg = err instanceof Error ? err.message : 'Enrollment failed';
    return { success: false, message: msg };
  }
}

/**
 * Map API work item status to UI status
 */
export function mapWorkItemStatusToDisplay(apiStatus: string): 'Not Started' | 'In Progress' | 'Completed' {
  const s = String(apiStatus).trim().toUpperCase();
  if (s === 'DONE' || s === 'COMPLETED') return 'Completed';
  if (s === 'IN_PROGRESS' || s === 'IN PROGRESS') return 'In Progress';
  return 'Not Started';
}

/**
 * Map UI work item status to API status
 */
export function mapDisplayStatusToApi(displayStatus: string): 'TODO' | 'IN_PROGRESS' | 'DONE' {
  const s = String(displayStatus).trim().toLowerCase();
  if (s === 'completed' || s === 'done') return 'DONE';
  if (s === 'in progress' || s === 'in_progress') return 'IN_PROGRESS';
  return 'TODO';
}
