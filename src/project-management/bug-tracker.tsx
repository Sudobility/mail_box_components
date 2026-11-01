import { cn } from '../index';
import { colors } from '@sudobility/design';

/**
 * BugTracker Component
 *
 * Quality assurance component with full dark mode support.
 *
 * @component
 * @example
 * ```tsx
 * <BugTracker className="custom-class" />
 * ```
 */
export interface BugTrackerProps {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const BugTracker = ({
  className,
  children,
  disabled,
}: BugTrackerProps) => {
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
      aria-label='BugTracker'
    >
      {children || 'BugTracker Component'}
    </div>
  );
};
