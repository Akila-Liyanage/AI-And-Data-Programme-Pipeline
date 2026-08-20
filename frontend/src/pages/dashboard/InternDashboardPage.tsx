import { useState } from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Sparkles,
  History,
  User,
  ShieldCheck,
  Award,
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

const INTERN_NAVIGATION: NavSection[] = [
  {
    title: 'Intern Portal',
    items: [
      {
        id: 'intern-overview',
        label: 'Intern Dashboard',
        path: '/intern/dashboard',
        icon: <LayoutDashboard className="w-4 h-4" />,
      },
      {
        id: 'intern-projects',
        label: 'My Project',
        path: '/intern/projects',
        icon: <FolderKanban className="w-4 h-4" />,
        badge: 'Assigned',
        badgeVariant: 'blue',
      },
      {
        id: 'intern-enrollment',
        label: 'Available Projects',
        path: '/intern/enrollment',
        icon: <Sparkles className="w-4 h-4" />,
      },
      {
        id: 'intern-tasks',
        label: 'Assigned Tasks',
        path: '/intern/tasks',
        icon: <CheckSquare className="w-4 h-4" />,
      },
    ],
  },
  {
    title: 'Growth & Records',
    items: [
      {
        id: 'intern-history',
        label: 'Work History',
        path: '/intern/history',
        icon: <History className="w-4 h-4" />,
      },
      {
        id: 'intern-profile',
        label: 'Profile & Skills',
        path: '/intern/profile',
        icon: <User className="w-4 h-4" />,
      },
    ],
  },
];

export default function InternDashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showWelcome, setShowWelcome] = useState(true);

  const userDisplay: UserDisplayInfo = {
    name: user?.fullName || 'Ayuni Sliit',
    email: user?.email || 'ayuni@aidata.com',
    roleLabel: 'Intern',
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <DashboardLayout
      navigation={INTERN_NAVIGATION}
      user={userDisplay}
      notificationsCount={1}
      onNotificationClick={() => {}}
      onProfileClick={() => {}}
      onLogoutClick={handleLogout}
    >
      <PageHeader
        title="Intern Progress Dashboard"
        description="Track your current project milestones, view eligible projects for enrollment, and build your work history."
        breadcrumbs={[{ label: 'Internship' }, { label: 'Intern Dashboard' }]}
        badge={<Badge variant="blue">Internship Programme</Badge>}
        actions={
          <Button variant="primary" size="sm" leftIcon={<Award className="w-4 h-4" />}>
            Log Work Update
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
            Welcome, <strong>{user?.fullName}</strong>! You have securely logged in to the <strong>AI & Data Internship Dashboard</strong>.
          </Alert>
        )}

        {/* Intern Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            {
              title: 'Current Project',
              value: '1',
              subtext: 'AI Pipeline Optimization',
              badge: 'Ongoing',
              badgeVariant: 'success' as const,
            },
            {
              title: 'Assigned Supervisor',
              value: 'Kasun P.',
              subtext: 'Senior AI Engineer',
              badge: 'Mentor',
              badgeVariant: 'blue' as const,
            },
            {
              title: 'Tasks Completed',
              value: '6/8',
              subtext: '75% Sprint milestone',
              badge: 'Sprint 2',
              badgeVariant: 'blue' as const,
            },
            {
              title: 'Programme Milestone',
              value: 'Month 2',
              subtext: 'On schedule for completion',
              badge: 'Good Standing',
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

        {/* Intern Profile & Details */}
        <Card padding="lg" className="space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] pb-3">
            <div>
              <h2 className="text-base font-bold text-[var(--color-brand-navy)]">
                Intern Details & Allocation
              </h2>
              <p className="text-xs text-[var(--color-text-secondary)]">
                Verified intern record loaded dynamically from MongoDB.
              </p>
            </div>
            <ShieldCheck className="w-5 h-5 text-[var(--color-brand-green)]" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-slate-500 font-medium">Intern ID</p>
              <p className="text-slate-800 font-bold mt-0.5">{user?.userId || 'INT-201'}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-slate-500 font-medium">Intern Role</p>
              <p className="text-slate-800 font-bold mt-0.5">{user?.designation || 'Data Science Intern'}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-slate-500 font-medium">Department</p>
              <p className="text-slate-800 font-bold mt-0.5">{user?.department || 'AI & Data Team'}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-slate-500 font-medium">Enrolment Status</p>
              <Badge size="sm" variant="success" className="mt-0.5">ACTIVE</Badge>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
