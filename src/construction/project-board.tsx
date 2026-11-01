import { cn } from '../index';
import { colors } from '@sudobility/design';

/**
 * ProjectBoard Component
 *
 * Project management component with full dark mode support.
 *
 * @component
 * @example
 * ```tsx
 * <ProjectBoard className="custom-class" />
 * ```
 */
export interface ProjectBoardProps {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const ProjectBoard = ({
  className,
  children,
  disabled,
}: ProjectBoardProps) => {
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
      aria-label='ProjectBoard'
    >
      {children || 'ProjectBoard Component'}
    </div>
  );
};
