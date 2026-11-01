import { cn } from './lib/utils';
import { colors } from '@sudobility/design';

/**
 * TripMeter Component
 *
 * Automotive component with full dark mode support.
 *
 * @component
 * @example
 * ```tsx
 * <TripMeter className="custom-class" />
 * ```
 */
export interface TripMeterProps {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const TripMeter = ({
  className,
  children,
  disabled,
}: TripMeterProps) => {
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
      aria-label='TripMeter'
    >
      {children || 'TripMeter Component'}
    </div>
  );
};
