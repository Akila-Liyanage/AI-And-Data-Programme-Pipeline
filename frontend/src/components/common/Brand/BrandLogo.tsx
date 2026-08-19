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
 * SLT-MOBITEL Iconic Signal Mark SVG
 */
export const SltSignalMark: React.FC<{ className?: string; size?: number }> = ({
  className,
  size = 32,
}) => {
  return (
    <svg
      width={size}
      height={Math.round(size * 1.05)}
      viewBox="0 0 54 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('shrink-0 select-none', className)}
      aria-hidden="true"
    >
      {/* Top Left Cyan Bar */}
      <path d="M25 6 L7 32" stroke="#00A9E0" strokeWidth="7.5" strokeLinecap="round" />
      {/* Bottom Left Deep Blue Bar */}
      <path d="M25 30 L7 54" stroke="#0057A8" strokeWidth="7.5" strokeLinecap="round" />
      {/* Center Green Dot */}
      <circle cx="31" cy="32" r="5" fill="#00A651" />
      {/* Right Green Bar */}
      <path d="M51 22 L33 54" stroke="#00A651" strokeWidth="7.5" strokeLinecap="round" />
    </svg>
  );
};

/**
 * Full SLT-MOBITEL Logo Component
 */
export const SltMobitelLogo: React.FC<{
  className?: string;
  theme?: 'light' | 'dark';
  height?: number;
}> = ({ className, theme = 'light', height = 36 }) => {
  const isDark = theme === 'dark';
  const width = Math.round(height * 2.8);

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 250 82"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('shrink-0 select-none', className)}
      role="img"
      aria-label="SLT-MOBITEL"
    >
      {/* Signal Mark */}
      <g>
        <path d="M23 8 L8 32" stroke="#00A9E0" strokeWidth="7" strokeLinecap="round" />
        <path d="M23 30 L8 54" stroke={isDark ? '#38BDF8' : '#0057A8'} strokeWidth="7" strokeLinecap="round" />
        <circle cx="29" cy="32" r="4.5" fill="#00A651" />
        <path d="M47 22 L32 54" stroke="#00A651" strokeWidth="7" strokeLinecap="round" />
      </g>

      {/* SLT */}
      <text
        x="56"
        y="50"
        fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
        fontSize="34"
        fontWeight="900"
        letterSpacing="-0.5"
        fill={isDark ? '#FFFFFF' : '#0057A8'}
      >
        SLT
      </text>

      {/* MOBITEL */}
      <text
        x="122"
        y="50"
        fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
        fontSize="34"
        fontWeight="900"
        letterSpacing="-0.5"
        fill="#00A651"
      >
        MOBITEL
      </text>

      {/* Slogan "The Connection" */}
      <text
        x="158"
        y="70"
        textAnchor="middle"
        fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
        fontSize="12"
        fontWeight="600"
        letterSpacing="2.2"
        fill={isDark ? '#94A3B8' : '#0057A8'}
      >
        The Connection
      </text>
    </svg>
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

  const markSize = isSm ? 24 : isLg ? 36 : 28;

  return (
    <div
      className={cn(
        'flex select-none items-center',
        layout === 'vertical' ? 'flex-col text-center' : 'gap-3',
        className
      )}
      {...props}
    >
      {/* SLT-MOBITEL Signal Mark */}
      <div className="flex items-center justify-center shrink-0">
        <SltSignalMark size={markSize} />
      </div>

      {/* Text Branding */}
      <div className={cn('flex flex-col', layout === 'vertical' && 'mt-2')}>
        {/* SLT-MOBITEL Name & AI Division Tag */}
        <div className="flex items-center gap-1.5 leading-tight flex-wrap">
          <span
            className={cn(
              'font-extrabold tracking-tight',
              isDark ? 'text-white' : 'text-[var(--color-brand-blue)]',
              isSm && 'text-sm',
              size === 'md' && 'text-base',
              isLg && 'text-lg'
            )}
          >
            SLT<span className="text-[var(--color-brand-green)]">MOBITEL</span>
          </span>

          <span
            className={cn(
              'inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase',
              isDark
                ? 'bg-white/15 text-blue-200 border border-white/20'
                : 'bg-[var(--color-brand-blue-light)] text-[var(--color-brand-blue)] border border-[#BFDBFE]'
            )}
          >
            AI & DATA
          </span>
        </div>

        {/* Platform Title */}
        {showPlatformName && (
          <span
            className={cn(
              'font-bold tracking-tight mt-0.5 leading-tight',
              isDark ? 'text-slate-100' : 'text-[var(--color-brand-navy)]',
              isSm && 'text-xs',
              size === 'md' && 'text-sm',
              isLg && 'text-base'
            )}
          >
            Programme Pipeline
          </span>
        )}

        {/* Subtitle */}
        {showSubtitle && (
          <span
            className={cn(
              'font-medium leading-tight mt-0.5',
              isDark ? 'text-slate-300' : 'text-[var(--color-text-secondary)]',
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
