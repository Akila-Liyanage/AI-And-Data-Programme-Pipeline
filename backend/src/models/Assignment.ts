import mongoose, { Document, Schema } from 'mongoose';

export interface IAssignment extends Document {
  assignmentId: string;
  projectId: string;
  projectName: string;
  userId: string;
  userName: string;
  userCategory: 'Permanent Staff' | 'Intern' | string;
  professionalRole: string;
  assignmentRole: 'Project Lead' | 'Supervisor' | 'Contributor' | 'Intern Contributor' | 'Reviewer' | string;
  startDate: string;
  expectedEndDate?: string;
  status: 'Assigned' | 'Pending' | 'Completed' | 'Handed Over' | string;
  allocationNotes?: string;
  previousUserId?: string;
  previousUserName?: string;
  handoverDate?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AssignmentSchema = new Schema<IAssignment>(
  {
    assignmentId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    projectId: {
      type: String,
      required: true,
      trim: true,
    },
    projectName: {
      type: String,
      required: true,
      trim: true,
    },
    userId: {
      type: String,
      required: true,
      trim: true,
    },
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    userCategory: {
      type: String,
      required: true,
      enum: ['Permanent Staff', 'Intern', 'Staff'],
      default: 'Permanent Staff',
    },
    professionalRole: {
      type: String,
      default: 'Developer',
    },
    assignmentRole: {
      type: String,
      required: true,
      enum: ['Project Lead', 'Supervisor', 'Contributor', 'Intern Contributor', 'Reviewer'],
      default: 'Contributor',
    },
    startDate: {
      type: String,
      required: true,
    },
    expectedEndDate: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Assigned', 'Pending', 'Completed', 'Handed Over'],
      default: 'Assigned',
    },
    allocationNotes: {
      type: String,
      default: '',
    },
    previousUserId: {
      type: String,
      default: '',
      trim: true,
    },
    previousUserName: {
      type: String,
      default: '',
      trim: true,
    },
    handoverDate: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

AssignmentSchema.index({ projectId: 1, userId: 1 });
AssignmentSchema.index({ userId: 1 });
AssignmentSchema.index({ status: 1 });
AssignmentSchema.index({ createdAt: -1 });

export const Assignment = mongoose.model<IAssignment>('Assignment', AssignmentSchema);
