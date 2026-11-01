import { cn } from '../index';
import { colors } from '@sudobility/design';

/**
 * VesselTracker Component
 *
 * Maritime component with full dark mode support.
 *
 * @component
 * @example
 * ```tsx
 * <VesselTracker className="custom-class" />
 * ```
 */
export interface VesselTrackerProps {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const VesselTracker = ({
  className,
  children,
  disabled,
}: VesselTrackerProps) => {
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
      aria-label='VesselTracker'
    >
      {children || 'VesselTracker Component'}
    </div>
  );
};
