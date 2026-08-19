import { useState } from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  TrendingUp,
  History,
  User,
  ShieldCheck,
} from 'lucide-react';
import {
  DashboardLayout,
  PageHeader,
  type NavSection,
  type UserDisplayInfo,
} from '../../components/layout/DashboardLayout';
import { Card, Button, Badge, Alert } from '../../components/common';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const STAFF_NAVIGATION: NavSection[] = [
  {
    title: 'Staff Workspace',
    items: [
      {
        id: 'staff-overview',
        label: 'Staff Dashboard',
        path: '/staff/dashboard',
        icon: <LayoutDashboard className="w-4 h-4" />,
      },
      {
        id: 'staff-projects',
        label: 'Assigned Projects',
        path: '/staff/projects',
        icon: <FolderKanban className="w-4 h-4" />,
        badge: '2 Active',
        badgeVariant: 'blue',
      },
      {
        id: 'staff-tasks',
        label: 'My Tasks & Work',
        path: '/staff/tasks',
        icon: <CheckSquare className="w-4 h-4" />,
      },
    ],
  },
  {
    title: 'Progress & Records',
    items: [
      {
        id: 'staff-progress',
        label: 'Progress Updates',
        path: '/staff/progress',
        icon: <TrendingUp className="w-4 h-4" />,
      },
      {
        id: 'staff-history',
        label: 'Work History',
        path: '/staff/history',
        icon: <History className="w-4 h-4" />,
      },
      {
        id: 'staff-profile',
        label: 'My Profile',
        path: '/staff/profile',
        icon: <User className="w-4 h-4" />,
      },
    ],
  },
];

export default function StaffDashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showWelcome, setShowWelcome] = useState(true);

  const userDisplay: UserDisplayInfo = {
    name: user?.fullName || 'Dr. Kasun Perera',
    email: user?.email || 'kasun@aidata.com',
    roleLabel: 'Permanent Staff',
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <DashboardLayout
      navigation={STAFF_NAVIGATION}
      user={userDisplay}
      notificationsCount={1}
      onNotificationClick={() => {}}
      onProfileClick={() => {}}
      onLogoutClick={handleLogout}
    >
      <PageHeader
        title="Permanent Staff Dashboard"
        description="View your assigned projects, manage daily work, update milestone progress, and review work history."
        breadcrumbs={[{ label: 'Workspace' }, { label: 'Staff Dashboard' }]}
        badge={<Badge variant="success">Permanent Staff</Badge>}
        actions={
          <Button variant="primary" size="sm" leftIcon={<TrendingUp className="w-4 h-4" />}>
            Update Progress
          </Button>
        }
      />

      <div className="space-y-6">
        {showWelcome && (
          <Alert
            variant="success"
            title="Authentication Verified"
            onClose={() => setShowWelcome(false)}
          >
            Welcome, <strong>{user?.fullName}</strong>! You have securely logged in to your <strong>Permanent Staff</strong> workspace.
          </Alert>
        )}

        {/* Staff Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            {
              title: 'Assigned Projects',
              value: '2',
              subtext: 'Active pipeline engagements',
              badge: 'Assigned',
              badgeVariant: 'blue' as const,
            },
            {
              title: 'Active Tasks',
              value: '5',
              subtext: '2 in-progress · 3 pending review',
              badge: 'Sprint',
              badgeVariant: 'blue' as const,
            },
            {
              title: 'Supervised Interns',
              value: '1',
              subtext: 'Ayuni Sliit (Data Science)',
              badge: 'Supervisor',
              badgeVariant: 'success' as const,
            },
            {
              title: 'Overall Progress',
              value: '78%',
              subtext: 'On track for Q3 targets',
              badge: 'Healthy',
              badgeVariant: 'success' as const,
            },
          ].map((card) => (
            <Card key={card.title} padding="md" className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
                  {card.title}
                </span>
                <Badge size="sm" variant={card.badgeVariant}>
                  {card.badge}
                </Badge>
              </div>
              <p className="text-2xl font-bold text-[var(--color-brand-navy)]">
                {card.value}
              </p>
              <p className="text-xs text-[var(--color-text-secondary)]">
                {card.subtext}
              </p>
            </Card>
          ))}
        </div>

        {/* Info card */}
        <Card padding="lg" className="space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] pb-3">
            <div>
              <h2 className="text-base font-bold text-[var(--color-brand-navy)]">
                Staff Profile Information
              </h2>
              <p className="text-xs text-[var(--color-text-secondary)]">
                Verified enterprise identity retrieved from MongoDB database.
              </p>
            </div>
            <ShieldCheck className="w-5 h-5 text-[var(--color-brand-green)]" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-slate-500 font-medium">User ID</p>
              <p className="text-slate-800 font-bold mt-0.5">{user?.userId || 'STF-101'}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-slate-500 font-medium">Designation</p>
              <p className="text-slate-800 font-bold mt-0.5">{user?.designation || 'Senior AI Engineer'}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-slate-500 font-medium">Department</p>
              <p className="text-slate-800 font-bold mt-0.5">{user?.department || 'AI & Data'}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-slate-500 font-medium">Status</p>
              <Badge size="sm" variant="success" className="mt-0.5">ACTIVE</Badge>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
