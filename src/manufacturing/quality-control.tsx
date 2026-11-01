import { cn } from '../index';
import { colors } from '@sudobility/design';

/**
 * QualityControl Component
 *
 * Manufacturing component with full dark mode support.
 *
 * @component
 * @example
 * ```tsx
 * <QualityControl className="custom-class" />
 * ```
 */
export interface QualityControlProps {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const QualityControl = ({
  className,
  children,
  disabled,
}: QualityControlProps) => {
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
      aria-label='QualityControl'
    >
      {children || 'QualityControl Component'}
    </div>
  );
};
