import { cn } from '../index';
import { colors } from '@sudobility/design';

/**
 * ChecklistProgress Component
 *
 * A reusable ChecklistProgress component with full dark mode support.
 * Optimized for accessibility and AI-assisted development.
 *
 * @component
 * @example
 * ```tsx
 * <ChecklistProgress className="custom-class" />
 * ```
 *
 * @remarks
 * This component supports:
 * - Light and dark themes automatically
 * - Responsive design
 * - Accessibility features
 * - TypeScript type safety
 *
 * @see {@link https://docs.example.com/components/checklist-progress}
 */

export interface ChecklistProgressProps {
  /** Additional CSS classes */
  className?: string;
  /** Component children */
  children?: React.ReactNode;
  /** Disabled state */
  disabled?: boolean;
  /** Callback when component is interacted with */
  onClick?: () => void;
}

export const ChecklistProgress = ({
  className,
  children,
  disabled = false,
  onClick,
}: ChecklistProgressProps) => {
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
      onClick={disabled ? undefined : onClick}
      role='region'
      aria-label='ChecklistProgress'
    >
      {children || 'ChecklistProgress Component'}
    </div>
  );
};
