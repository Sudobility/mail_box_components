import { cn } from '../index';
import { colors } from '@sudobility/design';

/**
 * StreamingStats Component
 *
 * Entertainment component with full dark mode support.
 *
 * @component
 * @example
 * ```tsx
 * <StreamingStats className="custom-class" />
 * ```
 */
export interface StreamingStatsProps {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const StreamingStats = ({
  className,
  children,
  disabled,
}: StreamingStatsProps) => {
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
      aria-label='StreamingStats'
    >
      {children || 'StreamingStats Component'}
    </div>
  );
};
