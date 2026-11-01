import { cn } from '../index';
import { colors } from '@sudobility/design';

/**
 * CourseCatalog Component
 *
 * Education component with full dark mode support.
 *
 * @component
 * @example
 * ```tsx
 * <CourseCatalog className="custom-class" />
 * ```
 */
export interface CourseCatalogProps {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const CourseCatalog = ({
  className,
  children,
  disabled,
}: CourseCatalogProps) => {
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
      aria-label='CourseCatalog'
    >
      {children || 'CourseCatalog Component'}
    </div>
  );
};
