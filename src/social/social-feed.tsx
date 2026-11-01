import { cn } from '../index';
import { colors } from '@sudobility/design';

/**
 * SocialFeed Component
 *
 * Social media integration component with full dark mode support.
 *
 * @component
 * @example
 * ```tsx
 * <SocialFeed className="custom-class" />
 * ```
 */
export interface SocialFeedProps {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const SocialFeed = ({
  className,
  children,
  disabled,
}: SocialFeedProps) => {
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
      aria-label='SocialFeed'
    >
      {children || 'SocialFeed Component'}
    </div>
  );
};
