import React from 'react';
import { cn } from '../../../utils/cn';

export interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  headerAction?: React.ReactNode;
  footer?: React.ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  bordered?: boolean;
}

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      title,
      subtitle,
      headerAction,
      footer,
      padding = 'md',
      bordered = true,
      children,
      ...props
    },
    ref
  ) => {
    const hasHeader = title || subtitle || headerAction;

    return (
      <div
        ref={ref}
        className={cn(
          'bg-[var(--color-surface-white)] text-[var(--color-text-primary)] rounded-xl transition-all duration-150',
          bordered && 'border border-[var(--color-border-subtle)]',
          'shadow-[0_1px_3px_rgba(16,24,40,0.04),0_1px_2px_rgba(16,24,40,0.02)]',
          className
        )}
        {...props}
      >
        {hasHeader && (
          <div className="px-6 py-4 border-b border-[var(--color-border-subtle)] flex items-center justify-between gap-4">
            <div className="space-y-0.5 min-w-0">
              {title && (
                typeof title === 'string' ? (
                  <h3 className="text-base font-semibold text-[var(--color-brand-navy)] truncate">{title}</h3>
                ) : (
                  title
                )
              )}
              {subtitle && (
                typeof subtitle === 'string' ? (
                  <p className="text-xs text-[var(--color-text-secondary)]">{subtitle}</p>
                ) : (
                  subtitle
                )
              )}
            </div>
            {headerAction && <div className="shrink-0 flex items-center">{headerAction}</div>}
          </div>
        )}

        <div className={cn(paddingStyles[padding])}>{children}</div>

        {footer && (
          <div className="px-6 py-3.5 bg-[var(--color-surface-subtle)] border-t border-[var(--color-border-subtle)] rounded-b-xl flex items-center justify-between">
            {footer}
          </div>
        )}
      </div>
    );
  }
);

Card.displayName = 'Card';
