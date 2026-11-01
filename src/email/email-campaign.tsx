import { cn } from '../index';
import { colors } from '@sudobility/design';

/**
 * EmailCampaign Component
 *
 * Email marketing component with full dark mode support.
 *
 * @component
 * @example
 * ```tsx
 * <EmailCampaign className="custom-class" />
 * ```
 */
export interface EmailCampaignProps {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const EmailCampaign = ({
  className,
  children,
  disabled,
}: EmailCampaignProps) => {
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
      aria-label='EmailCampaign'
    >
      {children || 'EmailCampaign Component'}
    </div>
  );
};
