import { cn } from '../index';
import { colors } from '@sudobility/design';

/**
 * TicketSystem Component
 *
 * Customer support component with full dark mode support.
 *
 * @component
 * @example
 * ```tsx
 * <TicketSystem className="custom-class" />
 * ```
 */
export interface TicketSystemProps {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const TicketSystem = ({
  className,
  children,
  disabled,
}: TicketSystemProps) => {
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
      aria-label='TicketSystem'
    >
      {children || 'TicketSystem Component'}
    </div>
  );
};
