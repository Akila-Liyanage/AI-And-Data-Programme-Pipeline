import { useState } from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  TrendingUp,
  History,
  User,
  ShieldCheck,
  Info,
} from 'lucide-react';
import {
  DashboardLayout,
  PageHeader,
  type NavSection,
  type UserDisplayInfo,
} from '../../components/layout/DashboardLayout';
import { Card, Button, Badge, Alert, EmptyState } from '../../components/common';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const INTERN_NAVIGATION: NavSection[] = [
  {
    title: 'Intern Workspace',
    items: [
      {
        id: 'intern-overview',
        label: 'Intern Dashboard',
        path: '/intern/dashboard',
        icon: <LayoutDashboard className="w-4 h-4" />,
      },
      {
        id: 'intern-projects',
        label: 'Assigned Projects',
        path: '/intern/projects',
        icon: <FolderKanban className="w-4 h-4" />,
      },
      {
        id: 'intern-work-items',
        label: 'My Work Items',
        path: '/intern/work-items',
        icon: <CheckSquare className="w-4 h-4" />,
        disabled: true,
      },
    ],
  },
  {
    title: 'Progress & Records',
    items: [
      {
        id: 'intern-progress',
        label: 'Work Progress',
        path: '/intern/progress',
        icon: <TrendingUp className="w-4 h-4" />,
        disabled: true,
      },
      {
        id: 'intern-history',
        label: 'Work History',
        path: '/intern/history',
        icon: <History className="w-4 h-4" />,
        disabled: true,
      },
      {
        id: 'intern-profile',
        label: 'My Profile',
        path: '/intern/profile',
        icon: <User className="w-4 h-4" />,
        disabled: true,
      },
    ],
  },
];

export default function InternDashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showWelcome, setShowWelcome] = useState(true);

  const userDisplay: UserDisplayInfo = {
    name: user?.fullName || '—',
    email: user?.email || '—',
    roleLabel: 'Intern',
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return <Badge variant="neutral">Pending Verification</Badge>;
    switch (status.toLowerCase()) {
      case 'verified':
      case 'active':
        return <Badge variant="success">Verified</Badge>;
      case 'pending':
      case 'pending verification':
        return <Badge variant="warning">Pending Verification</Badge>;
      case 'rejected':
        return <Badge variant="error">Rejected</Badge>;
      default:
        return <Badge variant="info">{status}</Badge>;
    }
  };

  return (
    <DashboardLayout
      navigation={INTERN_NAVIGATION}
      user={userDisplay}
      notificationsCount={0}
      onNotificationClick={() => {}}
      onProfileClick={() => {}}
      onLogoutClick={handleLogout}
    >
      <PageHeader
        title="Intern Dashboard"
        description="View your assigned projects, manage your work items, track your contribution and review your work history."
        breadcrumbs={[{ label: 'Workspace' }, { label: 'Intern Dashboard' }]}
        badge={<Badge variant="blue">Intern</Badge>}
      />

      <div className="space-y-6">
        {showWelcome && (
          <Alert
            variant="success"
            title="Secure Session Established"
            onClose={() => setShowWelcome(false)}
          >
            Welcome, <strong>{user?.fullName || '—'}</strong>. You are signed in to your Intern workspace.
          </Alert>
        )}

        {/* ── 1. SUMMARY CARDS ─────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            {
              title: 'Assigned Projects',
              value: '—',
              subtext: 'No data available yet',
              badge: 'Projects',
              badgeVariant: 'blue' as const,
            },
            {
              title: 'Assigned Work Items',
              value: '—',
              subtext: 'No data available yet',
              badge: 'Tasks',
              badgeVariant: 'blue' as const,
            },
            {
              title: 'Completed Work Items',
              value: '—',
              subtext: 'No data available yet',
              badge: 'Completed',
              badgeVariant: 'success' as const,
            },
            {
              title: 'Overall Contribution',
              value: '—',
              subtext: 'No data available yet',
              badge: 'Contribution',
              badgeVariant: 'success' as const,
            },
          ].map((card) => (
            <Card key={card.title} padding="md" className="space-y-3 shadow-2xs">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* ── 2. ASSIGNED PROJECTS OVERVIEW ─────────────────────── */}
            <Card padding="none" title="Assigned Projects" subtitle="Active project structures and roles assigned to you" className="shadow-2xs border border-slate-100 overflow-hidden">
              <div className="p-8">
                <EmptyState
                  icon={<FolderKanban className="w-8 h-8 text-slate-400" />}
                  title="No assigned projects yet"
                  description="Projects assigned to you will appear here."
                  action={
                    <Button variant="outline" size="sm" onClick={() => navigate('/intern/projects')}>
                      View Assigned Projects
                    </Button>
                  }
                />
              </div>
            </Card>

            {/* ── 3. MY WORK ITEMS OVERVIEW ─────────────────────────── */}
            <Card padding="none" title="My Work Items" subtitle="Tasks assigned to you under active project allocations" className="shadow-2xs border border-slate-100 overflow-hidden">
              <div className="p-8">
                <EmptyState
                  icon={<CheckSquare className="w-8 h-8 text-slate-400" />}
                  title="No work items assigned yet"
                  description="Your assigned work items will appear here."
                  action={
                    <Button variant="outline" size="sm" disabled title="Coming soon">
                      View My Work Items
                    </Button>
                  }
                />
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            {/* ── 4. INTERN PROFILE SUMMARY ────────────────────────── */}
            <Card title="Account Summary" subtitle="Verified intern workspace account details" className="shadow-2xs">
              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-[var(--color-border-subtle)]">
                  <div className="w-10 h-10 rounded-full bg-[var(--color-brand-blue)]/10 text-[var(--color-brand-navy)] flex items-center justify-center font-bold text-sm border border-[var(--color-brand-blue)]/20 shadow-sm shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-[var(--color-brand-navy)] truncate">
                      {user?.fullName || '—'}
                    </h3>
                    <p className="text-[10px] text-[var(--color-text-secondary)] truncate">
                      {user?.email || '—'}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Intern ID</span>
                    <span className="font-bold text-slate-800">{user?.userId || '—'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Intern Role</span>
                    <span className="font-bold text-slate-800">{user?.designation || '—'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Department</span>
                    <span className="font-bold text-slate-800">{user?.department || '—'}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                    <span className="text-slate-500 font-medium">Verification Status</span>
                    <div>{getStatusBadge(user?.accountStatus)}</div>
                  </div>
                </div>

                <div className="p-2.5 bg-blue-50/60 border border-blue-100 rounded-lg flex items-start gap-2 text-blue-800 text-[10px] leading-normal font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <span>Your workspace parameters are authorized by administrator verification tags.</span>
                </div>
              </div>
            </Card>

            {/* ── 5. WORK PROGRESS OVERVIEW ────────────────────────── */}
            <Card title="Work Progress" subtitle="Contribution tracking towards milestones" className="shadow-2xs">
              <div className="space-y-4">
                <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-lg flex items-start gap-2.5 text-blue-800 text-xs leading-normal">
                  <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <p className="font-medium">
                    Completed work items contribute to project progress based on their assigned percentage weight.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs font-semibold text-slate-700">
                  <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="text-[10px] text-slate-500 font-medium block">Assigned</span>
                    <span className="font-bold text-slate-600 block mt-0.5">—</span>
                  </div>
                  <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="text-[10px] text-slate-500 font-medium block">Completed</span>
                    <span className="font-bold text-[var(--color-brand-green)] block mt-0.5">—</span>
                  </div>
                  <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="text-[10px] text-slate-500 font-medium block">Weight</span>
                    <span className="font-bold text-[var(--color-brand-blue)] block mt-0.5">—</span>
                  </div>
                </div>

                <Button variant="outline" size="sm" className="w-full" disabled title="Coming soon">
                  View Work Progress
                </Button>
              </div>
            </Card>

            {/* ── 6. RECENT WORK HISTORY ───────────────────────────── */}
            <Card title="Recent Work History" subtitle="Preview of completed deliverables" className="shadow-2xs">
              <div className="space-y-4">
                <EmptyState
                  icon={<History className="w-6 h-6 text-slate-400" />}
                  title="No work history available"
                  description="Your completed work will appear here."
                />

                <Button variant="outline" size="sm" className="w-full" disabled title="Coming soon">
                  View Work History
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
