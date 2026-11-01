import { cn } from '../index';
import { colors } from '@sudobility/design';

/**
 * SalesReport Component
 *
 * Retail component with full dark mode support.
 *
 * @component
 * @example
 * ```tsx
 * <SalesReport className="custom-class" />
 * ```
 */
export interface SalesReportProps {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const SalesReport = ({
  className,
  children,
  disabled,
}: SalesReportProps) => {
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
      aria-label='SalesReport'
    >
      {children || 'SalesReport Component'}
    </div>
  );
};
