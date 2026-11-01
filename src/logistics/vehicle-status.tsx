import { cn } from './lib/utils';
import { colors } from '@sudobility/design';

/**
 * VehicleStatus Component
 *
 * Automotive component with full dark mode support.
 *
 * @component
 * @example
 * ```tsx
 * <VehicleStatus className="custom-class" />
 * ```
 */
export interface VehicleStatusProps {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const VehicleStatus = ({
  className,
  children,
  disabled,
}: VehicleStatusProps) => {
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
      aria-label='VehicleStatus'
    >
      {children || 'VehicleStatus Component'}
    </div>
  );
};
