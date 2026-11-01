import { cn } from '../index';
import { colors } from '@sudobility/design';

/**
 * CropMonitor Component
 *
 * Agriculture component with full dark mode support.
 *
 * @component
 * @example
 * ```tsx
 * <CropMonitor className="custom-class" />
 * ```
 */
export interface CropMonitorProps {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const CropMonitor = ({
  className,
  children,
  disabled,
}: CropMonitorProps) => {
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
      aria-label='CropMonitor'
    >
      {children || 'CropMonitor Component'}
    </div>
  );
};
