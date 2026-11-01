import { cn } from '../index';
import { colors } from '@sudobility/design';

/**
 * EmailAnalytics Component
 *
 * Email marketing component with full dark mode support.
 *
 * @component
 * @example
 * ```tsx
 * <EmailAnalytics className="custom-class" />
 * ```
 */
export interface EmailAnalyticsProps {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const EmailAnalytics = ({
  className,
  children,
  disabled,
}: EmailAnalyticsProps) => {
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
      aria-label='EmailAnalytics'
    >
      {children || 'EmailAnalytics Component'}
    </div>
  );
};
