import { cn } from '../index';
import { colors } from '@sudobility/design';

/**
 * ProjectTimeline Component
 *
 * Construction component with full dark mode support.
 *
 * @component
 * @example
 * ```tsx
 * <ProjectTimeline className="custom-class" />
 * ```
 */
export interface ProjectTimelineProps {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const ProjectTimeline = ({
  className,
  children,
  disabled,
}: ProjectTimelineProps) => {
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
      aria-label='ProjectTimeline'
    >
      {children || 'ProjectTimeline Component'}
    </div>
  );
};
