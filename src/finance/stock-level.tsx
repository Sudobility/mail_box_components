import { cn } from './lib/utils';
import { colors } from '@sudobility/design';

/**
 * StockLevel Component
 *
 * Inventory management component with full dark mode support.
 *
 * @component
 * @example
 * ```tsx
 * <StockLevel className="custom-class" />
 * ```
 */
export interface StockLevelProps {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const StockLevel = ({
  className,
  children,
  disabled,
}: StockLevelProps) => {
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
      aria-label='StockLevel'
    >
      {children || 'StockLevel Component'}
    </div>
  );
};
