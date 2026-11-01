import { cn } from '../index';
import { colors } from '@sudobility/design';

/**
 * TeamManagement Component
 *
 * Gaming component with full dark mode support.
 *
 * @component
 * @example
 * ```tsx
 * <TeamManagement className="custom-class" />
 * ```
 */
export interface TeamManagementProps {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const TeamManagement = ({
  className,
  children,
  disabled,
}: TeamManagementProps) => {
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
      aria-label='TeamManagement'
    >
      {children || 'TeamManagement Component'}
    </div>
  );
};
