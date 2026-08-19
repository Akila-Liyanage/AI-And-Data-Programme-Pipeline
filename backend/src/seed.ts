import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import User, { IUser } from './models/User';

const seedUsers = async (): Promise<void> => {
  const mongoURI = process.env.MONGO_URI;

  if (!mongoURI) {
    console.error('❌ MONGO_URI is missing in .env');
    process.exit(1);
  }

  try {
    console.log('Connecting to MongoDB for seeding...');
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    // Remove existing seed users if they exist
    const userIds = ['ADM-001', 'STF-101', 'INT-201'];
    await User.deleteMany({ userId: { $in: userIds } });
    console.log('🧹 Cleaned up existing demo users');

    const demoUsers = [
      {
        userId: 'ADM-001',
        username: 'admin',
        fullName: 'Akila Liyanage',
        email: 'admin@aidata.com',
        password: 'Admin@123',
        role: 'ADMIN' as const,
        designation: 'Lead System Administrator',
        department: 'AI & Data Team',
        accountStatus: 'ACTIVE' as const,
      },
      {
        userId: 'STF-101',
        username: 'staff_kasun',
        fullName: 'Dr. Kasun Perera',
        email: 'kasun@aidata.com',
        password: 'Staff@123',
        role: 'PERMANENT_STAFF' as const,
        designation: 'Senior AI Engineer & Supervisor',
        department: 'AI & Data Team',
        accountStatus: 'ACTIVE' as const,
      },
      {
        userId: 'INT-201',
        username: 'intern_ayuni',
        fullName: 'Ayuni Sliit',
        email: 'ayuni@aidata.com',
        password: 'Intern@123',
        role: 'INTERN' as const,
        designation: 'Data Science Intern',
        department: 'AI & Data Team',
        accountStatus: 'ACTIVE' as const,
      },
    ];

    for (const userData of demoUsers) {
      const user = new User(userData);
      await user.save();
      console.log(`✅ Seeded user: ${user.fullName} (${user.role}) - ID: ${user.userId}`);
    }

    console.log('🎉 Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
};

seedUsers();
