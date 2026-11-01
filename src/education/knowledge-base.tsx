import { cn } from '../index';
import { colors } from '@sudobility/design';

/**
 * KnowledgeBase Component
 *
 * Customer support component with full dark mode support.
 *
 * @component
 * @example
 * ```tsx
 * <KnowledgeBase className="custom-class" />
 * ```
 */
export interface KnowledgeBaseProps {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const KnowledgeBase = ({
  className,
  children,
  disabled,
}: KnowledgeBaseProps) => {
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
      aria-label='KnowledgeBase'
    >
      {children || 'KnowledgeBase Component'}
    </div>
  );
};
