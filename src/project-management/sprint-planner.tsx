import { cn } from '../index';
import { colors } from '@sudobility/design';

/**
 * SprintPlanner Component
 *
 * Project management component with full dark mode support.
 *
 * @component
 * @example
 * ```tsx
 * <SprintPlanner className="custom-class" />
 * ```
 */
export interface SprintPlannerProps {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const SprintPlanner = ({
  className,
  children,
  disabled,
}: SprintPlannerProps) => {
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
      aria-label='SprintPlanner'
    >
      {children || 'SprintPlanner Component'}
    </div>
  );
};
