import { cn } from '../index';
import { colors } from '@sudobility/design';

/**
 * ContactCard Component
 *
 * CRM component with full dark mode support.
 *
 * @component
 * @example
 * ```tsx
 * <ContactCard className="custom-class" />
 * ```
 */
export interface ContactCardProps {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const ContactCard = ({
  className,
  children,
  disabled,
}: ContactCardProps) => {
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
      aria-label='ContactCard'
    >
      {children || 'ContactCard Component'}
    </div>
  );
};
