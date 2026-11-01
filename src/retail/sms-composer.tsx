import { cn } from '../index';
import { colors } from '@sudobility/design';

/**
 * SmsComposer Component
 *
 * Telecommunications component with full dark mode support.
 *
 * @component
 * @example
 * ```tsx
 * <SmsComposer className="custom-class" />
 * ```
 */
export interface SmsComposerProps {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const SmsComposer = ({
  className,
  children,
  disabled,
}: SmsComposerProps) => {
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
      aria-label='SmsComposer'
    >
      {children || 'SmsComposer Component'}
    </div>
  );
};
