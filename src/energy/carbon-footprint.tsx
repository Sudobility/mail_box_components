import { cn } from './lib/utils';
import { colors } from '@sudobility/design';

/**
 * CarbonFootprint Component
 *
 * Environmental/sustainability component with full dark mode support.
 *
 * @component
 * @example
 * ```tsx
 * <CarbonFootprint className="custom-class" />
 * ```
 */
export interface CarbonFootprintProps {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const CarbonFootprint = ({
  className,
  children,
  disabled,
}: CarbonFootprintProps) => {
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
      aria-label='CarbonFootprint'
    >
      {children || 'CarbonFootprint Component'}
    </div>
  );
};
