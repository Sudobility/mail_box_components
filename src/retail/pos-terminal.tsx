import { cn } from '../index';
import { colors } from '@sudobility/design';

/**
 * PosTerminal Component
 *
 * Retail component with full dark mode support.
 *
 * @component
 * @example
 * ```tsx
 * <PosTerminal className="custom-class" />
 * ```
 */
export interface PosTerminalProps {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const PosTerminal = ({
  className,
  children,
  disabled,
}: PosTerminalProps) => {
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
      aria-label='PosTerminal'
    >
      {children || 'PosTerminal Component'}
    </div>
  );
};
