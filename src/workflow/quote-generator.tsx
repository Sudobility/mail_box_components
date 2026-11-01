import { cn } from '../index';
import { colors } from '@sudobility/design';

/**
 * QuoteGenerator Component
 *
 * Insurance component with full dark mode support.
 *
 * @component
 * @example
 * ```tsx
 * <QuoteGenerator className="custom-class" />
 * ```
 */
export interface QuoteGeneratorProps {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const QuoteGenerator = ({
  className,
  children,
  disabled,
}: QuoteGeneratorProps) => {
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
      aria-label='QuoteGenerator'
    >
      {children || 'QuoteGenerator Component'}
    </div>
  );
};
