import React, { useRef, useEffect, useId } from 'react';
import { cn } from '../../../utils/cn';

export interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  disabled?: boolean;
  autoFocus?: boolean;
  hasError?: boolean;
  id?: string;
  className?: string;
  'aria-describedby'?: string;
  'aria-label'?: string;
}

export const OtpInput: React.FC<OtpInputProps> = ({
  value,
  onChange,
  length = 6,
  disabled = false,
  autoFocus = true,
  hasError = false,
  id,
  className,
  'aria-describedby': ariaDescribedBy,
  'aria-label': ariaLabel = '6-digit verification code',
}) => {
  const generatedId = useId();
  const baseId = id || generatedId;
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Initialize array of digits based on `length`
  const digits = Array.from({ length }, (_, i) => value[i] || '');

  useEffect(() => {
    if (autoFocus && inputRefs.current[0] && !disabled) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus, disabled]);

  const setDigitAt = (index: number, newDigit: string) => {
    const chars = value.split('');
    chars[index] = newDigit;
    const newValue = chars.join('').slice(0, length);
    onChange(newValue);
  };

  const handleInputChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    // Extract last entered character if multiple, ensuring only digits
    const cleaned = rawVal.replace(/\D/g, '');

    if (!cleaned) {
      setDigitAt(index, '');
      return;
    }

    const lastChar = cleaned[cleaned.length - 1];
    setDigitAt(index, lastChar);

    // Auto-focus next input
    if (index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
      inputRefs.current[index + 1]?.select();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        // Current box is empty, navigate back and clear previous
        setDigitAt(index - 1, '');
        inputRefs.current[index - 1]?.focus();
      } else {
        // Clear current box
        setDigitAt(index, '');
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
      inputRefs.current[index - 1]?.select();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
      inputRefs.current[index + 1]?.select();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const numericOnly = pastedData.replace(/\D/g, '').slice(0, length);

    if (!numericOnly) return;

    onChange(numericOnly);

    // Focus the next empty input or the last input
    const nextIndex = Math.min(numericOnly.length, length - 1);
    if (inputRefs.current[nextIndex]) {
      inputRefs.current[nextIndex]?.focus();
      inputRefs.current[nextIndex]?.select();
    }
  };

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      className={cn('flex items-center justify-between gap-1.5 sm:gap-2.5 max-w-full', className)}
    >
      {Array.from({ length }).map((_, index) => {
        const inputId = `${baseId}-digit-${index + 1}`;
        const isFilled = Boolean(digits[index]);

        return (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            id={inputId}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            autoComplete="one-time-code"
            disabled={disabled}
            value={digits[index]}
            onChange={(e) => handleInputChange(index, e)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            onFocus={(e) => e.target.select()}
            aria-label={`Digit ${index + 1} of ${length}`}
            className={cn(
              'w-11 h-13 sm:w-12 sm:h-14 text-center font-bold text-lg sm:text-xl text-[var(--color-brand-navy)]',
              'rounded-xl border transition-all duration-150 ease-in-out select-none',
              'outline-hidden shadow-2xs',
              disabled &&
                'bg-[var(--color-app-bg)] text-[var(--color-text-muted)] cursor-not-allowed border-[var(--color-border-subtle)]',
              !disabled &&
                !hasError &&
                !isFilled &&
                'bg-[var(--color-surface-white)] border-[var(--color-border-subtle)] hover:border-[var(--color-border-hover)] focus:border-[var(--color-brand-blue)] focus:ring-2 focus:ring-[var(--color-brand-blue)]/20',
              !disabled &&
                !hasError &&
                isFilled &&
                'bg-[var(--color-brand-blue-light)]/40 border-[var(--color-brand-blue)] text-[var(--color-brand-blue)] focus:ring-2 focus:ring-[var(--color-brand-blue)]/25',
              !disabled &&
                hasError &&
                'border-[var(--color-status-error)] bg-red-50/40 text-[var(--color-status-error)] focus:border-[var(--color-status-error)] focus:ring-2 focus:ring-[var(--color-status-error)]/20'
            )}
          />
        );
      })}
    </div>
  );
};
