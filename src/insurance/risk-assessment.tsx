import { cn } from '../index';
import { colors } from '@sudobility/design';

/**
 * RiskAssessment Component
 *
 * Insurance component with full dark mode support.
 *
 * @component
 * @example
 * ```tsx
 * <RiskAssessment className="custom-class" />
 * ```
 */
export interface RiskAssessmentProps {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const RiskAssessment = ({
  className,
  children,
  disabled,
}: RiskAssessmentProps) => {
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
      aria-label='RiskAssessment'
    >
      {children || 'RiskAssessment Component'}
    </div>
  );
};
