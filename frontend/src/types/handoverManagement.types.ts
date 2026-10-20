export interface WorkItemDetail {
  workItemId: string;
  projectId: string;
  projectName: string;
  title: string;
  role: string;
  percentage: number;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  assignedUserId?: string;
  assignedUserName?: string;
  handoverNotes?: string;
  completedAt?: string;
}

export interface AssignmentDetail {
  assignmentId: string;
  projectId: string;
  projectName: string;
  role: string;
  assignmentRole: string;
  startDate: string;
  expectedEndDate?: string;
  status: string;
  allocationNotes?: string;
  previousUserId?: string;
  previousUserName?: string;
  handoverDate?: string;
}

export interface OffboardedUser {
  userId: string;
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: 'INTERN' | 'PERMANENT_STAFF' | string;
  designation?: string;
  internRole?: string;
  department: string;
  accountStatus: string;
  offboardedAt?: string;
  offboardReason?: string;
  offboardNotes?: string;
  totalTasks: number;
  completedTasksCount: number;
  pendingTasksCount: number;
  completionRate: number;
  handoverStatus: 'FULLY_HANDED_OVER' | 'NEEDS_HANDOVER';
  completedWorkItems: WorkItemDetail[];
  pendingWorkItems: WorkItemDetail[];
  assignments: AssignmentDetail[];
  projectsInvolved: { projectId: string; projectName: string }[];
}

export interface ActiveCandidate {
  userId: string;
  id: string;
  fullName: string;
  email: string;
  role: string;
  designation?: string;
  internRole?: string;
  department: string;
  activeTasksCount: number;
  activeAssignmentsCount: number;
}

export interface HandoverStats {
  totalDepartedUsers: number;
  totalCompletedTasks: number;
  totalPendingTasks: number;
  totalReassignedTasks: number;
  overallCompletionRate: number;
  internsOffboarded: number;
  staffConcluded: number;
  pendingHandoverUsersCount: number;
}
