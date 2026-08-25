import mongoose, { Document, Schema } from 'mongoose';

export interface IWorkItem {
  workItemId: string;
  title: string;
  role: string;
  percentage: number;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
}

export interface IProject extends Document {
  projectId: string;
  name: string;
  category: 'AI' | 'Data Science' | 'Data Analytics' | 'Software Development' | 'Research' | string;
  description: string;
  technologyStack?: string;
  department: string;
  projectLead?: string;
  assignedMembersCount: number;
  startDate: string;
  targetDate: string;
  status: 'Planned' | 'Active' | 'On Hold' | 'Completed';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  progress: number;
  workItems: IWorkItem[];
  createdAt: Date;
  updatedAt: Date;
}

const WorkItemSchema = new Schema<IWorkItem>(
  {
    workItemId: { type: String, required: true },
    title: { type: String, required: true },
    role: { type: String, required: true },
    percentage: { type: Number, required: true, min: 0, max: 100 },
    status: {
      type: String,
      enum: ['TODO', 'IN_PROGRESS', 'DONE'],
      default: 'TODO',
    },
  },
  { _id: false }
);

const ProjectSchema = new Schema<IProject>(
  {
    projectId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['AI', 'Data Science', 'Data Analytics', 'Software Development', 'Research', 'General'],
      default: 'AI',
    },
    description: {
      type: String,
      default: '',
    },
    technologyStack: {
      type: String,
      default: '',
    },
    department: {
      type: String,
      required: true,
      default: 'AI & Data Systems',
    },
    projectLead: {
      type: String,
      default: 'Unassigned',
    },
    assignedMembersCount: {
      type: Number,
      default: 0,
    },
    startDate: {
      type: String,
      required: true,
    },
    targetDate: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Planned', 'Active', 'On Hold', 'Completed'],
      default: 'Active',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    workItems: [WorkItemSchema],
  },
  {
    timestamps: true,
  }
);

ProjectSchema.index({ category: 1, status: 1 });
ProjectSchema.index({ createdAt: -1 });

export const Project = mongoose.model<IProject>('Project', ProjectSchema);
