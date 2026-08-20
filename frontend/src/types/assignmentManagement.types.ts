/**
 * Project Assignment Domain Types
 * Defines interfaces and types for administration of programme user-to-project assignments.
 */

export type AssignmentRole =
  | 'Project Lead'
  | 'Supervisor'
  | 'Contributor'
  | 'Intern Contributor'
  | 'Reviewer'
  | (string & {});

export type AssignmentStatus =
  | 'Assigned'
  | 'Pending'
  | 'Completed'
  | (string & {});

export interface ManagedAssignment {
  id: string;
  projectName: string;
  projectId: string;
  userName: string;
  userId: string;
  userCategory: 'Permanent Staff' | 'Intern' | string;
  professionalRole: string;
  assignmentRole: AssignmentRole;
  startDate: string;
  expectedEndDate?: string;
  assignmentDate?: string;
  allocationNotes?: string;
  status: AssignmentStatus;
  projectLead?: string;
  department?: string;
  projectStatus?: string;
  createdAt?: string;
  updatedAt?: string;
}
