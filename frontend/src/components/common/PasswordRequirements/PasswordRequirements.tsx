import React from 'react';
import { CheckCircle2, XCircle, Circle } from 'lucide-react';
import type { PasswordRule } from './types';
import { DEFAULT_PASSWORD_RULES } from './types';

/* ─────────────────────────────────────────────────────────── */
/* Individual Requirement Row                                  */
/* ─────────────────────────────────────────────────────────── */
function RequirementRow({ rule, password }: { rule: PasswordRule; password: string }) {
  const hasTyped = password.length > 0;
  const met = rule.test(password);

  let icon: React.ReactNode;
  let textColor: string;

  if (!hasTyped) {
    icon = <Circle className="w-3.5 h-3.5" />;
    textColor = 'text-[var(--color-text-muted)]';
  } else if (met) {
    icon = <CheckCircle2 className="w-3.5 h-3.5" />;
    textColor = 'text-[var(--color-status-success)]';
  } else {
    icon = <XCircle className="w-3.5 h-3.5" />;
    textColor = 'text-[var(--color-status-error)]';
  }

  return (
    <li className={`flex items-center gap-2 text-xs ${textColor} transition-colors duration-150`}>
      <span className="shrink-0" aria-hidden="true">{icon}</span>
      <span>{rule.label}</span>
      <span className="sr-only">
        {!hasTyped ? '(not yet entered)' : met ? '(met)' : '(not met)'}
      </span>
    </li>
  );
}

/* ─────────────────────────────────────────────────────────── */
/* PasswordRequirements Panel                                  */
/* ─────────────────────────────────────────────────────────── */
export interface PasswordRequirementsProps {
  /** Current password value being typed into the New Password field */
  password: string;
  /** Override the default rule set */
  rules?: PasswordRule[];
  /** Show/hide the policy disclaimer note */
  showDisclaimer?: boolean;
}

/**
 * Reusable password requirement list panel.
 * Live-validates against `password` as the user types.
 * Presentation-only — contains no backend logic.
 */
export const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({
  password,
  rules = DEFAULT_PASSWORD_RULES,
  showDisclaimer = true,
}) => {
  return (
    <div
      className="p-3.5 rounded-lg bg-[var(--color-surface-subtle)] border border-[var(--color-border-subtle)]"
      aria-live="polite"
      aria-label="Password requirements"
    >
      <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] mb-2.5">
        Password Requirements
        {showDisclaimer && (
          <span className="text-[10px] font-normal normal-case ml-1 text-[var(--color-text-muted)]">
            (frontend guidance — policy confirmed by backend)
          </span>
        )}
      </p>
      <ul className="space-y-1.5" role="list">
        {rules.map((rule) => (
          <RequirementRow key={rule.id} rule={rule} password={password} />
        ))}
      </ul>
    </div>
  );
};
