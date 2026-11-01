import { cn } from '../index';
import { colors } from '@sudobility/design';

/**
 * EnergyMonitor Component
 *
 * Environmental/sustainability component with full dark mode support.
 *
 * @component
 * @example
 * ```tsx
 * <EnergyMonitor className="custom-class" />
 * ```
 */
export interface EnergyMonitorProps {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const EnergyMonitor = ({
  className,
  children,
  disabled,
}: EnergyMonitorProps) => {
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
      aria-label='EnergyMonitor'
    >
      {children || 'EnergyMonitor Component'}
    </div>
  );
};
