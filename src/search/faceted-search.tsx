import { cn } from '../index';
import { colors } from '@sudobility/design';

/**
 * FacetedSearch Component
 *
 * A reusable FacetedSearch component with full dark mode support.
 * Optimized for accessibility and AI-assisted development.
 *
 * @component
 * @example
 * ```tsx
 * <FacetedSearch className="custom-class" />
 * ```
 *
 * @remarks
 * This component supports:
 * - Light and dark themes automatically
 * - Responsive design
 * - Accessibility features
 * - TypeScript type safety
 *
 * @see {@link https://docs.example.com/components/faceted-search}
 */

/** Tracking data for FacetedSearch actions */
export interface FacetedSearchTrackingData {
  action: 'click';
  trackingLabel?: string;
  componentName?: string;
}

export interface FacetedSearchProps {
  /** Additional CSS classes */
  className?: string;
  /** Component children */
  children?: React.ReactNode;
  /** Disabled state */
  disabled?: boolean;
  /** Callback when component is interacted with */
  onClick?: () => void;
  /** Optional tracking callback */
  onTrack?: (data: FacetedSearchTrackingData) => void;
  /** Optional tracking label */
  trackingLabel?: string;
  /** Optional component name for tracking */
  componentName?: string;
}

export const FacetedSearch = ({
  className,
  children,
  disabled = false,
  onClick,
  onTrack,
  trackingLabel,
  componentName = 'FacetedSearch',
}: FacetedSearchProps) => {
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
      aria-label='FacetedSearch'
    >
      {children || 'FacetedSearch Component'}
    </div>
  );
};
