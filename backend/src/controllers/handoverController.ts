import { Request, Response } from 'express';
import User from '../models/User';
import { Project } from '../models/Project';
import { Assignment } from '../models/Assignment';
import { appCache } from '../utils/cache';

/**
 * Interface for Handover summary statistics and detailed workload
 */
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

export interface OffboardedUserSummary {
  userId: string;
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: string;
  designation?: string;
  internRole?: string;
  department: string;
  accountStatus: string;
  offboardedAt?: string;
  offboardReason?: string;
  offboardNotes?: string;
  // Metrics
  totalTasks: number;
  completedTasksCount: number;
  pendingTasksCount: number;
  completionRate: number;
  handoverStatus: 'FULLY_HANDED_OVER' | 'NEEDS_HANDOVER';
  // Detailed lists
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

/**
 * @desc    Get Offboarding & Handover Summary (Admin only)
 * @route   GET /api/handover/summary
 * @access  Private (Admin)
 */
export const getHandoverSummary = async (_req: Request, res: Response): Promise<void> => {
  try {
    const cacheKey = 'handover_summary';
    const cachedData = appCache.get<any>(cacheKey);
    if (cachedData) {
      res.status(200).json(cachedData);
      return;
    }

    // Fetch all users, projects, and assignments in parallel
    const [allUsers, allProjects, allAssignments] = await Promise.all([
      User.find().select('-password -otpCode -resetPasswordOtp').lean(),
      Project.find().lean(),
      Assignment.find().lean(),
    ]);

    // Offboarded / Inactive users
    const inactiveUsers = allUsers.filter(
      (u) =>
        u.accountStatus === 'INACTIVE' ||
        u.accountStatus === 'REJECTED' ||
        Boolean(u.offboardedAt) ||
        Boolean(u.offboardReason)
    );

    // Active eligible candidates for reassignment (excluding Admins)
    const activeUsers = allUsers.filter(
      (u) => u.accountStatus === 'ACTIVE' && u.role !== 'ADMIN'
    );

    // Calculate active candidates' existing load
    const activeCandidates: ActiveCandidate[] = activeUsers.map((u) => {
      const userAssignments = allAssignments.filter(
        (a) => a.userId === u.userId && a.status !== 'Completed'
      );
      let userWorkItemsCount = 0;
      allProjects.forEach((p) => {
        (p.workItems || []).forEach((wi) => {
          if (wi.assignedUserId === u.userId && wi.status !== 'DONE') {
            userWorkItemsCount++;
          }
        });
      });

      return {
        userId: u.userId,
        id: (u._id as any).toString(),
        fullName: u.fullName,
        email: u.email,
        role: u.role,
        designation: u.designation,
        internRole: u.internRole,
        department: u.department,
        activeTasksCount: userWorkItemsCount,
        activeAssignmentsCount: userAssignments.length,
      };
    });

    // Map each inactive/offboarded user's completed vs pending workload
    let totalCompletedAcrossDeparted = 0;
    let totalPendingAcrossDeparted = 0;
    let totalReassignedAcrossDeparted = 0;

    const departedSummaries: OffboardedUserSummary[] = inactiveUsers.map((user) => {
      // 1. Assignments for this user
      const userAssignments = allAssignments.filter((a) => a.userId === user.userId);
      const handedOverAssignments = allAssignments.filter(
        (a) => a.previousUserId === user.userId
      );
      totalReassignedAcrossDeparted += handedOverAssignments.length;

      const formattedAssignments: AssignmentDetail[] = userAssignments.map((a) => ({
        assignmentId: a.assignmentId,
        projectId: a.projectId,
        projectName: a.projectName,
        role: a.professionalRole || 'Contributor',
        assignmentRole: a.assignmentRole,
        startDate: a.startDate,
        expectedEndDate: a.expectedEndDate,
        status: a.status,
        allocationNotes: a.allocationNotes,
        previousUserId: a.previousUserId,
        previousUserName: a.previousUserName,
        handoverDate: a.handoverDate,
      }));

      // 2. WorkItems across projects
      const completedWorkItems: WorkItemDetail[] = [];
      const pendingWorkItems: WorkItemDetail[] = [];
      const projectsInvolvedMap = new Map<string, string>();

      // Work items assigned directly or matching their project assignment
      allProjects.forEach((proj) => {
        const hasAssignment = userAssignments.some((a) => a.projectId === proj.projectId);
        const userRoleStr = (user.designation || user.internRole || '').toLowerCase();

        (proj.workItems || []).forEach((wi) => {
          const isDirectlyAssigned = wi.assignedUserId === user.userId;
          const isRoleMatched =
            !wi.assignedUserId &&
            hasAssignment &&
            wi.role &&
            userRoleStr &&
            (wi.role.toLowerCase().includes(userRoleStr) || userRoleStr.includes(wi.role.toLowerCase()));

          if (isDirectlyAssigned || isRoleMatched) {
            projectsInvolvedMap.set(proj.projectId, proj.name);
            const itemDetail: WorkItemDetail = {
              workItemId: wi.workItemId,
              projectId: proj.projectId,
              projectName: proj.name,
              title: wi.title,
              role: wi.role,
              percentage: wi.percentage,
              status: wi.status,
              assignedUserId: wi.assignedUserId || user.userId,
              assignedUserName: wi.assignedUserName || user.fullName,
              handoverNotes: wi.handoverNotes,
              completedAt: wi.completedAt,
            };

            if (wi.status === 'DONE') {
              completedWorkItems.push(itemDetail);
            } else {
              pendingWorkItems.push(itemDetail);
            }
          }
        });
      });

      // If user had assignments marked Completed or Assigned without explicit workItems, account for them
      userAssignments.forEach((asg) => {
        projectsInvolvedMap.set(asg.projectId, asg.projectName);
        // If no work items captured for this project assignment, create a synthetic item for clarity
        const hasWorkItemInProject =
          completedWorkItems.some((w) => w.projectId === asg.projectId) ||
          pendingWorkItems.some((w) => w.projectId === asg.projectId);

        if (!hasWorkItemInProject) {
          const itemDetail: WorkItemDetail = {
            workItemId: `${asg.assignmentId}-DELIV`,
            projectId: asg.projectId,
            projectName: asg.projectName,
            title: `${asg.assignmentRole} Deliverables - ${asg.projectName}`,
            role: asg.professionalRole || asg.assignmentRole,
            percentage: 20,
            status: asg.status === 'Completed' ? 'DONE' : 'IN_PROGRESS',
            assignedUserId: user.userId,
            assignedUserName: user.fullName,
            handoverNotes: asg.allocationNotes,
          };
          if (asg.status === 'Completed') {
            completedWorkItems.push(itemDetail);
          } else {
            pendingWorkItems.push(itemDetail);
          }
        }
      });

      const totalTasks = completedWorkItems.length + pendingWorkItems.length;
      const completionRate =
        totalTasks > 0 ? Math.round((completedWorkItems.length / totalTasks) * 100) : 100;

      totalCompletedAcrossDeparted += completedWorkItems.length;
      totalPendingAcrossDeparted += pendingWorkItems.length;

      const projectsInvolved = Array.from(projectsInvolvedMap.entries()).map(
        ([projectId, projectName]) => ({ projectId, projectName })
      );

      return {
        userId: user.userId,
        id: (user._id as any).toString(),
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        designation: user.designation,
        internRole: user.internRole,
        department: user.department,
        accountStatus: user.accountStatus,
        offboardedAt: user.offboardedAt ? new Date(user.offboardedAt).toISOString() : undefined,
        offboardReason: user.offboardReason || (user.role === 'INTERN' ? 'INTERNSHIP_COMPLETED' : 'CONTRACT_ENDED'),
        offboardNotes: user.offboardNotes || 'Offboarded from active programme rotation.',
        totalTasks,
        completedTasksCount: completedWorkItems.length,
        pendingTasksCount: pendingWorkItems.length,
        completionRate,
        handoverStatus: pendingWorkItems.length === 0 ? 'FULLY_HANDED_OVER' : 'NEEDS_HANDOVER',
        completedWorkItems,
        pendingWorkItems,
        assignments: formattedAssignments,
        projectsInvolved,
      };
    });

    const totalDepartedUsers = departedSummaries.length;
    const allTotalTasks = totalCompletedAcrossDeparted + totalPendingAcrossDeparted;
    const overallCompletionRate =
      allTotalTasks > 0 ? Math.round((totalCompletedAcrossDeparted / allTotalTasks) * 100) : 0;

    const payload = {
      success: true,
      stats: {
        totalDepartedUsers,
        totalCompletedTasks: totalCompletedAcrossDeparted,
        totalPendingTasks: totalPendingAcrossDeparted,
        totalReassignedTasks: totalReassignedAcrossDeparted,
        overallCompletionRate,
        internsOffboarded: departedSummaries.filter((u) => u.role === 'INTERN').length,
        staffConcluded: departedSummaries.filter((u) => u.role === 'PERMANENT_STAFF').length,
        pendingHandoverUsersCount: departedSummaries.filter((u) => u.handoverStatus === 'NEEDS_HANDOVER').length,
      },
      departedUsers: departedSummaries,
      activeCandidates,
    };

    appCache.set(cacheKey, payload, 15);
    res.status(200).json(payload);
  } catch (error: any) {
    console.error('Error fetching handover summary:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve offboarding and handover summary',
      error: error.message,
    });
  }
};

/**
 * @desc    Reassign Work / Handover Tasks to an active team member (Admin only)
 * @route   POST /api/handover/reassign
 * @access  Private (Admin)
 */
export const reassignWork = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      fromUserId,
      toUserId,
      workItemIds, // optional Array<{ projectId: string; workItemId: string }>
      assignmentIds, // optional Array<string>
      handoverNotes,
      reassignAll, // boolean: true to reassign everything pending
    } = req.body;

    if (!fromUserId || !toUserId) {
      res.status(400).json({
        success: false,
        message: 'Both departing user (fromUserId) and replacement user (toUserId) are required.',
      });
      return;
    }

    const [fromUser, toUser] = await Promise.all([
      User.findOne({ userId: fromUserId }),
      User.findOne({ userId: toUserId }),
    ]);

    if (!fromUser) {
      res.status(404).json({ success: false, message: `Departed user ${fromUserId} not found.` });
      return;
    }
    if (!toUser) {
      res.status(404).json({ success: false, message: `Replacement user ${toUserId} not found.` });
      return;
    }
    if (toUser.accountStatus !== 'ACTIVE') {
      res.status(400).json({
        success: false,
        message: `Replacement user ${toUser.fullName} is not ACTIVE. Tasks can only be reassigned to active personnel.`,
      });
      return;
    }

    const handoverDateStr = new Date().toISOString().split('T')[0];
    const logTimestamp = new Date().toLocaleString();
    const handoverAudit = `[HANDOVER on ${logTimestamp}]: Handed over from ${fromUser.fullName} (${fromUser.userId}) to ${toUser.fullName} (${toUser.userId}). Reason: ${fromUser.offboardReason || 'Offboarding / Tenure Completed'}. Notes: ${handoverNotes || 'Handover transition confirmed by Administrator.'}`;

    let reassignedAssignmentsCount = 0;
    let reassignedWorkItemsCount = 0;

    // 1. Reassign Assignments
    const assignmentFilter: any = {
      userId: fromUserId,
      status: { $in: ['Assigned', 'Pending'] },
    };

    if (!reassignAll && Array.isArray(assignmentIds) && assignmentIds.length > 0) {
      assignmentFilter.assignmentId = { $in: assignmentIds };
    }

    const assignmentsToUpdate = await Assignment.find(assignmentFilter);

    for (const asg of assignmentsToUpdate) {
      asg.previousUserId = fromUser.userId;
      asg.previousUserName = fromUser.fullName;
      asg.userId = toUser.userId;
      asg.userName = toUser.fullName;
      asg.userCategory = toUser.role === 'PERMANENT_STAFF' ? 'Permanent Staff' : 'Intern';
      asg.professionalRole = toUser.designation || toUser.internRole || asg.professionalRole;
      asg.handoverDate = handoverDateStr;
      asg.allocationNotes = asg.allocationNotes
        ? `${asg.allocationNotes}\n${handoverAudit}`
        : handoverAudit;

      await asg.save();
      reassignedAssignmentsCount++;
    }

    // 2. Reassign Project Work Items
    const projects = await Project.find({
      $or: [
        { 'workItems.assignedUserId': fromUserId },
        { projectId: { $in: assignmentsToUpdate.map((a) => a.projectId) } },
      ],
    });

    for (const project of projects) {
      let projectModified = false;

      project.workItems.forEach((wi) => {
        const isMatchedById =
          Array.isArray(workItemIds) &&
          workItemIds.some((w: any) => w.projectId === project.projectId && w.workItemId === wi.workItemId);

        const shouldReassign =
          (reassignAll && wi.assignedUserId === fromUserId && wi.status !== 'DONE') ||
          (isMatchedById && wi.status !== 'DONE');

        if (shouldReassign) {
          wi.assignedUserId = toUser.userId;
          wi.assignedUserName = toUser.fullName;
          wi.handoverNotes = handoverAudit;
          projectModified = true;
          reassignedWorkItemsCount++;
        }
      });

      if (projectModified) {
        // Also ensure member count is updated
        project.assignedMembersCount = await Assignment.countDocuments({
          projectId: project.projectId,
        });
        await project.save();
      }
    }

    // Invalidate caches
    appCache.invalidate('assignments');
    appCache.invalidate('projects');
    appCache.invalidate('users');
    appCache.invalidate('handover_summary');

    res.status(200).json({
      success: true,
      message: `Work successfully reassigned to ${toUser.fullName}! (${reassignedAssignmentsCount} assignments and ${reassignedWorkItemsCount} work items transferred).`,
      reassignedAssignmentsCount,
      reassignedWorkItemsCount,
      toUser: {
        userId: toUser.userId,
        fullName: toUser.fullName,
      },
    });
  } catch (error: any) {
    console.error('Error reassigning work:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reassign work',
      error: error.message,
    });
  }
};

/**
 * @desc    Offboard a Staff or Intern (Admin only)
 * @route   POST /api/handover/offboard
 * @access  Private (Admin)
 */
export const offboardUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, reason, notes } = req.body;

    if (!userId) {
      res.status(400).json({ success: false, message: 'User ID is required for offboarding' });
      return;
    }

    const user = await User.findOne({
      $or: [{ userId }, { _id: /^[0-9a-fA-F]{24}$/.test(userId) ? userId : null }],
    });

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    if (user.role === 'ADMIN') {
      res.status(400).json({
        success: false,
        message: 'Administrators cannot be offboarded through this workflow.',
      });
      return;
    }

    user.accountStatus = 'INACTIVE';
    user.offboardedAt = new Date();
    user.offboardReason = reason || (user.role === 'INTERN' ? 'INTERNSHIP_COMPLETED' : 'CONTRACT_ENDED');
    user.offboardNotes = notes || 'Offboarding finalized by Administrator.';

    await user.save();

    // Invalidate caches
    appCache.invalidate('users');
    appCache.invalidate('assignments');
    appCache.invalidate('projects');
    appCache.invalidate('handover_summary');

    res.status(200).json({
      success: true,
      message: `User ${user.fullName} (${user.userId}) has been offboarded. Pending deliverables are ready for handover.`,
      user: {
        userId: user.userId,
        fullName: user.fullName,
        role: user.role,
        accountStatus: user.accountStatus,
        offboardedAt: user.offboardedAt,
        offboardReason: user.offboardReason,
      },
    });
  } catch (error: any) {
    console.error('Error offboarding user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to offboard user',
      error: error.message,
    });
  }
};

/**
 * @desc    Reactivate an offboarded user back to Active (Admin only)
 * @route   POST /api/handover/reactivate
 * @access  Private (Admin)
 */
export const reactivateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.body;

    if (!userId) {
      res.status(400).json({ success: false, message: 'User ID is required' });
      return;
    }

    const user = await User.findOne({
      $or: [{ userId }, { _id: /^[0-9a-fA-F]{24}$/.test(userId) ? userId : null }],
    });

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    user.accountStatus = 'ACTIVE';
    user.offboardedAt = undefined;
    user.offboardReason = undefined;
    user.offboardNotes = undefined;

    await user.save();

    appCache.invalidate('users');
    appCache.invalidate('handover_summary');

    res.status(200).json({
      success: true,
      message: `User ${user.fullName} (${user.userId}) has been reactivated to ACTIVE status.`,
      user: {
        userId: user.userId,
        fullName: user.fullName,
        accountStatus: user.accountStatus,
      },
    });
  } catch (error: any) {
    console.error('Error reactivating user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reactivate user',
      error: error.message,
    });
  }
};
