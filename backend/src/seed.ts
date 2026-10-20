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
    const userIds = [
      'ADM-001',
      'STF-101',
      'STF-102',
      'INT-201',
      'INT-202',
      'INT-203',
      'INT-204',
      'STF-103',
      'INT-205',
    ];
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
      // Offboarded / Departed Staff & Interns (Demonstrating Tenure Completion & Handover Needs)
      {
        userId: 'INT-204',
        username: 'intern_kavindu',
        fullName: 'Kavindu Wickramasinghe',
        phoneNumber: '0773344556',
        email: 'kavindu@aidata.com',
        password: 'Intern@123',
        role: 'INTERN' as const,
        internRole: 'AI/ML',
        designation: 'AI/ML Intern',
        department: 'AI & Data Team',
        accountStatus: 'INACTIVE' as const,
        offboardedAt: new Date('2026-09-30'),
        offboardReason: 'INTERNSHIP_COMPLETED',
        offboardNotes: '6-month AI & Data internship cycle completed with excellence. Model training finished; deployment deliverables require handover.',
      },
      {
        userId: 'STF-103',
        username: 'staff_dilshan',
        fullName: 'Dilshan Senanayake',
        phoneNumber: '0778899001',
        email: 'dilshan@aidata.com',
        password: 'Staff@123',
        role: 'PERMANENT_STAFF' as const,
        employmentType: 'Contract Based',
        designation: 'Senior Backend Engineer',
        department: 'Enterprise Network',
        accountStatus: 'INACTIVE' as const,
        offboardedAt: new Date('2026-08-31'),
        offboardReason: 'CONTRACT_ENDED',
        offboardNotes: '1-year fixed engineering contract concluded. Telemetry streaming pipeline delivered; alerting engine ready for handover.',
      },
      {
        userId: 'INT-205',
        username: 'intern_tharushi',
        fullName: 'Tharushi Fernando',
        phoneNumber: '0774433221',
        email: 'tharushi@aidata.com',
        password: 'Intern@123',
        role: 'INTERN' as const,
        internRole: 'Frontend Developer',
        designation: 'Frontend Developer Intern',
        department: 'Software Architecture',
        accountStatus: 'INACTIVE' as const,
        offboardedAt: new Date('2026-09-15'),
        offboardReason: 'INTERNSHIP_COMPLETED',
        offboardNotes: 'Internship concluded. 100% of assigned atomic tokens and accessibility components finished (handover completed).',
      },
    ];

    for (const userData of demoUsers) {
      const user = new User(userData);
      await user.save();
    }
    console.log('✅ Seeded 9 demo accounts (including 3 offboarded members for Handover testing)');

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
        assignedMembersCount: 3,
        workItems: [
          {
            workItemId: 'WI-101',
            title: 'Data Ingestion & Feature Engineering Pipeline',
            role: 'Data Engineer',
            percentage: 25,
            status: 'DONE',
            assignedUserId: 'STF-102',
            assignedUserName: 'Nimal Jayawardena',
            completedAt: '2026-07-20',
          },
          {
            workItemId: 'WI-102',
            title: 'Model Architecture Design & XGBoost Training',
            role: 'AI Engineer',
            percentage: 25,
            status: 'DONE',
            assignedUserId: 'INT-204',
            assignedUserName: 'Kavindu Wickramasinghe',
            completedAt: '2026-08-15',
          },
          {
            workItemId: 'WI-103',
            title: 'Model Evaluation, ROC-AUC Analysis & Tuning',
            role: 'AI/ML Intern',
            percentage: 25,
            status: 'DONE',
            assignedUserId: 'INT-204',
            assignedUserName: 'Kavindu Wickramasinghe',
            completedAt: '2026-09-20',
          },
          {
            workItemId: 'WI-104',
            title: 'Inference REST API & Containerized Deployment',
            role: 'Software Engineer',
            percentage: 25,
            status: 'IN_PROGRESS',
            assignedUserId: 'INT-204',
            assignedUserName: 'Kavindu Wickramasinghe',
            handoverNotes: 'Internship concluded on 2026-09-30. Model trained, API endpoint scaffolded; requires container deployment & validation.',
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
        progress: 25,
        assignedMembersCount: 3,
        workItems: [
          {
            workItemId: 'WI-201',
            title: 'Telemetry Kafka Stream Producer Configuration',
            role: 'Backend Developer',
            percentage: 25,
            status: 'DONE',
            assignedUserId: 'STF-103',
            assignedUserName: 'Dilshan Senanayake',
            completedAt: '2026-08-10',
          },
          {
            workItemId: 'WI-202',
            title: 'Unsupervised Isolation Forest Baseline Model',
            role: 'Data Scientist',
            percentage: 25,
            status: 'TODO',
            assignedUserId: 'STF-101',
            assignedUserName: 'Dr. Kasun Perera',
          },
          {
            workItemId: 'WI-203',
            title: 'Real-time Anomaly Threshold Alerts Engine',
            role: 'Software Engineer',
            percentage: 25,
            status: 'TODO',
            assignedUserId: 'STF-103',
            assignedUserName: 'Dilshan Senanayake',
            handoverNotes: 'Contract concluded 2026-08-31. Telemetry ingestion complete; alert rules engine is mapped and awaiting handover reassignment.',
          },
          {
            workItemId: 'WI-204',
            title: 'Operations Dashboard & Incident Logging UI',
            role: 'Frontend Developer',
            percentage: 25,
            status: 'TODO',
            assignedUserId: 'INT-202',
            assignedUserName: 'Chamath Fernando',
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
        progress: 40,
        assignedMembersCount: 3,
        workItems: [
          {
            workItemId: 'WI-601',
            title: 'Accessible Atomic Component Primitives & Tokens',
            role: 'Frontend Developer',
            percentage: 40,
            status: 'DONE',
            assignedUserId: 'INT-205',
            assignedUserName: 'Tharushi Fernando',
            completedAt: '2026-09-10',
          },
          {
            workItemId: 'WI-602',
            title: 'Theme Provider & CSS Custom Properties Engine',
            role: 'Frontend Developer',
            percentage: 30,
            status: 'TODO',
            assignedUserId: 'INT-202',
            assignedUserName: 'Chamath Fernando',
          },
          {
            workItemId: 'WI-603',
            title: 'Visual Regression & Accessibility Audit Tests',
            role: 'QA',
            percentage: 30,
            status: 'TODO',
            assignedUserId: 'INT-203',
            assignedUserName: 'Ruwini Alwis',
          },
        ],
      },
    ];

    for (const projectData of demoProjects) {
      const project = new Project(projectData);
      await project.save();
    }
    console.log('✅ Seeded 6 Programme Projects (including unassigned and active streams)');

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
      // Assignments for Offboarded Interns & Staff (Completed vs Pending Handover)
      {
        assignmentId: 'ASG-104',
        projectId: 'PRJ-101',
        projectName: 'Customer Churn AI Prediction Model',
        userId: 'INT-204',
        userName: 'Kavindu Wickramasinghe',
        userCategory: 'Intern',
        professionalRole: 'AI/ML Intern',
        assignmentRole: 'Intern Contributor',
        startDate: '2026-04-01',
        expectedEndDate: '2026-09-30',
        status: 'Assigned',
        allocationNotes: 'Internship ended 2026-09-30. Completed model tuning (WI-102, WI-103); remaining deployment (WI-104) is pending handover.',
      },
      {
        assignmentId: 'ASG-105',
        projectId: 'PRJ-102',
        projectName: 'Telecom Network Anomaly Detection Pipeline',
        userId: 'STF-103',
        userName: 'Dilshan Senanayake',
        userCategory: 'Permanent Staff',
        professionalRole: 'Senior Backend Engineer',
        assignmentRole: 'Contributor',
        startDate: '2026-01-15',
        expectedEndDate: '2026-08-31',
        status: 'Assigned',
        allocationNotes: 'Contract tenure concluded 2026-08-31. Kafka telemetry stream (WI-201) completed; alerts engine (WI-203) awaiting reassignment.',
      },
      {
        assignmentId: 'ASG-106',
        projectId: 'PRJ-106',
        projectName: 'Enterprise Design System & Accessible Component Kit',
        userId: 'INT-205',
        userName: 'Tharushi Fernando',
        userCategory: 'Intern',
        professionalRole: 'Frontend Developer Intern',
        assignmentRole: 'Intern Contributor',
        startDate: '2026-03-15',
        expectedEndDate: '2026-09-15',
        status: 'Completed',
        allocationNotes: 'Internship successfully concluded on 2026-09-15. 100% of assigned atomic tokens and accessibility items delivered.',
      },
    ];

    for (const assignmentData of demoAssignments) {
      const assignment = new Assignment(assignmentData);
      await assignment.save();
    }
    console.log('✅ Seeded 6 Project Assignments (including active & offboarded handover assignments)');

    console.log('🎉 Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
};

seedDatabase();
