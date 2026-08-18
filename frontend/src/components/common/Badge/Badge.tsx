import React from 'react';
import { cn } from '../../../utils/cn';

export type BadgeVariant = 'neutral' | 'info' | 'success' | 'warning' | 'error' | 'blue';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
}

const variantStyles: Record<BadgeVariant, { container: string; dot: string }> = {
  neutral: {
    container: 'bg-[var(--color-surface-subtle)] text-[var(--color-text-secondary)] border-[var(--color-border-subtle)]',
    dot: 'bg-[var(--color-text-muted)]',
  },
  info: {
    container: 'bg-[#F0F9FF] text-[var(--color-status-info)] border-[#BAE6FD]',
    dot: 'bg-[var(--color-status-info)]',
  },
  success: {
    container: 'bg-[#F0FDF4] text-[var(--color-status-success)] border-[#BBF7D0]',
    dot: 'bg-[var(--color-status-success)]',
  },
  warning: {
    container: 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]',
    dot: 'bg-[var(--color-status-warning)]',
  },
  error: {
    container: 'bg-[#FEF2F2] text-[var(--color-status-error)] border-[#FECACA]',
    dot: 'bg-[var(--color-status-error)]',
  },
  blue: {
    container: 'bg-[var(--color-brand-blue-light)] text-[var(--color-brand-blue)] border-[#BFDBFE]',
    dot: 'bg-[var(--color-brand-blue)]',
  },
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-[11px] font-medium leading-tight',
  md: 'px-2.5 py-1 text-xs font-medium leading-tight',
};

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      className,
      variant = 'neutral',
      size = 'md',
      dot = false,
      children,
      ...props
    },
    ref
  ) => {
    const { container, dot: dotBg } = variantStyles[variant];

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full border select-none font-medium',
          container,
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {dot && <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', dotBg)} aria-hidden="true" />}
        <span>{children}</span>
      </span>
    );
  }
);

Badge.displayName = 'Badge';
