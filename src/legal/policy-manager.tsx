import { cn } from '../index';
import { colors } from '@sudobility/design';

/**
 * PolicyManager Component
 *
 * Insurance component with full dark mode support.
 *
 * @component
 * @example
 * ```tsx
 * <PolicyManager className="custom-class" />
 * ```
 */
export interface PolicyManagerProps {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const PolicyManager = ({
  className,
  children,
  disabled,
}: PolicyManagerProps) => {
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
      aria-label='PolicyManager'
    >
      {children || 'PolicyManager Component'}
    </div>
  );
};
