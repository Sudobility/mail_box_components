import { cn } from '../index';
import { colors } from '@sudobility/design';

/**
 * SearchBar Component
 *
 * A reusable SearchBar component with full dark mode support.
 * Optimized for accessibility and AI-assisted development.
 *
 * @component
 * @example
 * ```tsx
 * <SearchBar className="custom-class" />
 * ```
 *
 * @remarks
 * This component supports:
 * - Light and dark themes automatically
 * - Responsive design
 * - Accessibility features
 * - TypeScript type safety
 *
 * @see {@link https://docs.example.com/components/search-bar}
 */

/** Tracking data for SearchBar actions */
export interface SearchBarTrackingData {
  action: 'click';
  trackingLabel?: string;
  componentName?: string;
}

export interface SearchBarProps {
  /** Additional CSS classes */
  className?: string;
  /** Component children */
  children?: React.ReactNode;
  /** Disabled state */
  disabled?: boolean;
  /** Callback when component is interacted with */
  onClick?: () => void;
  /** Optional tracking callback */
  onTrack?: (data: SearchBarTrackingData) => void;
  /** Optional tracking label */
  trackingLabel?: string;
  /** Optional component name for tracking */
  componentName?: string;
}

export const SearchBar = ({
  className,
  children,
  disabled = false,
  onClick,
  onTrack,
  trackingLabel,
  componentName = 'SearchBar',
}: SearchBarProps) => {
  const handleClick = () => {
    if (disabled) return;
    onTrack?.({ action: 'click', trackingLabel, componentName });
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
      aria-label='SearchBar'
    >
      {children || 'SearchBar Component'}
    </div>
  );
};
