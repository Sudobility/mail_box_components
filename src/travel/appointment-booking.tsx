import { cn } from './lib/utils';
import { colors } from '@sudobility/design';

/**
 * AppointmentBooking Component
 *
 * Healthcare component with full dark mode support.
 *
 * @component
 * @example
 * ```tsx
 * <AppointmentBooking className="custom-class" />
 * ```
 */
export interface AppointmentBookingProps {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const AppointmentBooking = ({
  className,
  children,
  disabled,
}: AppointmentBookingProps) => {
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
      aria-label='AppointmentBooking'
    >
      {children || 'AppointmentBooking Component'}
    </div>
  );
};
