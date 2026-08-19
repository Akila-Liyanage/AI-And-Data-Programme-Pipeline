import React from 'react';
import { cn } from '../../../utils/cn';

export interface BrandLogoProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  layout?: 'horizontal' | 'vertical';
  showSubtitle?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className,
  size = 'md',
  layout = 'horizontal',
  showSubtitle = true,
  ...props
}) => {
  const isLg = size === 'lg';
  const isSm = size === 'sm';

  return (
    <div
      className={cn(
        'flex select-none',
        layout === 'vertical' ? 'flex-col items-center text-center' : 'items-center gap-3',
        className
      )}
      {...props}
    >
      {/* Visual Accent Pill / Emblem */}
      <div
        className={cn(
          'flex items-center justify-center font-bold tracking-wider rounded-lg shrink-0',
          'bg-[var(--color-brand-navy)] text-white shadow-xs',
          isSm && 'w-7 h-7 text-xs rounded-md',
          size === 'md' && 'w-9 h-9 text-sm rounded-lg',
          isLg && 'w-11 h-11 text-base rounded-xl'
        )}
      >
        <span className="text-[var(--color-brand-blue-light)]">AI</span>
        <span className="text-[var(--color-brand-green)] font-extrabold">+</span>
      </div>

      {/* Text Branding */}
      <div className={cn('flex flex-col', layout === 'vertical' && 'mt-2')}>
        <div className="flex items-center gap-1.5 leading-tight">
          <span
            className={cn(
              'font-bold tracking-tight text-[var(--color-brand-navy)]',
              isSm && 'text-sm',
              size === 'md' && 'text-base',
              isLg && 'text-xl'
            )}
          >
            AI & Data Programme Pipeline
          </span>
        </div>

        {showSubtitle && (
          <span
            className={cn(
              'text-[var(--color-text-secondary)] font-medium leading-tight',
              isSm && 'text-[10px]',
              size === 'md' && 'text-xs',
              isLg && 'text-sm'
            )}
          >
            Staff & Intern Progress Dashboard
          </span>
        )}
      </div>
    </div>
  );
};
