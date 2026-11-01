import { cn } from '../index';
import { colors } from '@sudobility/design';

/**
 * ContractViewer Component
 *
 * Legal & compliance component with full dark mode support.
 *
 * @component
 * @example
 * ```tsx
 * <ContractViewer className="custom-class" />
 * ```
 */
export interface ContractViewerProps {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const ContractViewer = ({
  className,
  children,
  disabled,
}: ContractViewerProps) => {
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
      aria-label='ContractViewer'
    >
      {children || 'ContractViewer Component'}
    </div>
  );
};
