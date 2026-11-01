import { cn } from './lib/utils';
import { colors } from '@sudobility/design';

/**
 * SupplierCard Component
 *
 * Supply chain component with full dark mode support.
 *
 * @component
 * @example
 * ```tsx
 * <SupplierCard className="custom-class" />
 * ```
 */
export interface SupplierCardProps {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const SupplierCard = ({
  className,
  children,
  disabled,
}: SupplierCardProps) => {
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
      aria-label='SupplierCard'
    >
      {children || 'SupplierCard Component'}
    </div>
  );
};
