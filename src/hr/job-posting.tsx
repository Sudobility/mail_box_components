import { cn } from './lib/utils';
import { colors } from '@sudobility/design';

/**
 * JobPosting Component
 *
 * HR & recruiting component with full dark mode support.
 *
 * @component
 * @example
 * ```tsx
 * <JobPosting className="custom-class" />
 * ```
 */
export interface JobPostingProps {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const JobPosting = ({
  className,
  children,
  disabled,
}: JobPostingProps) => {
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
      aria-label='JobPosting'
    >
      {children || 'JobPosting Component'}
    </div>
  );
};
