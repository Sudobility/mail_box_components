import { cn } from '../index';
import { colors } from '@sudobility/design';

/**
 * PowerGrid Component
 *
 * Energy component with full dark mode support.
 *
 * @component
 * @example
 * ```tsx
 * <PowerGrid className="custom-class" />
 * ```
 */
export interface PowerGridProps {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const PowerGrid = ({
  className,
  children,
  disabled,
}: PowerGridProps) => {
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
      aria-label='PowerGrid'
    >
      {children || 'PowerGrid Component'}
    </div>
  );
};
