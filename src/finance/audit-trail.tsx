import { cn } from '../index';
import { colors } from '@sudobility/design';

/**
 * AuditTrail Component
 *
 * Legal & compliance component with full dark mode support.
 *
 * @component
 * @example
 * ```tsx
 * <AuditTrail className="custom-class" />
 * ```
 */
export interface AuditTrailProps {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const AuditTrail = ({
  className,
  children,
  disabled,
}: AuditTrailProps) => {
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
      aria-label='AuditTrail'
    >
      {children || 'AuditTrail Component'}
    </div>
  );
};
