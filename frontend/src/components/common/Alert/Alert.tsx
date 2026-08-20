import React from 'react';
import { cn } from '../../../utils/cn';
import { Info, CheckCircle2, AlertTriangle, AlertCircle, X } from 'lucide-react';

export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

export interface AlertProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  variant?: AlertVariant;
  title?: React.ReactNode;
  onClose?: () => void;
  icon?: React.ReactNode;
}

const variantStyles: Record<
  AlertVariant,
  { container: string; iconColor: string; defaultIcon: React.ReactNode }
> = {
  info: {
    container: 'bg-[#F0F9FF] border-[#BAE6FD] text-[#0369A1]',
    iconColor: 'text-[var(--color-status-info)]',
    defaultIcon: <Info className="w-5 h-5 shrink-0" />,
  },
  success: {
    container: 'bg-[#F0FDF4] border-[#BBF7D0] text-[#15803D]',
    iconColor: 'text-[var(--color-status-success)]',
    defaultIcon: <CheckCircle2 className="w-5 h-5 shrink-0" />,
  },
  warning: {
    container: 'bg-[#FFFBEB] border-[#FDE68A] text-[#B45309]',
    iconColor: 'text-[var(--color-status-warning)]',
    defaultIcon: <AlertTriangle className="w-5 h-5 shrink-0" />,
  },
  error: {
    container: 'bg-[#FEF2F2] border-[#FECACA] text-[#B91C1C]',
    iconColor: 'text-[var(--color-status-error)]',
    defaultIcon: <AlertCircle className="w-5 h-5 shrink-0" />,
  },
};

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      className,
      variant = 'info',
      title,
      onClose,
      icon,
      children,
      ...props
    },
    ref
  ) => {
    const config = variantStyles[variant];

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          'p-4 rounded-xl border flex items-start gap-3 transition-all duration-150',
          config.container,
          className
        )}
        {...props}
      >
        <div className={cn('shrink-0 mt-0.5', config.iconColor)}>
          {icon || config.defaultIcon}
        </div>

        <div className="flex-1 min-w-0 text-sm">
          {title && (
            <h4 className="font-semibold mb-1 leading-snug">
              {title}
            </h4>
          )}
          <div className="leading-relaxed">{children}</div>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Dismiss alert"
            className="shrink-0 p-1 rounded-md hover:bg-black/5 active:bg-black/10 transition-colors cursor-pointer text-current opacity-70 hover:opacity-100"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  }
);

Alert.displayName = 'Alert';
