import { cn } from '../index';
import { colors } from '@sudobility/design';

/**
 * ProcurementForm Component
 *
 * Supply chain component with full dark mode support.
 *
 * @component
 * @example
 * ```tsx
 * <ProcurementForm className="custom-class" />
 * ```
 */
export interface ProcurementFormProps {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const ProcurementForm = ({
  className,
  children,
  disabled,
}: ProcurementFormProps) => {
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
      aria-label='ProcurementForm'
    >
      {children || 'ProcurementForm Component'}
    </div>
  );
};
