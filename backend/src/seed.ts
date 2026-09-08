import dotenv from 'dotenv';
import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
dotenv.config();

import mongoose from 'mongoose';
import User from './models/User';
import { Project } from './models/Project';
import { Assignment } from './models/Assignment';

const seedDatabase = async (): Promise<void> => {
  const mongoURI = process.env.MONGO_URI;

  if (!mongoURI) {
    console.error('❌ MONGO_URI is missing in .env');
    process.exit(1);
  }

  try {
    console.log('Connecting to MongoDB for seeding...');
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    // 1. Seed Users
    const userIds = ['ADM-001', 'STF-101', 'STF-102', 'INT-201', 'INT-202', 'INT-203'];
    await User.deleteMany({ userId: { $in: userIds } });

    const demoUsers = [
      {
        userId: 'ADM-001',
        username: 'admin',
        fullName: 'Akila Liyanage',
        phoneNumber: '0774943291',
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
        phoneNumber: '0771234567',
        email: 'kasun@aidata.com',
        password: 'Staff@123',
        role: 'PERMANENT_STAFF' as const,
        employmentType: 'Permanent',
        designation: 'Senior AI Engineer',
        department: 'AI & Data Team',
        accountStatus: 'ACTIVE' as const,
      },
      {
        userId: 'STF-102',
        username: 'staff_nimal',
        fullName: 'Nimal Jayawardena',
        phoneNumber: '0779988776',
        email: 'nimal@aidata.com',
        password: 'Staff@123',
        role: 'PERMANENT_STAFF' as const,
        employmentType: 'Contract Based',
        designation: 'Data Engineer',
        department: 'AI & Data Team',
        accountStatus: 'ACTIVE' as const,
      },
      {
        userId: 'INT-201',
        username: 'intern_ayuni',
        fullName: 'Ayuni Sliit',
        phoneNumber: '0777654321',
        email: 'ayuni@aidata.com',
        password: 'Intern@123',
        role: 'INTERN' as const,
        internRole: 'AI/ML',
        designation: 'AI/ML Intern',
        department: 'AI & Data Team',
        accountStatus: 'ACTIVE' as const,
      },
      {
        userId: 'INT-202',
        username: 'intern_chamath',
        fullName: 'Chamath Fernando',
        phoneNumber: '0771122334',
        email: 'chamath@aidata.com',
        password: 'Intern@123',
        role: 'INTERN' as const,
        internRole: 'Frontend Developer',
        designation: 'Frontend Developer Intern',
        department: 'AI & Data Team',
        accountStatus: 'ACTIVE' as const,
      },
      {
        userId: 'INT-203',
        username: 'intern_ruwini',
        fullName: 'Ruwini Alwis',
        phoneNumber: '0775566778',
        email: 'ruwini@aidata.com',
        password: 'Intern@123',
        role: 'INTERN' as const,
        internRole: 'QA',
        designation: 'QA Intern',
        department: 'AI & Data Team',
        accountStatus: 'ACTIVE' as const,
      },
    ];

    for (const userData of demoUsers) {
      const user = new User(userData);
      await user.save();
    }
    console.log('✅ Seeded 6 demo accounts (Admin, Staff, Intern)');

    // 2. Seed Projects
    await Project.deleteMany({});
    const demoProjects = [
      {
        projectId: 'PRJ-101',
        name: 'Customer Churn AI Prediction Model',
        category: 'AI',
        description: 'Predict telecommunication subscriber churn behavior using deep learning embeddings and tree ensembles.',
        technologyStack: 'Python, PyTorch, Scikit-Learn, FastAPI, React',
        department: 'AI & Data Systems',
        projectLead: 'Dr. Kasun Perera',
        startDate: '2026-06-01',
        targetDate: '2026-10-30',
        status: 'Active',
        priority: 'High',
        progress: 75,
        assignedMembersCount: 2,
        workItems: [
          {
            workItemId: 'WI-101',
            title: 'Data Ingestion & Feature Engineering Pipeline',
            role: 'Data Engineer',
            percentage: 25,
            status: 'DONE',
          },
          {
            workItemId: 'WI-102',
            title: 'Model Architecture Design & XGBoost Training',
            role: 'AI Engineer',
            percentage: 25,
            status: 'DONE',
          },
          {
            workItemId: 'WI-103',
            title: 'Model Evaluation, ROC-AUC Analysis & Tuning',
            role: 'AI/ML Intern',
            percentage: 25,
            status: 'DONE',
          },
          {
            workItemId: 'WI-104',
            title: 'Inference REST API & Containerized Deployment',
            role: 'Software Engineer',
            percentage: 25,
            status: 'IN_PROGRESS',
          },
        ],
      },
      {
        projectId: 'PRJ-102',
        name: 'Telecom Network Anomaly Detection Pipeline',
        category: 'Data Science',
        description: 'Real-time telemetry stream processing to identify cell-tower degradation and outages automatically.',
        technologyStack: 'Kafka, Apache Spark, Python, TimescaleDB',
        department: 'Enterprise Network',
        projectLead: 'Akila Liyanage',
        startDate: '2026-07-15',
        targetDate: '2026-11-30',
        status: 'Active',
        priority: 'Critical',
        progress: 0,
        assignedMembersCount: 0, // Unassigned: available for self-enrollment
        workItems: [
          {
            workItemId: 'WI-201',
            title: 'Telemetry Kafka Stream Producer Configuration',
            role: 'Backend Developer',
            percentage: 25,
            status: 'TODO',
          },
          {
            workItemId: 'WI-202',
            title: 'Unsupervised Isolation Forest Baseline Model',
            role: 'Data Scientist',
            percentage: 25,
            status: 'TODO',
          },
          {
            workItemId: 'WI-203',
            title: 'Real-time Anomaly Threshold Alerts Engine',
            role: 'Software Engineer',
            percentage: 25,
            status: 'TODO',
          },
          {
            workItemId: 'WI-204',
            title: 'Operations Dashboard & Incident Logging UI',
            role: 'Frontend Developer',
            percentage: 25,
            status: 'TODO',
          },
        ],
      },
      {
        projectId: 'PRJ-103',
        name: 'Automated Programme Progress Analytics Hub',
        category: 'Software Development',
        description: 'Executive portal providing automatic percentage aggregation from granular work-item statuses across all streams.',
        technologyStack: 'React, Vite, Node.js, Express, MongoDB, TailwindCSS',
        department: 'Software Architecture',
        projectLead: 'Dr. Kasun Perera',
        startDate: '2026-05-01',
        targetDate: '2026-09-15',
        status: 'Active',
        priority: 'Medium',
        progress: 90,
        assignedMembersCount: 1,
        workItems: [
          {
            workItemId: 'WI-301',
            title: 'Role-Based Authentication & Verification Workflows',
            role: 'Security Engineer',
            percentage: 30,
            status: 'DONE',
          },
          {
            workItemId: 'WI-302',
            title: 'Project Breakdown & Allocation Engines',
            role: 'Full-Stack Developer',
            percentage: 30,
            status: 'DONE',
          },
          {
            workItemId: 'WI-303',
            title: 'Progress Weight Calculation Mechanics',
            role: 'Lead Architect',
            percentage: 30,
            status: 'DONE',
          },
          {
            workItemId: 'WI-304',
            title: 'Executive PDF Export & Reporting Audit Logs',
            role: 'QA / Developer',
            percentage: 10,
            status: 'IN_PROGRESS',
          },
        ],
      },
      {
        projectId: 'PRJ-104',
        name: 'Conversational AI Customer Support Assistant',
        category: 'AI',
        description: 'Context-aware multilingual support chatbot leveraging RAG pipeline, LLM agents, and knowledge base embeddings.',
        technologyStack: 'Python, LangChain, FastAPI, ChromaDB, React',
        department: 'AI & Data Systems',
        projectLead: 'Dr. Kasun Perera',
        startDate: '2026-08-01',
        targetDate: '2026-12-15',
        status: 'Active',
        priority: 'High',
        progress: 0,
        assignedMembersCount: 0, // Unassigned: available for self-enrollment
        workItems: [
          {
            workItemId: 'WI-401',
            title: 'LLM RAG Pipeline & Vector Database Embeddings',
            role: 'AI/ML',
            percentage: 30,
            status: 'TODO',
          },
          {
            workItemId: 'WI-402',
            title: 'FastAPI Backend Endpoints & Rate Limiting',
            role: 'Backend Developer',
            percentage: 25,
            status: 'TODO',
          },
          {
            workItemId: 'WI-403',
            title: 'Interactive Support Chat Widget & Streaming UI',
            role: 'Frontend Developer',
            percentage: 25,
            status: 'TODO',
          },
          {
            workItemId: 'WI-404',
            title: 'Automated Accuracy Evaluation & Hallucination QA',
            role: 'QA',
            percentage: 20,
            status: 'TODO',
          },
        ],
      },
      {
        projectId: 'PRJ-105',
        name: 'Real-Time BI Analytics & Visualization Suite',
        category: 'Data Science',
        description: 'Enterprise data visualization suite for streaming telemetry, KPI aggregation, and automated scheduled reporting.',
        technologyStack: 'Node.js, PostgreSQL, Apache ECharts, React, TypeScript',
        department: 'Enterprise Network',
        projectLead: 'Akila Liyanage',
        startDate: '2026-08-15',
        targetDate: '2026-12-30',
        status: 'Active',
        priority: 'Medium',
        progress: 0,
        assignedMembersCount: 0, // Unassigned: available for self-enrollment
        workItems: [
          {
            workItemId: 'WI-501',
            title: 'Data Extraction & Aggregation SQL Pipeline',
            role: 'Data Engineer',
            percentage: 35,
            status: 'TODO',
          },
          {
            workItemId: 'WI-502',
            title: 'Interactive Dashboard Charts & Filter Controls',
            role: 'Frontend Developer',
            percentage: 35,
            status: 'TODO',
          },
          {
            workItemId: 'WI-503',
            title: 'Data Accuracy & Stress Load Validation Test Suite',
            role: 'QA',
            percentage: 30,
            status: 'TODO',
          },
        ],
      },
      {
        projectId: 'PRJ-106',
        name: 'Enterprise Design System & Accessible Component Kit',
        category: 'Software Development',
        description: 'Centralized UI design system adhering to WCAG 2.1 AA standards, dynamic theming, and shared React component library.',
        technologyStack: 'React, TypeScript, TailwindCSS, Storybook, Jest',
        department: 'Software Architecture',
        projectLead: 'Akila Liyanage',
        startDate: '2026-09-01',
        targetDate: '2026-12-31',
        status: 'Active',
        priority: 'Medium',
        progress: 0,
        assignedMembersCount: 0, // Unassigned: available for self-enrollment
        workItems: [
          {
            workItemId: 'WI-601',
            title: 'Accessible Atomic Component Primitives & Tokens',
            role: 'Frontend Developer',
            percentage: 40,
            status: 'TODO',
          },
          {
            workItemId: 'WI-602',
            title: 'Theme Provider & CSS Custom Properties Engine',
            role: 'Frontend Developer',
            percentage: 30,
            status: 'TODO',
          },
          {
            workItemId: 'WI-603',
            title: 'Visual Regression & Accessibility Audit Tests',
            role: 'QA',
            percentage: 30,
            status: 'TODO',
          },
        ],
      },
    ];

    for (const projectData of demoProjects) {
      const project = new Project(projectData);
      await project.save();
    }
    console.log('✅ Seeded 6 Programme Projects (including 4 unassigned for self-enrollment)');

    // 3. Seed Assignments
    await Assignment.deleteMany({});
    const demoAssignments = [
      {
        assignmentId: 'ASG-101',
        projectId: 'PRJ-101',
        projectName: 'Customer Churn AI Prediction Model',
        userId: 'STF-101',
        userName: 'Dr. Kasun Perera',
        userCategory: 'Permanent Staff',
        professionalRole: 'Senior AI Engineer',
        assignmentRole: 'Project Lead',
        startDate: '2026-06-01',
        expectedEndDate: '2026-10-30',
        status: 'Assigned',
        allocationNotes: 'Overseeing model design and pipeline engineering.',
      },
      {
        assignmentId: 'ASG-102',
        projectId: 'PRJ-101',
        projectName: 'Customer Churn AI Prediction Model',
        userId: 'INT-201',
        userName: 'Ayuni Sliit',
        userCategory: 'Intern',
        professionalRole: 'AI/ML Intern',
        assignmentRole: 'Intern Contributor',
        startDate: '2026-06-15',
        expectedEndDate: '2026-10-30',
        status: 'Assigned',
        allocationNotes: 'Responsible for XGBoost tuning and metric benchmarks.',
      },
      {
        assignmentId: 'ASG-103',
        projectId: 'PRJ-103',
        projectName: 'Automated Programme Progress Analytics Hub',
        userId: 'STF-101',
        userName: 'Dr. Kasun Perera',
        userCategory: 'Permanent Staff',
        professionalRole: 'Senior AI Engineer',
        assignmentRole: 'Project Lead',
        startDate: '2026-05-01',
        expectedEndDate: '2026-09-15',
        status: 'Assigned',
        allocationNotes: 'System architecture review and sprint coordination.',
      },
    ];

    for (const assignmentData of demoAssignments) {
      const assignment = new Assignment(assignmentData);
      await assignment.save();
    }
    console.log('✅ Seeded 3 Project Assignments');

    console.log('🎉 Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
};

seedDatabase();
