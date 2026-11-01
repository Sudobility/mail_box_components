import { cn } from '../index';
import { colors } from '@sudobility/design';

/**
 * AccountOverview Component
 *
 * Banking component with full dark mode support.
 *
 * @component
 * @example
 * ```tsx
 * <AccountOverview className="custom-class" />
 * ```
 */
export interface AccountOverviewProps {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const AccountOverview = ({
  className,
  children,
  disabled,
}: AccountOverviewProps) => {
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
      aria-label='AccountOverview'
    >
      {children || 'AccountOverview Component'}
    </div>
  );
};
