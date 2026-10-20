import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  Clock,
  ArrowRightLeft,
  AlertTriangle,
  FolderKanban,
  Calendar,
  Send,
  Zap,
  Check,
  Award,
} from 'lucide-react';
import { Button, Badge, Alert } from '../../../components/common';
import type {
  OffboardedUser,
  ActiveCandidate,
  WorkItemDetail,
} from '../../../types/handoverManagement.types';

const API_BASE_URL = 'http://localhost:5000/api';

export interface HandoverDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: OffboardedUser | null;
  activeCandidates: ActiveCandidate[];
  onHandoverSuccess: () => void;
}

export const HandoverDrawer: React.FC<HandoverDrawerProps> = ({
  isOpen,
  onClose,
  user,
  activeCandidates,
  onHandoverSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'PENDING' | 'COMPLETED'>('PENDING');

  // Bulk Reassign state
  const [bulkTargetUserId, setBulkTargetUserId] = useState<string>('');
  const [bulkNotes, setBulkNotes] = useState<string>('');
  const [isBulkSubmitting, setIsBulkSubmitting] = useState(false);

  // Individual Reassign state (mapped by workItemId or assignmentId)
  const [selectedTargetUsers, setSelectedTargetUsers] = useState<Record<string, string>>({});
  const [individualNotes, setIndividualNotes] = useState<Record<string, string>>({});
  const [submittingItemId, setSubmittingItemId] = useState<string | null>(null);

  // Status feedback alert
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  // Reset tab & feedback when selected user changes
  useEffect(() => {
    if (user) {
      setActiveTab(user.pendingTasksCount > 0 ? 'PENDING' : 'COMPLETED');
      setFeedback(null);
      setBulkTargetUserId(activeCandidates.length > 0 ? activeCandidates[0].userId : '');
      setBulkNotes(`Tenure handover from ${user.fullName} (${user.userId}) to continue project deliverables.`);
    }
  }, [user, activeCandidates]);

  // Lock body scroll on open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !user) return null;

  const handleBulkReassign = async () => {
    if (!bulkTargetUserId) {
      setFeedback({ type: 'error', message: 'Please select an active team member for the handover.' });
      return;
    }

    setIsBulkSubmitting(true);
    setFeedback(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/handover/reassign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fromUserId: user.userId,
          toUserId: bulkTargetUserId,
          reassignAll: true,
          handoverNotes: bulkNotes || 'Bulk handover finalized by Administrator.',
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to reassign work.');
      }

      setFeedback({
        type: 'success',
        message: data.message || 'All pending work successfully transferred to replacement team member!',
      });
      onHandoverSuccess();
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err.message || 'Server error during bulk reassignment.',
      });
    } finally {
      setIsBulkSubmitting(false);
    }
  };

  const handleSingleReassign = async (item: WorkItemDetail) => {
    const targetUserId = selectedTargetUsers[item.workItemId] || (activeCandidates.length > 0 ? activeCandidates[0].userId : '');
    if (!targetUserId) {
      setFeedback({ type: 'error', message: 'Please select a replacement member for this item.' });
      return;
    }

    setSubmittingItemId(item.workItemId);
    setFeedback(null);

    try {
      const token = localStorage.getItem('token');
      const notes = individualNotes[item.workItemId] || `Handover of "${item.title}" from ${user.fullName}.`;

      const response = await fetch(`${API_BASE_URL}/handover/reassign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fromUserId: user.userId,
          toUserId: targetUserId,
          workItemIds: [{ projectId: item.projectId, workItemId: item.workItemId }],
          handoverNotes: notes,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to reassign work item.');
      }

      setFeedback({
        type: 'success',
        message: `Task "${item.title}" successfully transferred!`,
      });
      onHandoverSuccess();
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err.message || 'Failed to reassign task.',
      });
    } finally {
      setSubmittingItemId(null);
    }
  };

  const formatOffboardReason = (reason?: string) => {
    switch (reason) {
      case 'INTERNSHIP_COMPLETED':
        return 'Internship Period Completed';
      case 'CONTRACT_ENDED':
        return 'Contract Tenure Concluded';
      case 'RESIGNED':
        return 'Voluntary Resignation';
      case 'ADMIN_OFFBOARDED':
        return 'Administrative Rotation';
      default:
        return reason || 'Offboarded';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[var(--color-brand-navy)]/40 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-2xl bg-[var(--color-surface-white)] shadow-2xl flex flex-col border-l border-[var(--color-border-subtle)]">
          {/* ── Header ────────────────────────────────────────── */}
          <div className="px-6 py-5 bg-[var(--color-surface-subtle)] border-b border-[var(--color-border-subtle)] flex items-start justify-between">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--color-brand-blue)] to-[var(--color-brand-navy)] text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
                {user.fullName.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg font-bold text-[var(--color-brand-navy)]">
                    {user.fullName}
                  </h2>
                  <Badge variant="neutral" size="sm" className="font-mono">
                    {user.userId}
                  </Badge>
                  <Badge
                    variant={user.role === 'INTERN' ? 'blue' : 'neutral'}
                    size="sm"
                  >
                    {user.role === 'INTERN' ? 'Intern' : 'Permanent Staff'}
                  </Badge>
                </div>
                <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                  {user.designation || user.internRole || 'Project Team Member'} • {user.department}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                    <Clock className="w-3 h-3" />
                    {formatOffboardReason(user.offboardReason)}
                  </span>
                  {user.offboardedAt && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-[var(--color-text-muted)]">
                      <Calendar className="w-3 h-3" />
                      Exit: {new Date(user.offboardedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-brand-navy)] hover:bg-[var(--color-surface-white)] transition-colors"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* ── Progress & Metrics Bar ────────────────────────── */}
          <div className="px-6 py-3.5 bg-[var(--color-surface-white)] border-b border-[var(--color-border-subtle)]">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-[var(--color-brand-navy)]">
                Workload Tenure Progress:
              </span>
              <span className="font-bold text-[var(--color-brand-blue)]">
                {user.completionRate}% Completed ({user.completedTasksCount} of {user.totalTasks} deliverables finished)
              </span>
            </div>
            {/* Visual dual progress bar */}
            <div className="w-full h-2.5 rounded-full bg-[var(--color-surface-subtle)] overflow-hidden flex">
              <div
                style={{ width: `${user.completionRate}%` }}
                className="bg-emerald-500 h-full transition-all duration-300"
                title={`Completed: ${user.completionRate}%`}
              />
              <div
                style={{ width: `${100 - user.completionRate}%` }}
                className="bg-amber-400 h-full transition-all duration-300"
                title={`Pending Handover: ${100 - user.completionRate}%`}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-[var(--color-text-secondary)] mt-2">
              <span className="flex items-center gap-1 text-emerald-700 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                Completed: {user.completedTasksCount} tasks
              </span>
              <span className="flex items-center gap-1 text-amber-700 font-medium">
                <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                Pending Handover: {user.pendingTasksCount} tasks
              </span>
              <span className="text-[var(--color-text-muted)]">
                Projects: {user.projectsInvolved.length} active
              </span>
            </div>
          </div>

          {/* ── Tabs Navigation ───────────────────────────────── */}
          <div className="px-6 border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-subtle)]/40 flex gap-2">
            <button
              onClick={() => setActiveTab('PENDING')}
              className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'PENDING'
                  ? 'border-[var(--color-brand-blue)] text-[var(--color-brand-blue)] bg-[var(--color-surface-white)]'
                  : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-brand-navy)]'
              }`}
            >
              <ArrowRightLeft className="w-4 h-4" />
              Pending Work & Handover
              {user.pendingTasksCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300/60">
                  {user.pendingTasksCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('COMPLETED')}
              className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'COMPLETED'
                  ? 'border-[var(--color-brand-blue)] text-[var(--color-brand-blue)] bg-[var(--color-surface-white)]'
                  : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-brand-navy)]'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              Completed Contributions
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300/60">
                {user.completedTasksCount}
              </span>
            </button>
          </div>

          {/* ── Content Area ──────────────────────────────────── */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Feedback Alert */}
            {feedback && (
              <Alert
                variant={feedback.type}
                onClose={() => setFeedback(null)}
              >
                {feedback.message}
              </Alert>
            )}

            {/* Offboard Notes Info Card */}
            {user.offboardNotes && (
              <div className="p-3.5 rounded-xl bg-[var(--color-surface-subtle)] border border-[var(--color-border-subtle)] text-xs text-[var(--color-text-secondary)] flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[var(--color-brand-navy)]">Tenure Exit Note: </span>
                  {user.offboardNotes}
                </div>
              </div>
            )}

            {/* ── TAB 1: PENDING WORK & HANDOVER ──────────────── */}
            {activeTab === 'PENDING' && (
              <div className="space-y-6">
                {user.pendingTasksCount === 0 ? (
                  <div className="text-center py-10 px-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/60">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                      <Check className="w-6 h-6" />
                    </div>
                    <h3 className="text-sm font-bold text-emerald-900">
                      All Deliverables Successfully Handed Over!
                    </h3>
                    <p className="text-xs text-emerald-700 max-w-sm mx-auto mt-1">
                      This team member has no pending work items. All active projects have been safely transferred or completed prior to tenure exit.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Bulk Reassignment Card */}
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50/80 via-indigo-50/50 to-white border border-[var(--color-brand-blue)]/30 shadow-xs">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-4 h-4 text-[var(--color-brand-blue)]" />
                        <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-navy)]">
                          Bulk Work Handover
                        </h3>
                      </div>
                      <p className="text-xs text-[var(--color-text-secondary)] mb-3">
                        Transfer all <strong>{user.pendingTasksCount} pending deliverables</strong> to a qualified active colleague in a single verified handover step:
                      </p>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-[var(--color-brand-navy)] mb-1">
                            Assignee (Active Team Member):
                          </label>
                          <select
                            value={bulkTargetUserId}
                            onChange={(e) => setBulkTargetUserId(e.target.value)}
                            className="w-full text-xs px-3 py-2 rounded-xl bg-white border border-[var(--color-border-subtle)] text-[var(--color-brand-navy)] focus:ring-2 focus:ring-[var(--color-brand-blue)]/30 focus:border-[var(--color-brand-blue)] outline-hidden"
                          >
                            {activeCandidates.map((c) => (
                              <option key={c.userId} value={c.userId}>
                                {c.fullName} ({c.role === 'PERMANENT_STAFF' ? 'Staff' : 'Intern'} - {c.designation || c.internRole || c.department}) — {c.activeTasksCount} active tasks
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-[var(--color-brand-navy)] mb-1">
                            Handover Audit Note:
                          </label>
                          <input
                            type="text"
                            value={bulkNotes}
                            onChange={(e) => setBulkNotes(e.target.value)}
                            placeholder="Reason or handover instructions..."
                            className="w-full text-xs px-3 py-2 rounded-xl bg-white border border-[var(--color-border-subtle)] text-[var(--color-brand-navy)] focus:ring-2 focus:ring-[var(--color-brand-blue)]/30 focus:border-[var(--color-brand-blue)] outline-hidden"
                          />
                        </div>

                        <Button
                          variant="primary"
                          size="sm"
                          onClick={handleBulkReassign}
                          disabled={isBulkSubmitting || activeCandidates.length === 0}
                          className="w-full justify-center"
                        >
                          <Send className="w-3.5 h-3.5 mr-1.5" />
                          {isBulkSubmitting
                            ? 'Processing Handover...'
                            : `Transfer All ${user.pendingTasksCount} Pending Tasks Now`}
                        </Button>
                      </div>
                    </div>

                    {/* Individual Pending Items List */}
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">
                        Pending Items Requiring Reassignment ({user.pendingWorkItems.length})
                      </h3>

                      <div className="space-y-3">
                        {user.pendingWorkItems.map((item) => {
                          const isSubmitting = submittingItemId === item.workItemId;
                          const currentSelectedUser =
                            selectedTargetUsers[item.workItemId] ||
                            (activeCandidates.length > 0 ? activeCandidates[0].userId : '');

                          return (
                            <div
                              key={item.workItemId}
                              className="p-4 rounded-xl border border-amber-200/80 bg-amber-50/20 shadow-2xs space-y-3"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800">
                                      {item.workItemId}
                                    </span>
                                    <Badge variant="warning" size="sm">
                                      {item.status === 'IN_PROGRESS' ? 'In Progress' : 'Pending'}
                                    </Badge>
                                    <span className="text-[11px] font-semibold text-[var(--color-brand-blue)]">
                                      Weight: {item.percentage}%
                                    </span>
                                  </div>
                                  <h4 className="text-xs font-bold text-[var(--color-brand-navy)] mt-1">
                                    {item.title}
                                  </h4>
                                  <p className="text-[11px] text-[var(--color-text-secondary)] mt-0.5 flex items-center gap-1">
                                    <FolderKanban className="w-3 h-3 text-[var(--color-brand-blue)]" />
                                    {item.projectName}
                                  </p>
                                </div>
                              </div>

                              {item.handoverNotes && (
                                <p className="text-[11px] text-amber-900/80 bg-amber-100/50 p-2 rounded-lg border border-amber-200/50">
                                  <strong>Handover context:</strong> {item.handoverNotes}
                                </p>
                              )}

                              {/* Reassign action box */}
                              <div className="pt-2 border-t border-amber-200/60 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                                <div className="flex-1">
                                  <select
                                    value={currentSelectedUser}
                                    onChange={(e) =>
                                      setSelectedTargetUsers((prev) => ({
                                        ...prev,
                                        [item.workItemId]: e.target.value,
                                      }))
                                    }
                                    className="w-full text-xs px-2.5 py-1.5 rounded-lg bg-white border border-[var(--color-border-subtle)] text-[var(--color-brand-navy)] focus:ring-1 focus:ring-[var(--color-brand-blue)] outline-hidden mb-1.5"
                                  >
                                    {activeCandidates.map((c) => (
                                      <option key={c.userId} value={c.userId}>
                                        Reassign to: {c.fullName} ({c.role === 'PERMANENT_STAFF' ? 'Staff' : 'Intern'})
                                      </option>
                                    ))}
                                  </select>
                                  <input
                                    type="text"
                                    value={individualNotes[item.workItemId] || ''}
                                    onChange={(e) =>
                                      setIndividualNotes((prev) => ({
                                        ...prev,
                                        [item.workItemId]: e.target.value,
                                      }))
                                    }
                                    placeholder="Optional handover instructions..."
                                    className="w-full text-[11px] px-2.5 py-1 rounded-lg bg-white border border-[var(--color-border-subtle)] text-[var(--color-brand-navy)] focus:ring-1 focus:ring-[var(--color-brand-blue)] outline-hidden"
                                  />
                                </div>
                                <Button
                                  variant="primary"
                                  size="sm"
                                  disabled={isSubmitting}
                                  onClick={() => handleSingleReassign(item)}
                                  className="shrink-0 self-end"
                                >
                                  <ArrowRightLeft className="w-3 h-3 mr-1" />
                                  {isSubmitting ? 'Transferring...' : 'Reassign'}
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* ── TAB 2: COMPLETED WORK RECORD ────────────────── */}
            {activeTab === 'COMPLETED' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-emerald-900">
                        Tenure Work Record Clearance
                      </h4>
                      <p className="text-[11px] text-emerald-700">
                        {user.completedTasksCount} deliverables successfully built, tested, and archived to programme history.
                      </p>
                    </div>
                  </div>
                  <Badge variant="success" size="md">
                    Verified
                  </Badge>
                </div>

                {user.completedWorkItems.length === 0 ? (
                  <div className="text-center py-8 text-xs text-[var(--color-text-muted)]">
                    No completed work items recorded prior to offboarding.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {user.completedWorkItems.map((item) => (
                      <div
                        key={item.workItemId}
                        className="p-3.5 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-white)] shadow-2xs hover:border-emerald-300 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                                {item.workItemId}
                              </span>
                              <Badge variant="success" size="sm">
                                Completed
                              </Badge>
                              <span className="text-[11px] font-bold text-emerald-700">
                                +{item.percentage}% Contribution
                              </span>
                            </div>
                            <h4 className="text-xs font-bold text-[var(--color-brand-navy)] mt-1">
                              {item.title}
                            </h4>
                            <p className="text-[11px] text-[var(--color-text-secondary)] mt-0.5 flex items-center gap-1">
                              <FolderKanban className="w-3 h-3 text-[var(--color-brand-blue)]" />
                              {item.projectName} • Role: {item.role}
                            </p>
                          </div>

                          {item.completedAt && (
                            <span className="text-[10px] text-[var(--color-text-muted)] shrink-0 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {item.completedAt}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Footer ────────────────────────────────────────── */}
          <div className="px-6 py-4 bg-[var(--color-surface-subtle)] border-t border-[var(--color-border-subtle)] flex items-center justify-between">
            <span className="text-[11px] text-[var(--color-text-muted)]">
              Authorized Administrator: SLT-Mobitel AI & Data Programme
            </span>
            <Button variant="secondary" size="sm" onClick={onClose}>
              Close Preview
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
