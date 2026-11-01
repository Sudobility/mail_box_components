import { cn } from '../index';
import { colors } from '@sudobility/design';

/**
 * ScoreBoard Component
 *
 * Sports component with full dark mode support.
 *
 * @component
 * @example
 * ```tsx
 * <ScoreBoard className="custom-class" />
 * ```
 */
export interface ScoreBoardProps {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const ScoreBoard = ({
  className,
  children,
  disabled,
}: ScoreBoardProps) => {
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
      aria-label='ScoreBoard'
    >
      {children || 'ScoreBoard Component'}
    </div>
  );
};
