import { cn } from '../index';
import { colors } from '@sudobility/design';

/**
 * TournamentBracket Component
 *
 * Gaming component with full dark mode support.
 *
 * @component
 * @example
 * ```tsx
 * <TournamentBracket className="custom-class" />
 * ```
 */
export interface TournamentBracketProps {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const TournamentBracket = ({
  className,
  children,
  disabled,
}: TournamentBracketProps) => {
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
      aria-label='TournamentBracket'
    >
      {children || 'TournamentBracket Component'}
    </div>
  );
};
