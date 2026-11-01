import React from 'react';
import { cn } from '../index';
import { colors, ui } from '@sudobility/design';

/** Tracking data for IconButton actions */
export interface IconButtonTrackingData {
  action: 'click';
  trackingLabel?: string;
  componentName?: string;
}

export interface IconButtonProps {
  /** Icon component to display */
  icon: React.ComponentType<{ className?: string }>;
  /** Button label for accessibility (required for screen readers) */
  'aria-label': string;
  /** Click handler */
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  /** Button size */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Button shape */
  shape?: 'circle' | 'square' | 'rounded';
  /** Color variant */
  variant?:
    'default' | 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  /** Disabled state */
  disabled?: boolean;
  /** Button type */
  type?: 'button' | 'submit' | 'reset';
  /** Additional className */
  className?: string;
  /** Tooltip content (optional) */
  title?: string;
  /** Optional tracking callback */
  onTrack?: (data: IconButtonTrackingData) => void;
  /** Optional tracking label */
  trackingLabel?: string;
  /** Optional component name for tracking */
  componentName?: string;
}

/**
 * IconButton Component
 *
 * Icon-only button with various sizes, shapes, and variants.
 * Includes proper accessibility attributes for screen readers.
 *
 * @example
 * ```tsx
 * import { TrashIcon } from '@heroicons/react/24/outline';
 *
 * <IconButton
 *   icon={TrashIcon}
 *   aria-label="Delete item"
 *   onClick={handleDelete}
 * />
 * ```
 *
 * @example
 * ```tsx
 * import { CogIcon } from '@heroicons/react/24/outline';
 *
 * <IconButton
 *   icon={CogIcon}
 *   aria-label="Settings"
 *   variant="ghost"
 *   size="lg"
 *   shape="circle"
 * />
 * ```
 */
export const IconButton: React.FC<IconButtonProps> = ({
  icon: Icon,
  'aria-label': ariaLabel,
  onClick,
  size = 'md',
  shape = 'rounded',
  variant = 'default',
  disabled = false,
  type = 'button',
  className,
  title,
  onTrack,
  trackingLabel,
  componentName = 'IconButton',
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      onTrack?.({ action: 'click', trackingLabel, componentName });
      onClick?.(e);
    }
  };
  // Size configurations
  const sizeClasses = {
    xs: {
      button: 'p-1',
      icon: 'h-3 w-3',
    },
    sm: {
      button: 'p-1.5',
      icon: 'h-4 w-4',
    },
    md: {
      button: 'p-2',
      icon: 'h-5 w-5',
    },
    lg: {
      button: 'p-3',
      icon: 'h-6 w-6',
    },
    xl: {
      button: 'p-4',
      icon: 'h-8 w-8',
    },
  };

  // Shape configurations
  const shapeClasses = {
    circle: 'rounded-full',
    square: 'rounded-none',
    rounded: 'rounded-lg',
  };

  // Variant configurations using design system tokens
  const variantClasses = {
    default: `${colors.component.button.secondary.base} ${colors.component.button.secondary.dark}`,
    primary: `${colors.component.button.primary.base} ${colors.component.button.primary.dark}`,
    secondary: 'bg-accent text-accent-foreground hover:bg-accent/90',
    danger: `${colors.component.button.destructive.base} ${colors.component.button.destructive.dark}`,
    ghost: `${colors.component.button.ghost.base} ${colors.component.button.ghost.dark}`,
    outline: `${colors.component.button.outline.base} ${colors.component.button.outline.dark} border-2`,
  };

  const sizeConfig = sizeClasses[size];

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      aria-label={ariaLabel}
      title={title || ariaLabel}
      className={cn(
        'inline-flex items-center justify-center',
        ui.transition.all,
        ui.states.focus,
        ui.states.disabled,
        sizeConfig.button,
        shapeClasses[shape],
        variantClasses[variant],
        className
      )}
    >
      <Icon className={sizeConfig.icon} />
    </button>
  );
};
