import { cn } from '../index';
import { colors } from '@sudobility/design';

/**
 * LoadPlanner Component
 *
 * Logistics component with full dark mode support.
 *
 * @component
 * @example
 * ```tsx
 * <LoadPlanner className="custom-class" />
 * ```
 */
export interface LoadPlannerProps {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const LoadPlanner = ({
  className,
  children,
  disabled,
}: LoadPlannerProps) => {
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
      aria-label='LoadPlanner'
    >
      {children || 'LoadPlanner Component'}
    </div>
  );
};
