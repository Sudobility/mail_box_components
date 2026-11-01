import { cn } from '../index';
import { colors } from '@sudobility/design';

/**
 * CensusForm Component
 *
 * Government component with full dark mode support.
 *
 * @component
 * @example
 * ```tsx
 * <CensusForm className="custom-class" />
 * ```
 */
export interface CensusFormProps {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const CensusForm = ({
  className,
  children,
  disabled,
}: CensusFormProps) => {
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
      aria-label='CensusForm'
    >
      {children || 'CensusForm Component'}
    </div>
  );
};
