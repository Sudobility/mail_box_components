import { cn } from '../index';
import { colors } from '@sudobility/design';

/**
 * HarvestTracker Component
 *
 * Agriculture component with full dark mode support.
 *
 * @component
 * @example
 * ```tsx
 * <HarvestTracker className="custom-class" />
 * ```
 */
export interface HarvestTrackerProps {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const HarvestTracker = ({
  className,
  children,
  disabled,
}: HarvestTrackerProps) => {
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
      aria-label='HarvestTracker'
    >
      {children || 'HarvestTracker Component'}
    </div>
  );
};
