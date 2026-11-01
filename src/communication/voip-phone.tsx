import { cn } from '../index';
import { colors } from '@sudobility/design';

/**
 * VoipPhone Component
 *
 * Telecommunications component with full dark mode support.
 *
 * @component
 * @example
 * ```tsx
 * <VoipPhone className="custom-class" />
 * ```
 */
export interface VoipPhoneProps {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const VoipPhone = ({
  className,
  children,
  disabled,
}: VoipPhoneProps) => {
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
      aria-label='VoipPhone'
    >
      {children || 'VoipPhone Component'}
    </div>
  );
};
