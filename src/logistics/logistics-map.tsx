import { cn } from '../index';
import { colors } from '@sudobility/design';

/**
 * LogisticsMap Component
 *
 * Supply chain component with full dark mode support.
 *
 * @component
 * @example
 * ```tsx
 * <LogisticsMap className="custom-class" />
 * ```
 */
export interface LogisticsMapProps {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const LogisticsMap = ({
  className,
  children,
  disabled,
}: LogisticsMapProps) => {
  return (
    <div
      className={cn(
        'p-4 rounded-lg border transition-colors',
        colors.component.card.default.base,
        colors.component.card.default.dark,
        'text-foreground',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      role='region'
      aria-label='LogisticsMap'
    >
      {children || 'LogisticsMap Component'}
    </div>
  );
};
