import { cn } from '../index';
import { colors } from '@sudobility/design';

/**
 * FuelGauge Component
 *
 * Automotive component with full dark mode support.
 *
 * @component
 * @example
 * ```tsx
 * <FuelGauge className="custom-class" />
 * ```
 */
export interface FuelGaugeProps {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const FuelGauge = ({
  className,
  children,
  disabled,
}: FuelGaugeProps) => {
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
      aria-label='FuelGauge'
    >
      {children || 'FuelGauge Component'}
    </div>
  );
};
