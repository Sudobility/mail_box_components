import { cn } from '../index';
import { colors } from '@sudobility/design';

/**
 * ReorderPoint Component
 *
 * Inventory management component with full dark mode support.
 *
 * @component
 * @example
 * ```tsx
 * <ReorderPoint className="custom-class" />
 * ```
 */
export interface ReorderPointProps {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const ReorderPoint = ({
  className,
  children,
  disabled,
}: ReorderPointProps) => {
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
      aria-label='ReorderPoint'
    >
      {children || 'ReorderPoint Component'}
    </div>
  );
};
