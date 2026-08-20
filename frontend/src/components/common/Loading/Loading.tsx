import React from 'react';
import { cn } from '../../../utils/cn';
import { Loader2 } from 'lucide-react';

export interface SpinnerProps extends React.SVGAttributes<SVGSVGElement> {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'green' | 'white' | 'muted';
}

const spinnerSizes = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
};

const spinnerVariants = {
  primary: 'text-[var(--color-brand-blue)]',
  green: 'text-[var(--color-brand-green)]',
  white: 'text-white',
  muted: 'text-[var(--color-text-muted)]',
};

export const Spinner: React.FC<SpinnerProps> = ({
  className,
  size = 'md',
  variant = 'primary',
  ...props
}) => {
  return (
    <Loader2
      className={cn('animate-spin', spinnerSizes[size], spinnerVariants[variant], className)}
      {...props}
    />
  );
};

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rounded';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'text',
  ...props
}) => {
  return (
    <div
      className={cn(
        'animate-pulse bg-[var(--color-border-subtle)]',
        variant === 'text' && 'h-4 w-full rounded-md',
        variant === 'circular' && 'rounded-full',
        variant === 'rounded' && 'rounded-xl',
        className
      )}
      {...props}
    />
  );
};

export interface LoadingStateProps extends React.HTMLAttributes<HTMLDivElement> {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  minHeight?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  className,
  message = 'Loading data...',
  size = 'md',
  minHeight = 'min-h-[160px]',
  ...props
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center',
        minHeight,
        className
      )}
      {...props}
    >
      <Spinner size={size} />
      {message && (
        <p className="mt-3 text-xs font-medium text-[var(--color-text-secondary)]">{message}</p>
      )}
    </div>
  );
};
