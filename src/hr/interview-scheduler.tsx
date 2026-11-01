import { cn } from './lib/utils';
import { colors } from '@sudobility/design';

/**
 * InterviewScheduler Component
 *
 * HR & recruiting component with full dark mode support.
 *
 * @component
 * @example
 * ```tsx
 * <InterviewScheduler className="custom-class" />
 * ```
 */
export interface InterviewSchedulerProps {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const InterviewScheduler = ({
  className,
  children,
  disabled,
}: InterviewSchedulerProps) => {
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
      aria-label='InterviewScheduler'
    >
      {children || 'InterviewScheduler Component'}
    </div>
  );
};
