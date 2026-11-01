import { cn } from '../index';
import { colors } from '@sudobility/design';

/**
 * PatientRecord Component
 *
 * Healthcare component with full dark mode support.
 *
 * @component
 * @example
 * ```tsx
 * <PatientRecord className="custom-class" />
 * ```
 */
export interface PatientRecordProps {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const PatientRecord = ({
  className,
  children,
  disabled,
}: PatientRecordProps) => {
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
      aria-label='PatientRecord'
    >
      {children || 'PatientRecord Component'}
    </div>
  );
};
