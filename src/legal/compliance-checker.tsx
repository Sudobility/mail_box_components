import { cn } from './lib/utils';
import { colors } from '@sudobility/design';

/**
 * ComplianceChecker Component
 *
 * Legal & compliance component with full dark mode support.
 *
 * @component
 * @example
 * ```tsx
 * <ComplianceChecker className="custom-class" />
 * ```
 */
export interface ComplianceCheckerProps {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const ComplianceChecker = ({
  className,
  children,
  disabled,
}: ComplianceCheckerProps) => {
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
      aria-label='ComplianceChecker'
    >
      {children || 'ComplianceChecker Component'}
    </div>
  );
};
