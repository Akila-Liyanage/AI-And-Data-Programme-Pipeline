import { Request, Response } from 'express';
import { Assignment } from '../models/Assignment';
import { Project } from '../models/Project';
import User from '../models/User';
import { appCache } from '../utils/cache';

// GET /api/assignments - Optimized Caching & Lean Queries
export const getAssignments = async (req: Request, res: Response): Promise<void> => {
  try {
    const { projectId, userId, userCategory, status, search } = req.query;
    const cacheKey = `assignments_${projectId || 'ALL'}_${userId || 'ALL'}_${userCategory || 'ALL'}_${status || 'ALL'}_${search || ''}`;

    const cachedData = appCache.get<any>(cacheKey);
    if (cachedData) {
      res.status(200).json(cachedData);
      return;
    }

    const filter: any = {};
    if (projectId && projectId !== 'ALL') {
      filter.projectId = String(projectId);
    }
    if (userId && userId !== 'ALL') {
      filter.userId = String(userId);
    }
    if (userCategory && userCategory !== 'ALL') {
      filter.userCategory = String(userCategory);
    }
    if (status && status !== 'ALL') {
      filter.status = String(status);
    }
    if (search) {
      const searchStr = String(search);
      filter.$or = [
        { projectName: { $regex: searchStr, $options: 'i' } },
        { projectId: { $regex: searchStr, $options: 'i' } },
        { userName: { $regex: searchStr, $options: 'i' } },
        { userId: { $regex: searchStr, $options: 'i' } },
        { professionalRole: { $regex: searchStr, $options: 'i' } },
        { assignmentRole: { $regex: searchStr, $options: 'i' } },
      ];
    }

    const assignments = await Assignment.find(filter).sort({ createdAt: -1 }).lean();

    const responsePayload = {
      success: true,
      count: assignments.length,
      assignments,
    };

    appCache.set(cacheKey, responsePayload, 20);

    res.status(200).json(responsePayload);
  } catch (error: any) {
    console.error('Error fetching assignments:', error);
    res.status(500).json({ success: false, message: 'Server error fetching assignments', error: error.message });
  }
};

// POST /api/assignments
export const createAssignment = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      projectId,
      userId,
      assignmentRole,
      startDate,
      expectedEndDate,
      allocationNotes,
      status,
    } = req.body;

    if (!projectId || !userId || !assignmentRole || !startDate) {
      res.status(400).json({
        success: false,
        message: 'Project, User, Assignment Role, and Start Date are required.',
      });
      return;
    }

    const isProjectObjectId = /^[0-9a-fA-F]{24}$/.test(projectId);
    const isUserObjectId = /^[0-9a-fA-F]{24}$/.test(userId);

    const [project, user] = await Promise.all([
      Project.findOne({
        $or: [{ ...(isProjectObjectId ? { _id: projectId } : { _id: null }) }, { projectId }],
      }),
      User.findOne({
        $or: [{ ...(isUserObjectId ? { _id: userId } : { _id: null }) }, { userId }],
      }),
    ]);

    if (!project) {
      res.status(404).json({ success: false, message: 'Selected project not found' });
      return;
    }
    if (!user) {
      res.status(404).json({ success: false, message: 'Selected user not found' });
      return;
    }

    const existing = await Assignment.findOne({
      projectId: project.projectId,
      userId: user.userId,
    });
    if (existing) {
      res.status(400).json({
        success: false,
        message: `${user.fullName} is already assigned to ${project.name}.`,
      });
      return;
    }

    let count = await Assignment.countDocuments();
    let assignmentId = `ASG-${String(count + 101).padStart(3, '0')}`;
    let attempts = 0;
    while ((await Assignment.exists({ assignmentId })) && attempts < 100) {
      count++;
      assignmentId = `ASG-${String(count + 101).padStart(3, '0')}`;
      attempts++;
    }

    const isStaff = user.role === 'PERMANENT_STAFF';
    const userCategory = isStaff ? 'Permanent Staff' : 'Intern';
    const professionalRole = user.designation || user.internRole || (isStaff ? 'Staff Engineer' : 'Intern Trainee');

    const newAssignment = new Assignment({
      assignmentId,
      projectId: project.projectId,
      projectName: project.name,
      userId: user.userId,
      userName: user.fullName,
      userCategory,
      professionalRole,
      assignmentRole,
      startDate,
      expectedEndDate: expectedEndDate || project.targetDate,
      allocationNotes: allocationNotes || '',
      status: status || 'Assigned',
    });

    await newAssignment.save();

    // Update project member count
    project.assignedMembersCount = await Assignment.countDocuments({ projectId: project.projectId });
    await project.save();

    // Invalidate caches
    appCache.invalidate('assignments');
    appCache.invalidate('projects');

    res.status(201).json({
      success: true,
      message: 'Assignment created successfully',
      assignment: newAssignment,
    });
  } catch (error: any) {
    console.error('Error creating assignment:', error);
    res.status(500).json({ success: false, message: 'Server error creating assignment', error: error.message });
  }
};

// PUT /api/assignments/:id
export const updateAssignment = async (req: Request, res: Response): Promise<void> => {
  try {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : String(rawId);
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);

    const updated = await Assignment.findOneAndUpdate(
      { $or: [{ ...(isObjectId ? { _id: id } : { _id: null }) }, { assignmentId: id }] },
      req.body,
      { new: true }
    );

    if (!updated) {
      res.status(404).json({ success: false, message: 'Assignment not found' });
      return;
    }

    appCache.invalidate('assignments');

    res.status(200).json({
      success: true,
      message: 'Assignment updated successfully',
      assignment: updated,
    });
  } catch (error: any) {
    console.error('Error updating assignment:', error);
    res.status(500).json({ success: false, message: 'Server error updating assignment', error: error.message });
  }
};

// DELETE /api/assignments/:id
export const deleteAssignment = async (req: Request, res: Response): Promise<void> => {
  try {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : String(rawId);
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);

    const deleted = await Assignment.findOneAndDelete({
      $or: [{ ...(isObjectId ? { _id: id } : { _id: null }) }, { assignmentId: id }],
    });

    if (!deleted) {
      res.status(404).json({ success: false, message: 'Assignment not found' });
      return;
    }

    // Update project member count
    const project = await Project.findOne({ projectId: deleted.projectId });
    if (project) {
      project.assignedMembersCount = await Assignment.countDocuments({ projectId: project.projectId });
      await project.save();
    }

    appCache.invalidate('assignments');
    appCache.invalidate('projects');

    res.json({ success: true, message: 'Assignment deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting assignment:', error);
    res.status(500).json({ success: false, message: 'Server error deleting assignment', error: error.message });
  }
};

// POST /api/assignments/self-enroll (Authenticated - Intern / Staff)
export const selfEnrollProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const { projectId } = req.body;
    if (!projectId) {
      res.status(400).json({ success: false, message: 'Project ID is required for enrollment' });
      return;
    }

    const isProjectObjectId = /^[0-9a-fA-F]{24}$/.test(projectId);
    const project = await Project.findOne({
      $or: [{ ...(isProjectObjectId ? { _id: projectId } : { _id: null }) }, { projectId }],
    });

    if (!project) {
      res.status(404).json({ success: false, message: 'Project not found' });
      return;
    }

    // Check if user is already assigned
    const existing = await Assignment.findOne({
      projectId: project.projectId,
      userId: user.userId,
    });
    if (existing) {
      res.status(400).json({
        success: false,
        message: `You are already enrolled in project "${project.name}".`,
      });
      return;
    }

    // Role Match Verification (BRD FR-14, FR-15)
    const userRole = (user.internRole || user.designation || '').trim();
    const isStaff = user.role === 'PERMANENT_STAFF' || user.role === 'STAFF';
    const userCategory = isStaff ? (user.employmentType || 'Permanent Staff') : 'Intern';

    const roleMatches = (project.workItems || []).some((wi: any) => {
      if (!userRole) return true;
      const wiRole = (wi.role || '').toLowerCase();
      const uRole = userRole.toLowerCase();
      return (
        wiRole.includes(uRole) ||
        uRole.includes(wiRole) ||
        (uRole.includes('ai') && wiRole.includes('ai')) ||
        (uRole.includes('data') && wiRole.includes('data')) ||
        (uRole.includes('frontend') && (wiRole.includes('frontend') || wiRole.includes('ui'))) ||
        (uRole.includes('backend') && (wiRole.includes('backend') || wiRole.includes('api'))) ||
        (uRole.includes('qa') && (wiRole.includes('qa') || wiRole.includes('test'))) ||
        (uRole.includes('analyst') &&
          (wiRole.includes('analyst') || wiRole.includes('brd') || wiRole.includes('requirement')))
      );
    });

    let count = await Assignment.countDocuments();
    let assignmentId = `ASG-${String(count + 101).padStart(3, '0')}`;
    let attempts = 0;
    while ((await Assignment.exists({ assignmentId })) && attempts < 100) {
      count++;
      assignmentId = `ASG-${String(count + 101).padStart(3, '0')}`;
      attempts++;
    }

    // Map to valid enum: ['Project Lead', 'Supervisor', 'Contributor', 'Intern Contributor', 'Reviewer']
    const validAssignmentRole = isStaff ? 'Contributor' : 'Intern Contributor';
    const professionalRole = userRole || (isStaff ? 'Staff Engineer' : 'Intern Contributor');

    const newAssignment = new Assignment({
      assignmentId,
      projectId: project.projectId,
      projectName: project.name,
      userId: user.userId,
      userName: user.fullName,
      userCategory: isStaff ? 'Permanent Staff' : 'Intern',
      professionalRole,
      assignmentRole: validAssignmentRole,
      startDate: new Date().toISOString().split('T')[0],
      expectedEndDate:
        project.targetDate || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      allocationNotes: `Self-enrolled by ${user.fullName} (${professionalRole}) with verified role match.`,
      status: 'Assigned',
    });

    await newAssignment.save();

    // Update project member count
    project.assignedMembersCount = await Assignment.countDocuments({ projectId: project.projectId });
    await project.save();

    // Invalidate caches
    appCache.invalidate('assignments');
    appCache.invalidate('projects');

    res.status(201).json({
      success: true,
      message: `Successfully enrolled in "${project.name}"!`,
      assignment: newAssignment,
      roleMatched: roleMatches,
    });
  } catch (error: any) {
    console.error('Error self-enrolling in project:', error);
    res.status(500).json({ success: false, message: 'Server error during self-enrollment', error: error.message });
  }
};
