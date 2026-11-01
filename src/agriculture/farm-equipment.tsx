import { cn } from '../index';
import { colors } from '@sudobility/design';

/**
 * FarmEquipment Component
 *
 * Agriculture component with full dark mode support.
 *
 * @component
 * @example
 * ```tsx
 * <FarmEquipment className="custom-class" />
 * ```
 */
export interface FarmEquipmentProps {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const FarmEquipment = ({
  className,
  children,
  disabled,
}: FarmEquipmentProps) => {
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
      aria-label='FarmEquipment'
    >
      {children || 'FarmEquipment Component'}
    </div>
  );
};
