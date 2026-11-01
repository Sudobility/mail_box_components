import { cn } from '../index';
import { colors } from '@sudobility/design';

/**
 * TransactionHistory Component
 *
 * Banking component with full dark mode support.
 *
 * @component
 * @example
 * ```tsx
 * <TransactionHistory className="custom-class" />
 * ```
 */
export interface TransactionHistoryProps {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const TransactionHistory = ({
  className,
  children,
  disabled,
}: TransactionHistoryProps) => {
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
      aria-label='TransactionHistory'
    >
      {children || 'TransactionHistory Component'}
    </div>
  );
};
