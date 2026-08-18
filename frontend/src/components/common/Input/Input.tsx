import React, { useState } from 'react';
import { cn } from '../../../utils/cn';
import { Eye, EyeOff } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string | boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      label,
      helperText,
      error,
      required,
      id,
      disabled,
      leftIcon,
      rightIcon,
      fullWidth = true,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const generatedId = React.useId();
    const inputId = id || generatedId;
    const isPassword = type === 'password';
    const computedType = isPassword ? (showPassword ? 'text' : 'password') : type;
    const hasError = Boolean(error);
    const errorMessage = typeof error === 'string' ? error : undefined;

    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth ? 'w-full' : 'w-auto')}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-medium text-[var(--color-text-primary)] flex items-center gap-1 select-none"
          >
            <span>{label}</span>
            {required && <span className="text-[var(--color-status-error)]" aria-hidden="true">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 flex items-center pointer-events-none text-[var(--color-text-secondary)]">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            type={computedType}
            disabled={disabled}
            required={required}
            aria-invalid={hasError}
            aria-describedby={
              hasError ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            className={cn(
              'h-10 w-full px-3.5 text-sm bg-[var(--color-surface-white)] text-[var(--color-text-primary)]',
              'rounded-lg border transition-all duration-150 ease-in-out',
              'placeholder:text-[var(--color-text-muted)]',
              'outline-hidden',
              hasError
                ? 'border-[var(--color-status-error)] focus:border-[var(--color-status-error)] focus:ring-2 focus:ring-[var(--color-status-error)]/20'
                : 'border-[var(--color-border-subtle)] hover:border-[var(--color-border-hover)] focus:border-[var(--color-brand-blue)] focus:ring-2 focus:ring-[var(--color-brand-blue)]/20',
              'disabled:bg-[var(--color-app-bg)] disabled:text-[var(--color-text-muted)] disabled:cursor-not-allowed disabled:border-[var(--color-border-subtle)]',
              leftIcon && 'pl-10',
              (isPassword || rightIcon) && 'pr-10',
              className
            )}
            {...props}
          />

          {isPassword ? (
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 flex items-center text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] focus:outline-hidden transition-colors cursor-pointer"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          ) : rightIcon ? (
            <div className="absolute right-3 flex items-center pointer-events-none text-[var(--color-text-secondary)]">
              {rightIcon}
            </div>
          ) : null}
        </div>

        {errorMessage && (
          <p id={`${inputId}-error`} className="text-xs text-[var(--color-status-error)] font-medium mt-0.5">
            {errorMessage}
          </p>
        )}

        {!errorMessage && helperText && (
          <p id={`${inputId}-helper`} className="text-xs text-[var(--color-text-secondary)] mt-0.5">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
