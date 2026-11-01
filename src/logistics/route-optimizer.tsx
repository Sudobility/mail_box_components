import { cn } from '../index';
import { colors } from '@sudobility/design';

/**
 * RouteOptimizer Component
 *
 * Transportation component with full dark mode support.
 *
 * @component
 * @example
 * ```tsx
 * <RouteOptimizer className="custom-class" />
 * ```
 */
export interface RouteOptimizerProps {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const RouteOptimizer = ({
  className,
  children,
  disabled,
}: RouteOptimizerProps) => {
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
      aria-label='RouteOptimizer'
    >
      {children || 'RouteOptimizer Component'}
    </div>
  );
};
