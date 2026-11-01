import { cn } from '../index';
import { colors } from '@sudobility/design';

/**
 * SafetyChecklist Component
 *
 * Construction component with full dark mode support.
 *
 * @component
 * @example
 * ```tsx
 * <SafetyChecklist className="custom-class" />
 * ```
 */
export interface SafetyChecklistProps {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const SafetyChecklist = ({
  className,
  children,
  disabled,
}: SafetyChecklistProps) => {
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
      aria-label='SafetyChecklist'
    >
      {children || 'SafetyChecklist Component'}
    </div>
  );
};
