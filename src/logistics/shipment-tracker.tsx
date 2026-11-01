import { cn } from '../index';
import { colors } from '@sudobility/design';

/**
 * ShipmentTracker Component
 *
 * Supply chain component with full dark mode support.
 *
 * @component
 * @example
 * ```tsx
 * <ShipmentTracker className="custom-class" />
 * ```
 */
export interface ShipmentTrackerProps {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const ShipmentTracker = ({
  className,
  children,
  disabled,
}: ShipmentTrackerProps) => {
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
      aria-label='ShipmentTracker'
    >
      {children || 'ShipmentTracker Component'}
    </div>
  );
};
