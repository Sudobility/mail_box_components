import { cn } from '../index';
import { colors } from '@sudobility/design';

/**
 * InstagramWidget Component
 *
 * Social media integration component with full dark mode support.
 *
 * @component
 * @example
 * ```tsx
 * <InstagramWidget className="custom-class" />
 * ```
 */
export interface InstagramWidgetProps {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const InstagramWidget = ({
  className,
  children,
  disabled,
}: InstagramWidgetProps) => {
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
      aria-label='InstagramWidget'
    >
      {children || 'InstagramWidget Component'}
    </div>
  );
};
