import React from 'react';
import { cn } from '../../../utils/cn';

export interface BrandLogoProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  layout?: 'horizontal' | 'vertical';
  showSubtitle?: boolean;
  showPlatformName?: boolean;
  theme?: 'light' | 'dark';
}

/**
 * SLT-MOBITEL Iconic Signal Mark Component
 */
export const SltSignalMark: React.FC<{ className?: string; size?: number }> = ({
  className,
  size = 28,
}) => {
  return (
    <div
      style={{ width: size, height: size }}
      className={cn('shrink-0 select-none flex items-center justify-center overflow-hidden', className)}
    >
      <img
        src="/slt-mobitel-logo.png"
        alt="SLTMOBITEL"
        className="w-full h-full object-contain object-left"
      />
    </div>
  );
};

/**
 * Full SLT-MOBITEL Official Logo Component
 */
export const SltMobitelLogo: React.FC<{
  className?: string;
  theme?: 'light' | 'dark';
  height?: number;
}> = ({ className, height = 36 }) => {
  return (
    <div
      style={{ height }}
      className={cn('shrink-0 select-none flex items-center', className)}
    >
      <img
        src="/slt-mobitel-logo.png"
        alt="SLTMOBITEL - The Connection"
        style={{ height }}
        className="w-auto max-h-full object-contain"
      />
    </div>
  );
};

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className,
  size = 'md',
  layout = 'horizontal',
  showSubtitle = true,
  showPlatformName = true,
  theme = 'light',
  ...props
}) => {
  const isLg = size === 'lg';
  const isSm = size === 'sm';
  const isDark = theme === 'dark';

  const logoHeight = isSm ? 28 : isLg ? 42 : 34;

  return (
    <div
      className={cn(
        'flex select-none',
        layout === 'vertical' ? 'flex-col items-center text-center' : 'items-center gap-2.5',
        className
      )}
      {...props}
    >
      {/* Official SLT-MOBITEL Image Logo */}
      <div className="shrink-0 flex items-center">
        <img
          src="/slt-mobitel-logo.png"
          alt="SLTMOBITEL"
          style={{ height: logoHeight }}
          className="w-auto max-h-full object-contain filter drop-shadow-2xs"
        />
      </div>

      {/* Division Badge & Platform Tag */}
      {(showPlatformName || showSubtitle) && (
        <div className={cn('flex flex-col min-w-0', layout === 'vertical' ? 'mt-1.5' : 'pl-1 border-l border-slate-200')}>
          <div className="flex items-center gap-1.5 leading-tight flex-wrap">
            <span
              className={cn(
                'inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-extrabold tracking-wider uppercase',
                isDark
                  ? 'bg-white/15 text-blue-200 border border-white/20'
                  : 'bg-blue-50 text-blue-700 border border-blue-200'
              )}
            >
              AI & DATA
            </span>
          </div>

          {/* Platform Title */}
          {showPlatformName && (
            <span
              className={cn(
                'font-bold tracking-tight leading-tight mt-0.5 truncate',
                isDark ? 'text-slate-100' : 'text-slate-900',
                isSm && 'text-[11px]',
                size === 'md' && 'text-xs',
                isLg && 'text-sm'
              )}
            >
              Programme Pipeline
            </span>
          )}

          {/* Subtitle */}
          {showSubtitle && (
            <span
              className={cn(
                'font-medium leading-tight text-[10px] text-slate-500 truncate',
                isDark && 'text-slate-300'
              )}
            >
              Staff & Intern Portal
            </span>
          )}
        </div>
      )}
    </div>
  );
};
