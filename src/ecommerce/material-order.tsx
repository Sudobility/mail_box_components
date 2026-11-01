import { cn } from '../index';
import { colors } from '@sudobility/design';

/**
 * MaterialOrder Component
 *
 * Construction component with full dark mode support.
 *
 * @component
 * @example
 * ```tsx
 * <MaterialOrder className="custom-class" />
 * ```
 */
export interface MaterialOrderProps {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const MaterialOrder = ({
  className,
  children,
  disabled,
}: MaterialOrderProps) => {
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
      aria-label='MaterialOrder'
    >
      {children || 'MaterialOrder Component'}
    </div>
  );
};
