import { cn } from '../index';
import { colors } from '@sudobility/design';

/**
 * CrmDashboard Component
 *
 * CRM component with full dark mode support.
 *
 * @component
 * @example
 * ```tsx
 * <CrmDashboard className="custom-class" />
 * ```
 */
export interface CrmDashboardProps {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const CrmDashboard = ({
  className,
  children,
  disabled,
}: CrmDashboardProps) => {
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
      aria-label='CrmDashboard'
    >
      {children || 'CrmDashboard Component'}
    </div>
  );
};
