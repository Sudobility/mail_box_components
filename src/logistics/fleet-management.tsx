import { cn } from './lib/utils';
import { colors } from '@sudobility/design';

/**
 * FleetManagement Component
 *
 * Logistics component with full dark mode support.
 *
 * @component
 * @example
 * ```tsx
 * <FleetManagement className="custom-class" />
 * ```
 */
export interface FleetManagementProps {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const FleetManagement = ({
  className,
  children,
  disabled,
}: FleetManagementProps) => {
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
      aria-label='FleetManagement'
    >
      {children || 'FleetManagement Component'}
    </div>
  );
};
