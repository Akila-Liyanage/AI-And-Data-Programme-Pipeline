import mongoose, { Document, Schema, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export type UserRole = 'ADMIN' | 'PERMANENT_STAFF' | 'INTERN';
export type AccountStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'REJECTED';

export interface IUser extends Document {
  userId: string;
  username: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  password?: string;
  role: UserRole;
  designation?: string;
  department: string;
  accountStatus: AccountStatus;
  otpCode?: string;
  otpExpiresAt?: Date;
  employmentType?: string;
  internRole?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    userId: {
      type: String,
      required: [true, 'User ID is required'],
      unique: true,
      trim: true,
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
      unique: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      minlength: [6, 'Password must be at least 6 characters'],
      default: undefined,
    },
    role: {
      type: String,
      enum: {
        values: ['ADMIN', 'PERMANENT_STAFF', 'INTERN'],
        message: '{VALUE} is not a valid role',
      },
      required: [true, 'Role is required'],
      default: 'INTERN',
    },
    designation: {
      type: String,
      trim: true,
    },
    department: {
      type: String,
      default: 'AI & Data',
      trim: true,
    },
    accountStatus: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'PENDING', 'REJECTED'],
      default: 'ACTIVE',
    },
    employmentType: {
      type: String,
      trim: true,
    },
    internRole: {
      type: String,
      trim: true,
    },
    otpCode: {
      type: String,
      trim: true,
    },
    otpExpiresAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving if modified and present
UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare entered password with hashed password in database
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);

export default User;
