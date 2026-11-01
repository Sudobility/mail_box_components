import { cn } from '../index';
import { colors } from '@sudobility/design';

/**
 * TaskBoard Component
 *
 * Project management component with full dark mode support.
 *
 * @component
 * @example
 * ```tsx
 * <TaskBoard className="custom-class" />
 * ```
 */
export interface TaskBoardProps {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const TaskBoard = ({
  className,
  children,
  disabled,
}: TaskBoardProps) => {
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
      aria-label='TaskBoard'
    >
      {children || 'TaskBoard Component'}
    </div>
  );
};
