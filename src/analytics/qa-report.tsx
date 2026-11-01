import { cn } from '../index';
import { colors } from '@sudobility/design';

/**
 * QaReport Component
 *
 * Quality assurance component with full dark mode support.
 *
 * @component
 * @example
 * ```tsx
 * <QaReport className="custom-class" />
 * ```
 */
export interface QaReportProps {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const QaReport = ({ className, children, disabled }: QaReportProps) => {
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
      aria-label='QaReport'
    >
      {children || 'QaReport Component'}
    </div>
  );
};
