import { cn } from '../index';
import { colors } from '@sudobility/design';

/**
 * AbTestEmail Component
 *
 * Email marketing component with full dark mode support.
 *
 * @component
 * @example
 * ```tsx
 * <AbTestEmail className="custom-class" />
 * ```
 */
export interface AbTestEmailProps {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const AbTestEmail = ({
  className,
  children,
  disabled,
}: AbTestEmailProps) => {
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
      aria-label='AbTestEmail'
    >
      {children || 'AbTestEmail Component'}
    </div>
  );
};
