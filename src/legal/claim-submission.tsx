import { cn } from '../index';
import { colors } from '@sudobility/design';

/**
 * ClaimSubmission Component
 *
 * Insurance component with full dark mode support.
 *
 * @component
 * @example
 * ```tsx
 * <ClaimSubmission className="custom-class" />
 * ```
 */
export interface ClaimSubmissionProps {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const ClaimSubmission = ({
  className,
  children,
  disabled,
}: ClaimSubmissionProps) => {
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
      aria-label='ClaimSubmission'
    >
      {children || 'ClaimSubmission Component'}
    </div>
  );
};
