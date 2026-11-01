import { cn } from '../index';
import { colors } from '@sudobility/design';

/**
 * RecyclingTracker Component
 *
 * Environmental/sustainability component with full dark mode support.
 *
 * @component
 * @example
 * ```tsx
 * <RecyclingTracker className="custom-class" />
 * ```
 */
export interface RecyclingTrackerProps {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const RecyclingTracker = ({
  className,
  children,
  disabled,
}: RecyclingTrackerProps) => {
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
      aria-label='RecyclingTracker'
    >
      {children || 'RecyclingTracker Component'}
    </div>
  );
};
