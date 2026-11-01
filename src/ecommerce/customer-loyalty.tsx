import { cn } from '../index';
import { colors } from '@sudobility/design';

/**
 * CustomerLoyalty Component
 *
 * Retail component with full dark mode support.
 *
 * @component
 * @example
 * ```tsx
 * <CustomerLoyalty className="custom-class" />
 * ```
 */
export interface CustomerLoyaltyProps {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const CustomerLoyalty = ({
  className,
  children,
  disabled,
}: CustomerLoyaltyProps) => {
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
      aria-label='CustomerLoyalty'
    >
      {children || 'CustomerLoyalty Component'}
    </div>
  );
};
