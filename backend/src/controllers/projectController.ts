import { Request, Response } from 'express';
import { Project, IWorkItem } from '../models/Project';
import { Assignment } from '../models/Assignment';

// Helper to compute overall project progress percentage from work-items
function computeProgress(workItems: IWorkItem[]): number {
  if (!workItems || workItems.length === 0) return 0;
  const totalCompletedWeight = workItems
    .filter((wi) => wi.status === 'DONE')
    .reduce((sum, wi) => sum + (Number(wi.percentage) || 0), 0);
  return Math.min(100, Math.round(totalCompletedWeight));
}

// GET /api/projects
export const getProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, status, department, search } = req.query;
    const filter: any = {};

    if (category && category !== 'ALL') {
      filter.category = String(category);
    }
    if (status && status !== 'ALL') {
      filter.status = String(status);
    }
    if (department && department !== 'ALL') {
      filter.department = String(department);
    }
    if (search) {
      const searchStr = String(search);
      filter.$or = [
        { name: { $regex: searchStr, $options: 'i' } },
        { projectId: { $regex: searchStr, $options: 'i' } },
        { technologyStack: { $regex: searchStr, $options: 'i' } },
        { projectLead: { $regex: searchStr, $options: 'i' } },
      ];
    }

    const projects = await Project.find(filter).sort({ createdAt: -1 });

    // Sync assigned members count
    for (const p of projects) {
      const count = await Assignment.countDocuments({ projectId: p.projectId });
      if (p.assignedMembersCount !== count) {
        p.assignedMembersCount = count;
        await p.save();
      }
    }

    res.status(200).json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (error: any) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ success: false, message: 'Server error fetching projects', error: error.message });
  }
};

// GET /api/projects/:id
export const getProjectById = async (req: Request, res: Response): Promise<void> => {
  try {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : String(rawId);
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);

    const project = await Project.findOne({
      $or: [{ ...(isObjectId ? { _id: id } : { _id: null }) }, { projectId: id }],
    });

    if (!project) {
      res.status(404).json({ success: false, message: 'Project not found' });
      return;
    }

    const assignments = await Assignment.find({ projectId: project.projectId });

    res.status(200).json({
      success: true,
      project,
      assignments,
    });
  } catch (error: any) {
    console.error('Error fetching project:', error);
    res.status(500).json({ success: false, message: 'Server error fetching project', error: error.message });
  }
};

// POST /api/projects
export const createProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      name,
      projectId: customProjectId,
      category,
      description,
      technologyStack,
      department,
      projectLead,
      startDate,
      targetDate,
      priority,
      status,
      workItems = [],
    } = req.body;

    if (!name || !category || !startDate || !targetDate) {
      res.status(400).json({
        success: false,
        message: 'Name, category, startDate, and targetDate are required.',
      });
      return;
    }

    let finalProjectId = customProjectId;
    if (!finalProjectId) {
      const count = await Project.countDocuments();
      finalProjectId = `PRJ-${String(count + 101).padStart(3, '0')}`;
    }

    const existing = await Project.findOne({ projectId: finalProjectId });
    if (existing) {
      res.status(400).json({
        success: false,
        message: `Project with ID ${finalProjectId} already exists.`,
      });
      return;
    }

    const calculatedProgress = computeProgress(workItems);

    const newProject = new Project({
      projectId: finalProjectId,
      name,
      category,
      description: description || '',
      technologyStack: technologyStack || '',
      department: department || 'AI & Data Systems',
      projectLead: projectLead || 'Unassigned',
      startDate,
      targetDate,
      priority: priority || 'Medium',
      status: status || 'Active',
      progress: calculatedProgress,
      workItems,
    });

    await newProject.save();

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      project: newProject,
    });
  } catch (error: any) {
    console.error('Error creating project:', error);
    res.status(500).json({ success: false, message: 'Server error creating project', error: error.message });
  }
};

// PUT /api/projects/:id
export const updateProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : String(rawId);
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
    const updateData = { ...req.body };

    if (updateData.workItems) {
      updateData.progress = computeProgress(updateData.workItems);
    }

    const updated = await Project.findOneAndUpdate(
      { $or: [{ ...(isObjectId ? { _id: id } : { _id: null }) }, { projectId: id }] },
      updateData,
      { new: true }
    );

    if (!updated) {
      res.status(404).json({ success: false, message: 'Project not found' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      project: updated,
    });
  } catch (error: any) {
    console.error('Error updating project:', error);
    res.status(500).json({ success: false, message: 'Server error updating project', error: error.message });
  }
};

// DELETE /api/projects/:id
export const deleteProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : String(rawId);
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);

    const deleted = await Project.findOneAndDelete({
      $or: [{ ...(isObjectId ? { _id: id } : { _id: null }) }, { projectId: id }],
    });

    if (!deleted) {
      res.status(404).json({ success: false, message: 'Project not found' });
      return;
    }

    await Assignment.deleteMany({ projectId: deleted.projectId });

    res.status(200).json({
      success: true,
      message: 'Project and associated assignments deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting project:', error);
    res.status(500).json({ success: false, message: 'Server error deleting project', error: error.message });
  }
};
