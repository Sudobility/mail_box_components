import { cn } from '../index';
import { colors } from '@sudobility/design';

/**
 * GrantApplication Component
 *
 * Non-profit component with full dark mode support.
 *
 * @component
 * @example
 * ```tsx
 * <GrantApplication className="custom-class" />
 * ```
 */
export interface GrantApplicationProps {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const GrantApplication = ({
  className,
  children,
  disabled,
}: GrantApplicationProps) => {
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
      aria-label='GrantApplication'
    >
      {children || 'GrantApplication Component'}
    </div>
  );
};
