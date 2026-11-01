import { cn } from '../index';
import { colors } from '@sudobility/design';

/**
 * WorkoutPlanner Component
 *
 * Sports component with full dark mode support.
 *
 * @component
 * @example
 * ```tsx
 * <WorkoutPlanner className="custom-class" />
 * ```
 */
export interface WorkoutPlannerProps {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const WorkoutPlanner = ({
  className,
  children,
  disabled,
}: WorkoutPlannerProps) => {
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
      aria-label='WorkoutPlanner'
    >
      {children || 'WorkoutPlanner Component'}
    </div>
  );
};
