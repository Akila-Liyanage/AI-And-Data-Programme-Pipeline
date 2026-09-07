import { useState } from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  TrendingUp,
  History,
  User,
  Search,
  RotateCcw,
  CheckCircle2,
  KanbanSquare,
  TableProperties,
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
import { InternWorkItemDetailsDrawer, type InternWorkItem } from './components/InternWorkItemDetailsDrawer';

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
      },
      {
        id: 'intern-history',
        label: 'Work History',
        path: '/intern/work-history',
        icon: <History className="w-4 h-4" />,
      },
      {
        id: 'intern-profile',
        label: 'My Profile',
        path: '/intern/profile',
        icon: <User className="w-4 h-4" />,
      },
    ],
  },
];

export default function InternWorkItemsPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  /* View Mode: Board (default) vs Table */
  const [viewMode, setViewMode] = useState<'BOARD' | 'TABLE'>('BOARD');

  /* Filtering States */
  const [searchQuery, setSearchQuery] = useState('');
  const [projectFilter, setProjectFilter] = useState('ALL');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  /* Modals & Drawer States */
  const [selectedItem, setSelectedItem] = useState<InternWorkItem | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isConfirmingStart, setIsConfirmingStart] = useState(false);
  const [isConfirmingComplete, setIsConfirmingComplete] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  /* Empty array for actual work items (no mock/fake data) */
  const [workItems] = useState<InternWorkItem[]>([]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const userDisplay: UserDisplayInfo = {
    name: user?.fullName || '—',
    email: user?.email || '—',
    roleLabel: 'Intern',
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setProjectFilter('ALL');
    setRoleFilter('ALL');
    setStatusFilter('ALL');
  };

  const handleStartWork = (item: InternWorkItem) => {
    setSelectedItem(item);
    setIsConfirmingStart(true);
  };

  const handleCompleteWork = (item: InternWorkItem) => {
    setSelectedItem(item);
    setIsConfirmingComplete(true);
  };

  const executeConfirmStart = () => {
    setIsConfirmingStart(false);
    setActionNotice('Work item started successfully.');
    setTimeout(() => setActionNotice(null), 4000);
  };

  const executeConfirmComplete = () => {
    setIsConfirmingComplete(false);
    setActionNotice('Work item completed successfully.');
    setTimeout(() => setActionNotice(null), 4000);
  };

  /* Filter items matching the filter fields */
  const filteredItems = workItems.filter((item) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        item.title.toLowerCase().includes(q) ||
        item.projectName.toLowerCase().includes(q);
      if (!matchesSearch) return false;
    }

    if (projectFilter !== 'ALL' && item.projectName !== projectFilter) return false;
    if (roleFilter !== 'ALL' && item.requiredRole !== roleFilter) return false;
    if (statusFilter !== 'ALL') {
      if (statusFilter === 'NOT_STARTED' && item.status !== 'NOT_STARTED') return false;
      if (statusFilter === 'IN_PROGRESS' && item.status !== 'IN_PROGRESS') return false;
      if (statusFilter === 'COMPLETED' && item.status !== 'COMPLETED') return false;
    }

    return true;
  });

  const notStartedItems = filteredItems.filter((i) => i.status === 'NOT_STARTED');
  const inProgressItems = filteredItems.filter((i) => i.status === 'IN_PROGRESS');
  const completedItems = filteredItems.filter((i) => i.status === 'COMPLETED');

  return (
    <DashboardLayout
      navigation={INTERN_NAVIGATION}
      user={userDisplay}
      notificationsCount={0}
      onLogoutClick={handleLogout}
    >
      {/* Page Header */}
      <PageHeader
        title="My Work Items"
        description="View work items assigned to you, track their status and understand how completed work contributes to project progress."
        breadcrumbs={[
          { label: 'Workspace' },
          { label: 'My Work Items' },
        ]}
        badge={<Badge variant="neutral">Intern</Badge>}
        actions={
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('BOARD')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all focus:outline-none ${
                viewMode === 'BOARD'
                  ? 'bg-white text-[var(--color-brand-navy)] shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              aria-label="Switch to Board View"
            >
              <KanbanSquare className="w-4 h-4" />
              Board View
            </button>
            <button
              onClick={() => setViewMode('TABLE')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all focus:outline-none ${
                viewMode === 'TABLE'
                  ? 'bg-white text-[var(--color-brand-navy)] shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              aria-label="Switch to Table View"
            >
              <TableProperties className="w-4 h-4" />
              Table View
            </button>
          </div>
        }
      />

      <div className="space-y-6">
        {/* Action status message popup alert */}
        {actionNotice && (
          <Alert variant="info" title="Workspace Notice" onClose={() => setActionNotice(null)}>
            {actionNotice}
          </Alert>
        )}

        {/* ── SUMMARY CARDS SECTION (No fake counts) ─────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card padding="md" className="space-y-2 border border-slate-100 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-[var(--color-text-secondary)]">
              Assigned Work Items
            </span>
            <p className="text-2xl font-bold text-[var(--color-brand-navy)]">—</p>
            <p className="text-[11px] text-[var(--color-text-secondary)]">No data available yet</p>
          </Card>

          <Card padding="md" className="space-y-2 border border-slate-100 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-[var(--color-text-secondary)]">
              Not Started
            </span>
            <p className="text-2xl font-bold text-[var(--color-brand-navy)]">—</p>
            <p className="text-[11px] text-[var(--color-text-secondary)]">No data available yet</p>
          </Card>

          <Card padding="md" className="space-y-2 border border-slate-100 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-[var(--color-text-secondary)]">
              In Progress
            </span>
            <p className="text-2xl font-bold text-[var(--color-brand-navy)]">—</p>
            <p className="text-[11px] text-[var(--color-text-secondary)]">No data available yet</p>
          </Card>

          <Card padding="md" className="space-y-2 border border-slate-100 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-[var(--color-text-secondary)]">
              Completed
            </span>
            <p className="text-2xl font-bold text-[var(--color-brand-navy)]">—</p>
            <p className="text-[11px] text-[var(--color-text-secondary)]">No data available yet</p>
          </Card>
        </div>

        {/* ── FILTERS SECTION (No fake projects/options) ────────────────── */}
        <Card padding="md" className="border border-slate-100 shadow-2xs">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 flex-1">
              {/* Search Query */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search work items or projects"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[var(--color-brand-blue)] focus:ring-2 focus:ring-[var(--color-brand-blue)]/10"
                />
              </div>

              {/* Project Filter */}
              <select
                value={projectFilter}
                onChange={(e) => setProjectFilter(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none focus:border-[var(--color-brand-blue)] focus:ring-2 focus:ring-[var(--color-brand-blue)]/10"
              >
                <option value="ALL">All Projects</option>
              </select>

              {/* Required Role Filter */}
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none focus:border-[var(--color-brand-blue)] focus:ring-2 focus:ring-[var(--color-brand-blue)]/10"
              >
                <option value="ALL">All Roles</option>
                <option value="Business Analyst">Business Analyst</option>
                <option value="Frontend Developer">Frontend Developer</option>
                <option value="Backend Developer">Backend Developer</option>
                <option value="QA">QA</option>
                <option value="AI/ML">AI/ML</option>
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none focus:border-[var(--color-brand-blue)] focus:ring-2 focus:ring-[var(--color-brand-blue)]/10"
              >
                <option value="ALL">All Statuses</option>
                <option value="NOT_STARTED">Not Started</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>

            <Button
              variant="outline"
              size="sm"
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              onClick={handleResetFilters}
              className="lg:self-end"
            >
              Reset Filters
            </Button>
          </div>
        </Card>

        {/* ── BOARD VIEW (KANBAN) ──────────────────────────────────────── */}
        {viewMode === 'BOARD' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* NOT STARTED COLUMN */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b-2 border-amber-500 pb-2">
                <span className="text-xs font-bold text-[var(--color-brand-navy)] flex items-center gap-1.5">
                  Not Started
                  <Badge variant="warning" size="sm">0</Badge>
                </span>
              </div>
              <div className="space-y-3">
                {notStartedItems.length === 0 ? (
                  <div className="p-6 rounded-xl border border-dashed border-slate-200 text-center space-y-1 bg-slate-50/50">
                    <p className="text-xs font-semibold text-slate-500">No work items waiting to start</p>
                    <p className="text-[10px] text-slate-400">Assigned items will appear here.</p>
                  </div>
                ) : (
                  notStartedItems.map((item) => (
                    <Card key={item.id} padding="sm" className="space-y-3 shadow-2xs hover:shadow-xs transition-shadow">
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-[var(--color-brand-navy)]">{item.title}</p>
                        <p className="text-[10px] text-[var(--color-text-secondary)]">{item.projectName}</p>
                      </div>
                      <div className="flex flex-wrap gap-1.5 text-[10px]">
                        <Badge variant="blue">{item.requiredRole}</Badge>
                        <Badge variant="neutral">{item.percentageWeight}% Weight</Badge>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                        <span className="text-[10px] text-slate-400">{item.targetDate}</span>
                        <div className="flex items-center gap-1.5">
                          <Button variant="outline" size="sm" onClick={() => { setSelectedItem(item); setIsDetailsOpen(true); }}>
                            Details
                          </Button>
                          <Button variant="primary" size="sm" onClick={() => handleStartWork(item)}>
                            Start Work
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>

            {/* IN PROGRESS COLUMN */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b-2 border-blue-500 pb-2">
                <span className="text-xs font-bold text-[var(--color-brand-navy)] flex items-center gap-1.5">
                  In Progress
                  <Badge variant="blue" size="sm">0</Badge>
                </span>
              </div>
              <div className="space-y-3">
                {inProgressItems.length === 0 ? (
                  <div className="p-6 rounded-xl border border-dashed border-slate-200 text-center space-y-1 bg-slate-50/50">
                    <p className="text-xs font-semibold text-slate-500">No work items in progress</p>
                    <p className="text-[10px] text-slate-400">Move tasks here to begin progress.</p>
                  </div>
                ) : (
                  inProgressItems.map((item) => (
                    <Card key={item.id} padding="sm" className="space-y-3 shadow-2xs hover:shadow-xs transition-shadow">
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-[var(--color-brand-navy)]">{item.title}</p>
                        <p className="text-[10px] text-[var(--color-text-secondary)]">{item.projectName}</p>
                      </div>
                      <div className="flex flex-wrap gap-1.5 text-[10px]">
                        <Badge variant="blue">{item.requiredRole}</Badge>
                        <Badge variant="neutral">{item.percentageWeight}% Weight</Badge>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                        <span className="text-[10px] text-slate-400">{item.targetDate}</span>
                        <div className="flex items-center gap-1.5">
                          <Button variant="outline" size="sm" onClick={() => { setSelectedItem(item); setIsDetailsOpen(true); }}>
                            Details
                          </Button>
                          <Button variant="primary" size="sm" onClick={() => handleCompleteWork(item)}>
                            Complete
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>

            {/* COMPLETED COLUMN */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b-2 border-emerald-500 pb-2">
                <span className="text-xs font-bold text-[var(--color-brand-navy)] flex items-center gap-1.5">
                  Completed
                  <Badge variant="success" size="sm">0</Badge>
                </span>
              </div>
              <div className="space-y-3">
                {completedItems.length === 0 ? (
                  <div className="p-6 rounded-xl border border-dashed border-slate-200 text-center space-y-1 bg-slate-50/50">
                    <p className="text-xs font-semibold text-slate-500">No completed work items</p>
                    <p className="text-[10px] text-slate-400">Successfully closed tasks appear here.</p>
                  </div>
                ) : (
                  completedItems.map((item) => (
                    <Card key={item.id} padding="sm" className="space-y-3 shadow-2xs hover:shadow-xs transition-shadow">
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-[var(--color-brand-navy)]">{item.title}</p>
                        <p className="text-[10px] text-[var(--color-text-secondary)]">{item.projectName}</p>
                      </div>
                      <div className="flex flex-wrap gap-1.5 text-[10px]">
                        <Badge variant="blue">{item.requiredRole}</Badge>
                        <Badge variant="neutral">{item.percentageWeight}% Weight</Badge>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                        <span className="text-[10px] text-slate-400">{item.targetDate}</span>
                        <Button variant="outline" size="sm" onClick={() => { setSelectedItem(item); setIsDetailsOpen(true); }} fullWidth>
                          View Details
                        </Button>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>

          </div>
        ) : (
          /* ── TABLE VIEW ────────────────────────────────────────────── */
          <Card padding="none" className="border border-slate-100 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse" aria-label="Assigned Work Items Table">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    <th scope="col" className="py-3 px-4">Work Item</th>
                    <th scope="col" className="py-3 px-4">Project</th>
                    <th scope="col" className="py-3 px-4">Required Role</th>
                    <th scope="col" className="py-3 px-4">Weight</th>
                    <th scope="col" className="py-3 px-4">Status</th>
                    <th scope="col" className="py-3 px-4">Progress Contribution</th>
                    <th scope="col" className="py-3 px-4">Target Date</th>
                    <th scope="col" className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8">
                        <EmptyState
                          icon={<CheckSquare className="w-8 h-8 text-slate-400" />}
                          title="No assigned work items yet"
                          description="Work items assigned to you will appear here."
                        />
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-4 font-bold text-[var(--color-brand-navy)]">{item.title}</td>
                        <td className="py-3 px-4">{item.projectName}</td>
                        <td className="py-3 px-4">{item.requiredRole}</td>
                        <td className="py-3 px-4">{item.percentageWeight}%</td>
                        <td className="py-3 px-4">
                          <Badge variant={item.status === 'COMPLETED' ? 'success' : (item.status === 'IN_PROGRESS' ? 'blue' : 'warning')}>
                            {item.status.replace('_', ' ')}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 font-bold text-emerald-600">
                          {item.status === 'COMPLETED' ? `${item.percentageWeight}%` : '0%'}
                        </td>
                        <td className="py-3 px-4 font-mono">{item.targetDate}</td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button variant="outline" size="sm" onClick={() => { setSelectedItem(item); setIsDetailsOpen(true); }}>
                              View Details
                            </Button>
                            {item.status === 'NOT_STARTED' && (
                              <Button variant="primary" size="sm" onClick={() => handleStartWork(item)}>
                                Start
                              </Button>
                            )}
                            {item.status === 'IN_PROGRESS' && (
                              <Button variant="primary" size="sm" onClick={() => handleCompleteWork(item)}>
                                Complete
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        )}

      </div>

      {/* Details Drawer */}
      <InternWorkItemDetailsDrawer
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedItem(null);
        }}
        workItem={selectedItem}
      />

      {/* Start Work Confirmation Modal */}
      {isConfirmingStart && (
        <div className="fixed inset-0 z-60 overflow-y-auto" role="dialog" aria-modal="true" aria-labelledby="confirm-start-title">
          <div className="min-h-screen px-4 flex items-center justify-center">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity" onClick={() => setIsConfirmingStart(false)} aria-hidden="true" />
            <div className="relative bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 z-10 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[var(--color-brand-blue)] flex items-center justify-center shrink-0">
                  <Info className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <h3 id="confirm-start-title" className="text-sm font-bold text-[var(--color-brand-navy)]">
                    Start this work item?
                  </h3>
                  <p className="text-slate-500 leading-relaxed">
                    This work item will move to In Progress.
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => setIsConfirmingStart(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" onClick={executeConfirmStart}>
                  Start Work
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mark Completed Confirmation Modal */}
      {isConfirmingComplete && (
        <div className="fixed inset-0 z-60 overflow-y-auto" role="dialog" aria-modal="true" aria-labelledby="confirm-complete-title">
          <div className="min-h-screen px-4 flex items-center justify-center">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity" onClick={() => setIsConfirmingComplete(false)} aria-hidden="true" />
            <div className="relative bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 z-10 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <h3 id="confirm-complete-title" className="text-sm font-bold text-[var(--color-brand-navy)]">
                    Mark this work item as completed?
                  </h3>
                  <p className="text-slate-500 leading-relaxed">
                    Once completed, this work item's assigned weight will contribute to the project's progress.
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => setIsConfirmingComplete(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" onClick={executeConfirmComplete}>
                  Mark as Completed
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
