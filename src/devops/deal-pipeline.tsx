import { cn } from '../index';
import { colors } from '@sudobility/design';

/**
 * DealPipeline Component
 *
 * CRM component with full dark mode support.
 *
 * @component
 * @example
 * ```tsx
 * <DealPipeline className="custom-class" />
 * ```
 */
export interface DealPipelineProps {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const DealPipeline = ({
  className,
  children,
  disabled,
}: DealPipelineProps) => {
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
      aria-label='DealPipeline'
    >
      {children || 'DealPipeline Component'}
    </div>
  );
};
