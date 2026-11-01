import { cn } from '../index';
import { colors } from '@sudobility/design';

/**
 * VitalSigns Component
 *
 * Healthcare component with full dark mode support.
 *
 * @component
 * @example
 * ```tsx
 * <VitalSigns className="custom-class" />
 * ```
 */
export interface VitalSignsProps {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const VitalSigns = ({
  className,
  children,
  disabled,
}: VitalSignsProps) => {
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
      aria-label='VitalSigns'
    >
      {children || 'VitalSigns Component'}
    </div>
  );
};
