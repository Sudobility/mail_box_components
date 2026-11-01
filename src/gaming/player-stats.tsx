import { cn } from '../index';
import { colors } from '@sudobility/design';

/**
 * PlayerStats Component
 *
 * Gaming component with full dark mode support.
 *
 * @component
 * @example
 * ```tsx
 * <PlayerStats className="custom-class" />
 * ```
 */
export interface PlayerStatsProps {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const PlayerStats = ({
  className,
  children,
  disabled,
}: PlayerStatsProps) => {
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
      aria-label='PlayerStats'
    >
      {children || 'PlayerStats Component'}
    </div>
  );
};
