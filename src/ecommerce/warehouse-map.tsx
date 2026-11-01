import { cn } from './lib/utils';
import { colors } from '@sudobility/design';

/**
 * WarehouseMap Component
 *
 * Inventory management component with full dark mode support.
 *
 * @component
 * @example
 * ```tsx
 * <WarehouseMap className="custom-class" />
 * ```
 */
export interface WarehouseMapProps {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const WarehouseMap = ({
  className,
  children,
  disabled,
}: WarehouseMapProps) => {
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
      aria-label='WarehouseMap'
    >
      {children || 'WarehouseMap Component'}
    </div>
  );
};
