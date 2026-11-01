import { cn } from './lib/utils';
import { colors } from '@sudobility/design';

/**
 * InventoryAlert Component
 *
 * Inventory management component with full dark mode support.
 *
 * @component
 * @example
 * ```tsx
 * <InventoryAlert className="custom-class" />
 * ```
 */
export interface InventoryAlertProps {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const InventoryAlert = ({
  className,
  children,
  disabled,
}: InventoryAlertProps) => {
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
      aria-label='InventoryAlert'
    >
      {children || 'InventoryAlert Component'}
    </div>
  );
};
