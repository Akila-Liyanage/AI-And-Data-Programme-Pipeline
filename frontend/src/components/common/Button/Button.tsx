import React from 'react';
import { cn } from '../../../utils/cn';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'green' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--color-brand-blue)] text-white hover:bg-[var(--color-brand-blue-hover)] focus-visible:ring-2 focus-visible:ring-[var(--color-brand-blue)]/30 active:bg-[var(--color-brand-blue-hover)] border border-transparent shadow-xs',
  secondary:
    'bg-[var(--color-surface-subtle)] text-[var(--color-text-primary)] hover:bg-[#F1F5F9] focus-visible:ring-2 focus-visible:ring-[var(--color-border-hover)] border border-[var(--color-border-subtle)] shadow-xs',
  outline:
    'bg-transparent text-[var(--color-text-primary)] hover:bg-[var(--color-surface-subtle)] focus-visible:ring-2 focus-visible:ring-[var(--color-border-hover)] border border-[var(--color-border-subtle)]',
  danger:
    'bg-[var(--color-status-error)] text-white hover:bg-[#B91C1C] focus-visible:ring-2 focus-visible:ring-[var(--color-status-error)]/30 active:bg-[#991B1B] border border-transparent shadow-xs',
  green:
    'bg-[var(--color-brand-green)] text-white hover:bg-[var(--color-brand-green-hover)] focus-visible:ring-2 focus-visible:ring-[var(--color-brand-green)]/30 active:bg-[var(--color-brand-green-hover)] border border-transparent shadow-xs',
  ghost:
    'bg-transparent text-[var(--color-text-primary)] hover:bg-[var(--color-surface-subtle)] hover:text-[var(--color-text-primary)] focus-visible:ring-2 focus-visible:ring-[var(--color-border-hover)] border border-transparent',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5 rounded-lg',
  md: 'h-10 px-4 text-sm gap-2 rounded-lg',
  lg: 'h-11 px-5 text-base gap-2.5 rounded-lg',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-colors duration-150 ease-in-out select-none cursor-pointer outline-hidden',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
        {!isLoading && leftIcon && <span className="shrink-0">{leftIcon}</span>}
        {children && <span>{children}</span>}
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
