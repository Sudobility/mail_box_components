import { cn } from '../index';
import { colors } from '@sudobility/design';

/**
 * CallCenter Component
 *
 * Telecommunications component with full dark mode support.
 *
 * @component
 * @example
 * ```tsx
 * <CallCenter className="custom-class" />
 * ```
 */
export interface CallCenterProps {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const CallCenter = ({
  className,
  children,
  disabled,
}: CallCenterProps) => {
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
      aria-label='CallCenter'
    >
      {children || 'CallCenter Component'}
    </div>
  );
};
