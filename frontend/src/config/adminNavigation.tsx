import {
  LayoutDashboard,
  Users,
  FolderKanban,
  UserCheck,
  TrendingUp,
  History,
  User,
} from 'lucide-react';
import type { NavSection } from '../components/layout/DashboardLayout';

export const ADMIN_NAVIGATION: NavSection[] = [
  {
    title: 'Administration',
    items: [
      {
        id: 'admin-overview',
        label: 'Dashboard',
        path: '/admin/dashboard',
        icon: <LayoutDashboard className="w-4 h-4" />,
      },
      {
        id: 'admin-users',
        label: 'User Management',
        path: '/admin/users',
        icon: <Users className="w-4 h-4" />,
      },
      {
        id: 'admin-projects',
        label: 'Projects Management',
        path: '/admin/projects',
        icon: <FolderKanban className="w-4 h-4" />,
      },
      {
        id: 'admin-assignments',
        label: 'Project Assignments',
        path: '/admin/assignments',
        icon: <UserCheck className="w-4 h-4" />,
      },
    ],
  },
  {
    title: 'Monitoring',
    items: [
      {
        id: 'admin-progress',
        label: 'Programme Progress',
        path: '/admin/progress',
        icon: <TrendingUp className="w-4 h-4" />,
      },
      {
        id: 'admin-work-history',
        label: 'Team Work History',
        path: '/admin/work-history',
        icon: <History className="w-4 h-4" />,
      },
      {
        id: 'admin-profile',
        label: 'My Profile',
        path: '/admin/profile',
        icon: <User className="w-4 h-4" />,
      },
    ],
  },
];

