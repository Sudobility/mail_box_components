import { cn } from '../index';
import { colors } from '@sudobility/design';

/**
 * WeatherStation Component
 *
 * Agriculture component with full dark mode support.
 *
 * @component
 * @example
 * ```tsx
 * <WeatherStation className="custom-class" />
 * ```
 */
export interface WeatherStationProps {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const WeatherStation = ({
  className,
  children,
  disabled,
}: WeatherStationProps) => {
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
      aria-label='WeatherStation'
    >
      {children || 'WeatherStation Component'}
    </div>
  );
};
