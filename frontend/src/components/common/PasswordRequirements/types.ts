/* ─────────────────────────────────────────────────────────── */
/* Password Rule Definition & Default Configuration            */
/* ─────────────────────────────────────────────────────────── */
export interface PasswordRule {
  id: string;
  label: string;
  test: (value: string) => boolean;
}

/**
 * Default password requirement rules.
 *
 * These are presented as UI-level guidance only.
 * The authoritative password policy will be confirmed
 * and enforced by the backend in a later milestone.
 */
export const DEFAULT_PASSWORD_RULES: PasswordRule[] = [
  { id: 'length',    label: 'At least 8 characters',        test: (v) => v.length >= 8 },
  { id: 'uppercase', label: 'One uppercase letter (A–Z)',    test: (v) => /[A-Z]/.test(v) },
  { id: 'lowercase', label: 'One lowercase letter (a–z)',    test: (v) => /[a-z]/.test(v) },
  { id: 'number',    label: 'One number (0–9)',              test: (v) => /\d/.test(v) },
  { id: 'special',   label: 'One special character (!@#$…)', test: (v) => /[^A-Za-z0-9]/.test(v) },
];
