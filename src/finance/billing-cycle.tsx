import { cn } from '../index';
import { colors } from '@sudobility/design';

/**
 * BillingCycle Component
 *
 * Utilities component with full dark mode support.
 *
 * @component
 * @example
 * ```tsx
 * <BillingCycle className="custom-class" />
 * ```
 */
export interface BillingCycleProps {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const BillingCycle = ({
  className,
  children,
  disabled,
}: BillingCycleProps) => {
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
      aria-label='BillingCycle'
    >
      {children || 'BillingCycle Component'}
    </div>
  );
};
