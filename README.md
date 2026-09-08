# 🚀 AI & Data Programme Pipeline — Project Management System

[![Frontend](https://img.shields.io/badge/Frontend-React%2019%20%7C%20Vite%20%7C%20TailwindCSS%204%20%7C%20TypeScript-blue.svg)](./frontend)
[![Backend](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express%20%7C%20TypeScript%20%7C%20MongoDB-green.svg)](./backend)
[![License](https://img.shields.io/badge/License-MIT-purple.svg)](#)
[![Status](https://img.shields.io/badge/Status-Active%20Development-emerald.svg)](#)

A modern, full-stack enterprise project management and resource allocation portal tailored for **AI & Data Engineering Programme** teams. Built with **React 19**, **Vite**, **Tailwind CSS 4**, **Node.js**, **Express**, **TypeScript**, and **MongoDB**.

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Architecture & Tech Stack](#-architecture--tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup & Seeding](#backend-setup--seeding)
  - [Frontend Setup](#frontend-setup)
- [Demo Test Accounts](#-demo-test-accounts)
- [API Reference](#-api-reference)
- [Role-Based Access Control (RBAC) & Routes](#-role-based-access-control-rbac--routes)
- [BRD Functional Specifications Mapping](#-brd-functional-specifications-mapping)

---

## 🌟 Overview

The **AI & Data Programme Pipeline** provides an end-to-end management ecosystem designed to streamline resource allocation, task progress calculation, and project governance:

1. **Role-Based Portals**: Dedicated workspaces and governance interfaces for **System Administrators**, **Permanent Staff Engineers**, and **Intern Trainees**.
2. **Granular Work-Item Task Decomposition**: Decompose complex AI/Data projects into weighted percentage work-items with distinct status lifecycles (`TODO`, `IN_PROGRESS`, `BLOCKED`, `DONE`).
3. **Automated Progress Rollup**: Real-time project progress calculation calculated directly from granular work-item percentages and member contributions.
4. **Self-Enrollment & Role-Matching Engine**: Allows active interns and staff to explore unassigned project tracks and self-enroll with 1-click role verification matching their specialization.

---

## 🎯 Key Features

### 👑 System Administrator Portal
- **Executive Analytics Dashboard**: Real-time metrics on total projects, active allocations, resource utilization, and overall programme completion rates.
- **User Governance & Approval Workflows**: Onboard new users, review pending account registrations, and activate or suspend accounts.
- **Project Lifecycle Management**: Full CRUD operations for projects, supervisor assignment, technology stack tags, target dates, and priority weighting.
- **Granular Allocation & Work-Item Engine**: Allocate staff and interns to projects, define work items, and assign percentage completion weights.
- **Team Work History & Audit Logging**: Audit log tracking allocations, completed deliverables, and historical milestones.

### 💼 Permanent Staff Portal
- **Assigned Projects Overview**: Direct oversight of active projects where staff are assigned as Project Leads, Supervisors, or Contributors.
- **Work-Item Progress Submission**: Update task execution statuses, record percentage milestones, and log blockers.
- **Staff Work History**: Track personal project contributions, completed work items, and timeline milestones.

### 🎓 Intern Trainee Portal
- **Self-Enrollment Engine (BRD FR-15)**: Browse currently unassigned pipeline projects with 0 members and self-enroll into tracks matching their registered specialization (`AI/ML`, `Frontend Developer`, `Data Science`, `QA`).
- **Assigned Projects Workspace**: View assigned project details, supervisor contact info, and work-item responsibilities.
- **Progress Recording**: Update intern-allocated work items and monitor overall completion progress.
- **Profile & Track Management**: Manage intern profile, university details, and focus areas.

---

## 🛠 Architecture & Tech Stack

### Frontend
| Technology | Description |
| :--- | :--- |
| **React 19** | Modern UI components and declarative lifecycle state |
| **TypeScript** | Static typing and interfaces matching backend contracts |
| **Vite 8** | High-speed build tooling and Hot Module Replacement (HMR) |
| **Tailwind CSS 4** | Utility-first styling with modern glassmorphism aesthetic |
| **React Router v7** | Client-side role-guarded routing (`<ProtectedRoute />`) |
| **Lucide React** | Clean, accessible modern icon suite |

### Backend
| Technology | Description |
| :--- | :--- |
| **Node.js & Express** | RESTful API server with TypeScript compilation |
| **MongoDB & Mongoose** | Document database for users, projects, and assignments |
| **JWT & bcryptjs** | Secure authentication and password hashing |
| **ts-node-dev** | Fast developer server with automated live-reload |

---

## 📂 Project Structure

```
Ai-Data-Project-Management/
├── frontend/                          # React + Vite Client Application
│   ├── src/
│   │   ├── components/                # Shared UI primitives (Buttons, Cards, Badges, Modals)
│   │   ├── context/                   # AuthContext & global state providers
│   │   ├── layouts/                   # DashboardLayout & Navigation shells
│   │   ├── pages/
│   │   │   ├── admin/                 # Admin management pages & drawers
│   │   │   ├── staff/                 # Staff workspace & progress pages
│   │   │   ├── intern/                # Intern workspace & self-enrollment pages
│   │   │   ├── auth/                  # Login, Register, Activation, Password pages
│   │   │   └── public/                # Public Landing Page
│   │   ├── routes/                    # AppRoutes & ProtectedRoute guards
│   │   ├── services/                  # REST API client services
│   │   ├── types/                     # TypeScript types and interfaces
│   │   └── utils/                     # Formatting and calculation utilities
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                           # Node.js + Express + TypeScript API
│   ├── src/
│   │   ├── config/                    # MongoDB database connection configuration
│   │   ├── controllers/               # Route controllers (auth, user, project, assignment)
│   │   ├── middleware/                # Auth verification & role guards
│   │   ├── models/                    # Mongoose Data Models (User, Project, Assignment)
│   │   ├── routes/                    # Express API route declarations
│   │   ├── seed.ts                    # Database seeder with sample projects & accounts
│   │   └── server.ts                  # Main Express application entrypoint
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
└── README.md                          # Project Documentation
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18.x or higher)
- **npm** (v9.x or higher)
- **MongoDB** (Local instance or MongoDB Atlas URI)

---

### Backend Setup & Seeding

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install backend dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in `backend/` directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/ai-data-db?retryWrites=true&w=majority
   JWT_SECRET=your_jwt_secret_key_here
   ```

4. **Seed Database with Sample Data:**
   Run the automated database seeder to create test accounts, demo projects, and assignments:
   ```bash
   npm run seed
   ```

5. **Start Backend Server:**
   ```bash
   npm run dev
   ```
   *The backend API will start at `http://localhost:5000`.*

---

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install frontend dependencies:**
   ```bash
   npm install
   ```

3. **Start Frontend Development Server:**
   ```bash
   npm run dev
   ```
   *Open `http://localhost:5173` in your browser.*

---

## 🔑 Demo Test Accounts

The database seed (`npm run seed`) automatically creates the following demo credentials for immediate testing across all roles:

| Role | Username | Password | Full Name | Focus Track / Designation |
| :--- | :--- | :--- | :--- | :--- |
| **ADMIN** | `admin` | `Admin@123` | Akila Liyanage | Lead System Administrator |
| **STAFF** | `staff_kasun` | `Staff@123` | Dr. Kasun Perera | Senior AI Engineer |
| **STAFF** | `staff_nimal` | `Staff@123` | Nimal Jayawardena | Data Engineer |
| **INTERN** | `intern_ayuni` | `Intern@123` | Ayuni Sliit | **AI/ML** Intern |
| **INTERN** | `intern_chamath` | `Intern@123` | Chamath Fernando | **Frontend Developer** Intern |
| **INTERN** | `intern_ruwini` | `Intern@123` | Ruwini Alwis | **QA** Intern |

---

## 📡 API Reference

### Authentication (`/api/auth`)
- `POST /api/auth/login` — User authentication & JWT token generation
- `POST /api/auth/register` — Self-registration for interns/staff (status `PENDING`)
- `POST /api/auth/activate` — Account verification with invitation token
- `POST /api/auth/change-password` — Authenticated password reset

### User Management (`/api/users`)
- `GET /api/users` — Fetch all users (Admin only)
- `POST /api/users` — Create/Invite a user directly (Admin only)
- `PUT /api/users/:id` — Update user details or account status (`ACTIVE`, `PENDING`, `REJECTED`)
- `DELETE /api/users/:id` — Delete a user

### Project Management (`/api/projects`)
- `GET /api/projects` — List all pipeline projects with work items
- `POST /api/projects` — Create a new project with work-item decomposition
- `PUT /api/projects/:id` — Update project details, work items, and target dates
- `DELETE /api/projects/:id` — Delete a project

### Resource Allocation & Self-Enrollment (`/api/assignments`)
- `GET /api/assignments` — List all project allocations (filterable by user / project)
- `POST /api/assignments` — Assign user to a project (Admin only)
- `POST /api/assignments/self-enroll` — **1-Click Self-Enrollment** for unassigned project tracks with role verification
- `PUT /api/assignments/:id` — Update assignment role / status
- `DELETE /api/assignments/:id` — Remove an assignment

---

## 🗺 Role-Based Access Control (RBAC) & Routes

| URL Route | Allowed Roles | Description |
| :--- | :--- | :--- |
| `/` | Public | Public landing page with portal overview |
| `/login` | Public | Unified authentication login |
| `/register` | Public | Self-registration form for new trainees/staff |
| `/admin/dashboard` | `ADMIN` | Executive KPI analytics & summary charts |
| `/admin/users` | `ADMIN` | User accounts, approval & verification management |
| `/admin/projects` | `ADMIN` | Project creation & work-item breakdown drawer |
| `/admin/assignments` | `ADMIN` | Team allocation & role mapping table |
| `/admin/progress` | `ADMIN` | Programme completion progress tracking |
| `/admin/work-history` | `ADMIN` | Comprehensive team work history and audit log |
| `/staff/dashboard` | `PERMANENT_STAFF` | Staff workspace & active project metrics |
| `/staff/projects` | `PERMANENT_STAFF` | Assigned projects & work items overview |
| `/staff/work-items` | `PERMANENT_STAFF` | Task execution status & progress updates |
| `/intern/dashboard` | `INTERN` | Intern task summary & progress statistics |
| `/intern/projects` | `INTERN` | Assigned projects & **Self-Enrollment** portal |
| `/intern/work-items` | `INTERN` | Granular work items task tracker |

---

## 📋 BRD Functional Specifications Mapping

- **FR-01 to FR-04**: Role-based access control, registration, and credential security.
- **FR-05 to FR-07**: Project creation, metadata governance, and supervisor assignment.
- **FR-08 to FR-10**: Granular work-item decomposition with percentage weight distribution.
- **FR-11 to FR-13**: Resource allocation, assignment lifecycle, and progress aggregation.
- **FR-14 to FR-15**: **Role Matching & 1-Click Self-Enrollment Engine** for available pipeline projects.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
