import { cn } from '../index';
import { colors } from '@sudobility/design';

/**
 * PermitApplication Component
 *
 * Government component with full dark mode support.
 *
 * @component
 * @example
 * ```tsx
 * <PermitApplication className="custom-class" />
 * ```
 */
export interface PermitApplicationProps {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const PermitApplication = ({
  className,
  children,
  disabled,
}: PermitApplicationProps) => {
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
      aria-label='PermitApplication'
    >
      {children || 'PermitApplication Component'}
    </div>
  );
};
