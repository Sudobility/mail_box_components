import { cn } from '../index';
import { colors } from '@sudobility/design';

/**
 * PresenceIndicator Component
 *
 * A reusable PresenceIndicator component with full dark mode support.
 * Optimized for accessibility and AI-assisted development.
 *
 * @component
 * @example
 * ```tsx
 * <PresenceIndicator className="custom-class" />
 * ```
 *
 * @remarks
 * This component supports:
 * - Light and dark themes automatically
 * - Responsive design
 * - Accessibility features
 * - TypeScript type safety
 *
 * @see {@link https://docs.example.com/components/presence-indicator}
 */

export interface PresenceIndicatorProps {
  /** Additional CSS classes */
  className?: string;
  /** Component children */
  children?: React.ReactNode;
  /** Disabled state */
  disabled?: boolean;
  /** Callback when component is interacted with */
  onClick?: () => void;
  /** Optional tracking callback */
  onTrack?: (action: string) => void;
}

export const PresenceIndicator = ({
  className,
  children,
  disabled = false,
  onClick,
  onTrack,
}: PresenceIndicatorProps) => {
  const handleClick = () => {
    if (disabled) return;
    onTrack?.('click');
    onClick?.();
  };

  return (
    <div
      className={cn(
        'p-4 rounded-lg border transition-colors',
        colors.component.card.default.base,
        colors.component.card.default.dark,
        'text-foreground',
        disabled && 'opacity-50 cursor-not-allowed',
        'hover:bg-muted',
        className
      )}
      onClick={handleClick}
      role='region'
      aria-label='PresenceIndicator'
    >
      {children || 'PresenceIndicator Component'}
    </div>
  );
};
