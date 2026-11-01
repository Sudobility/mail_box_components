import { cn } from '../index';
import { colors } from '@sudobility/design';

/**
 * FlightStatus Component
 *
 * Aviation component with full dark mode support.
 *
 * @component
 * @example
 * ```tsx
 * <FlightStatus className="custom-class" />
 * ```
 */
export interface FlightStatusProps {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const FlightStatus = ({
  className,
  children,
  disabled,
}: FlightStatusProps) => {
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
      aria-label='FlightStatus'
    >
      {children || 'FlightStatus Component'}
    </div>
  );
};
