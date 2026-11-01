import { cn } from '../index';
import { colors } from '@sudobility/design';

/**
 * WaterMeter Component
 *
 * Utilities component with full dark mode support.
 *
 * @component
 * @example
 * ```tsx
 * <WaterMeter className="custom-class" />
 * ```
 */
export interface WaterMeterProps {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const WaterMeter = ({
  className,
  children,
  disabled,
}: WaterMeterProps) => {
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
      aria-label='WaterMeter'
    >
      {children || 'WaterMeter Component'}
    </div>
  );
};
