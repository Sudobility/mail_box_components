import { cn } from '../index';
import { colors } from '@sudobility/design';

/**
 * LoanCalculator Component
 *
 * Banking component with full dark mode support.
 *
 * @component
 * @example
 * ```tsx
 * <LoanCalculator className="custom-class" />
 * ```
 */
export interface LoanCalculatorProps {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const LoanCalculator = ({
  className,
  children,
  disabled,
}: LoanCalculatorProps) => {
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
      aria-label='LoanCalculator'
    >
      {children || 'LoanCalculator Component'}
    </div>
  );
};
