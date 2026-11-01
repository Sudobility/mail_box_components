import { cn } from '../index';
import { colors } from '@sudobility/design';

/**
 * DriverLog Component
 *
 * Transportation component with full dark mode support.
 *
 * @component
 * @example
 * ```tsx
 * <DriverLog className="custom-class" />
 * ```
 */
export interface DriverLogProps {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const DriverLog = ({
  className,
  children,
  disabled,
}: DriverLogProps) => {
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
      aria-label='DriverLog'
    >
      {children || 'DriverLog Component'}
    </div>
  );
};
