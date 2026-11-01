import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { cn } from '../index';
import { colors, ui } from '@sudobility/design';

export interface TagProps {
  /** Tag label */
  children: React.ReactNode;
  /** Color variant */
  variant?:
    | 'default'
    | 'primary'
    | 'success'
    | 'warning'
    | 'danger'
    | 'info'
    | 'purple';
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Show close button */
  onRemove?: () => void;
  /** Click handler */
  onClick?: () => void;
  /** Disabled state */
  disabled?: boolean;
  /** Additional className */
  className?: string;
}

/**
 * Tag Component
 *
 * Small label or badge with optional remove button.
 * Commonly used for filters, selections, categories, and tags.
 *
 * @example
 * ```tsx
 * <Tag variant="primary">JavaScript</Tag>
 * <Tag variant="success" onRemove={() => removeTag('id')}>
 *   Selected Item
 * </Tag>
 * ```
 *
 * @example
 * ```tsx
 * <Tag variant="warning" size="sm" onClick={() => filterBy('tag')}>
 *   Filter
 * </Tag>
 * ```
 */
export const Tag: React.FC<TagProps> = ({
  children,
  variant = 'default',
  size = 'md',
  onRemove,
  onClick,
  disabled = false,
  className,
}) => {
  // Size configurations
  const sizeClasses = {
    sm: {
      tag: 'px-2 py-0.5 text-xs gap-1',
      icon: 'h-3 w-3',
    },
    md: {
      tag: 'px-2.5 py-1 text-sm gap-1.5',
      icon: 'h-3.5 w-3.5',
    },
    lg: {
      tag: 'px-3 py-1.5 text-base gap-2',
      icon: 'h-4 w-4',
    },
  };

  // Color variant configurations using design system tokens
  const badgeColors = colors.component.badge;
  const variantClasses = {
    default: `${badgeColors.default.base} ${badgeColors.default.dark} hover:bg-muted`,
    primary: `${badgeColors.primary.base} ${badgeColors.primary.dark} hover:bg-primary/20`,
    success: `${badgeColors.success.base} ${badgeColors.success.dark} hover:bg-success/20`,
    warning: `${badgeColors.warning.base} ${badgeColors.warning.dark} hover:bg-warning/20`,
    danger: `${badgeColors.error.base} ${badgeColors.error.dark} hover:bg-destructive/20`,
    info: 'bg-info/10 text-info hover:bg-info/20',
    purple: 'bg-accent text-accent-foreground hover:bg-accent/80',
  };

  const sizeConfig = sizeClasses[size];
  const isInteractive = onClick || onRemove;

  const handleClick = () => {
    if (disabled) return;
    if (onClick) {
      onClick();
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled || !onRemove) return;
    onRemove();
  };

  return (
    <span
      onClick={handleClick}
      className={cn(
        'inline-flex items-center font-medium rounded-full',
        ui.transition.default,
        sizeConfig.tag,
        variantClasses[variant],
        isInteractive && !disabled && 'cursor-pointer',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <span>{children}</span>
      {onRemove && (
        <button
          type='button'
          onClick={handleRemove}
          disabled={disabled}
          className={cn(
            'inline-flex items-center justify-center rounded-full',
            'hover:bg-foreground/10',
            'transition-colors',
            disabled ? 'cursor-not-allowed' : 'cursor-pointer'
          )}
          aria-label='Remove'
        >
          <XMarkIcon className={sizeConfig.icon} />
        </button>
      )}
    </span>
  );
};
