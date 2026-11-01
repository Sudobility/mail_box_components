import { cn } from '../index';
import { colors } from '@sudobility/design';

/**
 * PortSchedule Component
 *
 * Maritime component with full dark mode support.
 *
 * @component
 * @example
 * ```tsx
 * <PortSchedule className="custom-class" />
 * ```
 */
export interface PortScheduleProps {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const PortSchedule = ({
  className,
  children,
  disabled,
}: PortScheduleProps) => {
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
      aria-label='PortSchedule'
    >
      {children || 'PortSchedule Component'}
    </div>
  );
};
