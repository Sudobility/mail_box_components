import { cn } from './lib/utils';
import { colors } from '@sudobility/design';

/**
 * InventoryScanner Component
 *
 * Retail component with full dark mode support.
 *
 * @component
 * @example
 * ```tsx
 * <InventoryScanner className="custom-class" />
 * ```
 */
export interface InventoryScannerProps {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const InventoryScanner = ({
  className,
  children,
  disabled,
}: InventoryScannerProps) => {
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
      aria-label='InventoryScanner'
    >
      {children || 'InventoryScanner Component'}
    </div>
  );
};
