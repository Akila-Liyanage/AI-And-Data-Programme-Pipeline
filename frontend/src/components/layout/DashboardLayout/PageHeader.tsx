import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { cn } from '../../../utils/cn';
import type { PageHeaderProps } from './types';

/**
 * Reusable PageHeader component for dashboard pages.
 * Displays breadcrumbs, page title, subtitle/description, and action buttons.
 */
export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  breadcrumbs,
  actions,
  badge,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-6 sm:pb-8',
        className
      )}
    >
      {/* Title and metadata block */}
      <div className="space-y-1 min-w-0">
        {/* Optional Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav
            className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] pb-1"
            aria-label="Breadcrumbs"
          >
            {breadcrumbs.map((crumb, idx) => {
              const isLast = idx === breadcrumbs.length - 1;

              return (
                <React.Fragment key={crumb.label}>
                  {idx > 0 && (
                    <ChevronRight className="w-3.5 h-3.5 shrink-0 text-[var(--color-text-muted)]" />
                  )}
                  {crumb.path && !isLast ? (
                    <Link
                      to={crumb.path}
                      className="hover:text-[var(--color-brand-blue)] transition-colors truncate max-w-[150px]"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span
                      className={cn(
                        'truncate max-w-[200px]',
                        isLast && 'text-[var(--color-brand-navy)] font-semibold'
                      )}
                      aria-current={isLast ? 'page' : undefined}
                    >
                      {crumb.label}
                    </span>
                  )}
                </React.Fragment>
              );
            })}
          </nav>
        )}

        {/* Title + optional badge */}
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--color-brand-navy)]">
            {title}
          </h1>
          {badge}
        </div>

        {/* Optional Description */}
        {description && (
          <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed max-w-2xl">
            {description}
          </p>
        )}
      </div>

      {/* Optional action buttons */}
      {actions && (
        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-center">
          {actions}
        </div>
      )}
    </div>
  );
};
