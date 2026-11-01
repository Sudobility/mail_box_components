import { cn } from '../index';
import { colors } from '@sudobility/design';

/**
 * CargoManifest Component
 *
 * Maritime component with full dark mode support.
 *
 * @component
 * @example
 * ```tsx
 * <CargoManifest className="custom-class" />
 * ```
 */
export interface CargoManifestProps {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const CargoManifest = ({
  className,
  children,
  disabled,
}: CargoManifestProps) => {
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
      aria-label='CargoManifest'
    >
      {children || 'CargoManifest Component'}
    </div>
  );
};
