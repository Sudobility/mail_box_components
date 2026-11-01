import { cn } from '../index';
import { colors } from '@sudobility/design';

/**
 * OnboardingChecklist Component
 *
 * HR & recruiting component with full dark mode support.
 *
 * @component
 * @example
 * ```tsx
 * <OnboardingChecklist className="custom-class" />
 * ```
 */
export interface OnboardingChecklistProps {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const OnboardingChecklist = ({
  className,
  children,
  disabled,
}: OnboardingChecklistProps) => {
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
      aria-label='OnboardingChecklist'
    >
      {children || 'OnboardingChecklist Component'}
    </div>
  );
};
