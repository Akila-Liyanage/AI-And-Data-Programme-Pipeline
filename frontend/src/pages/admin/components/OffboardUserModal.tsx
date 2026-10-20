import React, { useState } from 'react';
import {
  X,
  UserX,
  Send,
} from 'lucide-react';
import { Button, Badge, Alert } from '../../../components/common';
import type { ActiveCandidate } from '../../../types/handoverManagement.types';

const API_BASE_URL = 'http://localhost:5000/api';

export interface OffboardUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeCandidates: ActiveCandidate[];
  onOffboardSuccess: () => void;
}

export const OffboardUserModal: React.FC<OffboardUserModalProps> = ({
  isOpen,
  onClose,
  activeCandidates,
  onOffboardSuccess,
}) => {
  const [selectedUserId, setSelectedUserId] = useState<string>(
    activeCandidates.length > 0 ? activeCandidates[0].userId : ''
  );
  const [reason, setReason] = useState<string>('INTERNSHIP_COMPLETED');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const selectedCandidate = activeCandidates.find((c) => c.userId === selectedUserId) || activeCandidates[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) {
      setErrorMsg('Please select a team member to offboard.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/handover/offboard`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: selectedUserId,
          reason,
          notes: notes || `Offboarded under ${reason}. Handover workflow initiated.`,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to offboard team member.');
      }

      onOffboardSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Server error while offboarding team member.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      <div className="min-h-screen px-4 text-center flex items-center justify-center">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-[var(--color-brand-navy)]/40 backdrop-blur-xs transition-opacity duration-200"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Modal Window */}
        <div className="relative inline-block w-full max-w-lg p-6 my-8 text-left align-middle bg-[var(--color-surface-white)] rounded-2xl shadow-2xl border border-[var(--color-border-subtle)] transform transition-all">
          <div className="flex items-center justify-between pb-4 border-b border-[var(--color-border-subtle)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
                <UserX className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[var(--color-brand-navy)]">
                  Offboard Team Member
                </h3>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  Conclude tenure and initiate deliverable handover workflow
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-brand-navy)] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {errorMsg && (
              <Alert variant="error" onClose={() => setErrorMsg(null)}>
                {errorMsg}
              </Alert>
            )}

            {/* Select User */}
            <div>
              <label className="block text-xs font-semibold text-[var(--color-brand-navy)] mb-1">
                Select Active Personnel:
              </label>
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-white border border-[var(--color-border-subtle)] text-[var(--color-brand-navy)] focus:ring-2 focus:ring-[var(--color-brand-blue)]/30 focus:border-[var(--color-brand-blue)] outline-hidden"
              >
                {activeCandidates.map((c) => (
                  <option key={c.userId} value={c.userId}>
                    {c.fullName} ({c.userId}) — {c.role === 'PERMANENT_STAFF' ? 'Staff' : 'Intern'} [{c.department}]
                  </option>
                ))}
              </select>
            </div>

            {/* Live Workload Inspection Box */}
            {selectedCandidate && (
              <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/80 text-xs space-y-1.5">
                <div className="flex items-center justify-between font-semibold text-amber-900">
                  <span>Current Active Workload:</span>
                  <Badge variant={selectedCandidate.activeTasksCount > 0 ? 'warning' : 'success'} size="sm">
                    {selectedCandidate.activeTasksCount > 0 ? `${selectedCandidate.activeTasksCount} Pending Tasks` : 'No Pending Tasks'}
                  </Badge>
                </div>
                <p className="text-[11px] text-amber-800">
                  {selectedCandidate.activeTasksCount > 0 ? (
                    <>
                      ⚠️ This member currently has <strong>{selectedCandidate.activeTasksCount} open deliverable(s)</strong> across {selectedCandidate.activeAssignmentsCount} project assignment(s). After offboarding, you will be prompted to reassign these items to an active team member.
                    </>
                  ) : (
                    <>
                      ✓ This member has 0 incomplete tasks. They can be safely concluded without requiring urgent project reassignments.
                    </>
                  )}
                </p>
              </div>
            )}

            {/* Reason */}
            <div>
              <label className="block text-xs font-semibold text-[var(--color-brand-navy)] mb-1">
                Offboarding / Exit Reason:
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-white border border-[var(--color-border-subtle)] text-[var(--color-brand-navy)] focus:ring-2 focus:ring-[var(--color-brand-blue)]/30 focus:border-[var(--color-brand-blue)] outline-hidden"
              >
                <option value="INTERNSHIP_COMPLETED">
                  Internship Period Completed (Scheduled Completion)
                </option>
                <option value="CONTRACT_ENDED">
                  Contract Tenure Concluded (Fixed-term Expiration)
                </option>
                <option value="RESIGNED">Voluntary Resignation</option>
                <option value="ADMIN_OFFBOARDED">
                  Administrative Rotation / Project Shift
                </option>
              </select>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-semibold text-[var(--color-brand-navy)] mb-1">
                Tenure Summary / Handover Notes:
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="e.g., 6-month internship successfully completed. Contributed to churn model..."
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-white border border-[var(--color-border-subtle)] text-[var(--color-brand-navy)] focus:ring-2 focus:ring-[var(--color-brand-blue)]/30 focus:border-[var(--color-brand-blue)] outline-hidden"
              />
            </div>

            <div className="pt-3 border-t border-[var(--color-border-subtle)] flex items-center justify-end gap-2.5">
              <Button variant="secondary" size="sm" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                type="submit"
                disabled={isSubmitting || activeCandidates.length === 0}
              >
                <Send className="w-3.5 h-3.5 mr-1.5" />
                {isSubmitting ? 'Offboarding...' : 'Confirm Offboarding'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
