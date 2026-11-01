import { cn } from './lib/utils';
import { colors } from '@sudobility/design';

/**
 * CandidateCard Component
 *
 * HR & recruiting component with full dark mode support.
 *
 * @component
 * @example
 * ```tsx
 * <CandidateCard className="custom-class" />
 * ```
 */
export interface CandidateCardProps {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const CandidateCard = ({
  className,
  children,
  disabled,
}: CandidateCardProps) => {
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
      aria-label='CandidateCard'
    >
      {children || 'CandidateCard Component'}
    </div>
  );
};
