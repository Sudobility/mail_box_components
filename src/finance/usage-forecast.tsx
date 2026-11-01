import { cn } from '../index';
import { colors } from '@sudobility/design';

/**
 * UsageForecast Component
 *
 * Energy component with full dark mode support.
 *
 * @component
 * @example
 * ```tsx
 * <UsageForecast className="custom-class" />
 * ```
 */
export interface UsageForecastProps {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const UsageForecast = ({
  className,
  children,
  disabled,
}: UsageForecastProps) => {
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
      aria-label='UsageForecast'
    >
      {children || 'UsageForecast Component'}
    </div>
  );
};
