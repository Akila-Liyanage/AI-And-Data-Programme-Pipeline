import React from 'react';
import { cn } from '../../../utils/cn';
import { Inbox } from 'lucide-react';

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  minHeight?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  className,
  icon,
  title,
  description,
  action,
  secondaryAction,
  minHeight = 'min-h-[220px]',
  ...props
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center rounded-xl bg-[var(--color-surface-subtle)] border border-dashed border-[var(--color-border-subtle)]',
        minHeight,
        className
      )}
      {...props}
    >
      <div className="w-12 h-12 rounded-xl bg-[var(--color-surface-white)] border border-[var(--color-border-subtle)] flex items-center justify-center text-[var(--color-brand-blue)] shadow-xs mb-3.5">
        {icon || <Inbox className="w-6 h-6 text-[var(--color-text-muted)]" />}
      </div>

      <h4 className="text-sm font-semibold text-[var(--color-brand-navy)] max-w-sm">
        {title}
      </h4>

      {description && (
        <p className="mt-1 text-xs text-[var(--color-text-secondary)] max-w-sm leading-relaxed">
          {description}
        </p>
      )}

      {(action || secondaryAction) && (
        <div className="mt-5 flex items-center gap-3 flex-wrap justify-center">
          {action}
          {secondaryAction}
        </div>
      )}
    </div>
  );
};
