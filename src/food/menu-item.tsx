import React from 'react';
import { cn } from '../index';
import { textVariants } from '@sudobility/design';

/** Tracking data for MenuItem actions */
export interface MenuItemTrackingData {
  action: 'click';
  trackingLabel?: string;
  componentName?: string;
}

export interface MenuItemProps {
  /** Menu item label */
  children: React.ReactNode;
  /** Icon component */
  icon?: React.ComponentType<{ className?: string }>;
  /** Click handler */
  onClick?: () => void;
  /** Disabled state */
  disabled?: boolean;
  /** Danger/destructive action */
  danger?: boolean;
  /** Show as selected/active */
  selected?: boolean;
  /** Additional description text */
  description?: string;
  /** Keyboard shortcut hint */
  shortcut?: string;
  /** Additional className */
  className?: string;
  /** Optional tracking callback */
  onTrack?: (data: MenuItemTrackingData) => void;
  /** Optional tracking label */
  trackingLabel?: string;
  /** Optional component name for tracking */
  componentName?: string;
}

/**
 * MenuItem Component
 *
 * Reusable menu item for dropdowns, context menus, and navigation menus.
 * Supports icons, descriptions, shortcuts, and states.
 *
 * @example
 * ```tsx
 * import { CogIcon, TrashIcon } from '@heroicons/react/24/outline';
 *
 * <MenuItem icon={CogIcon} onClick={openSettings}>
 *   Settings
 * </MenuItem>
 * <MenuItem icon={TrashIcon} onClick={deleteItem} danger>
 *   Delete
 * </MenuItem>
 * ```
 *
 * @example
 * ```tsx
 * <MenuItem
 *   icon={UserIcon}
 *   description="Manage your profile"
 *   shortcut="⌘P"
 *   selected
 * >
 *   Profile
 * </MenuItem>
 * ```
 */
export const MenuItem: React.FC<MenuItemProps> = ({
  children,
  icon: Icon,
  onClick,
  disabled = false,
  danger = false,
  selected = false,
  description,
  shortcut,
  className,
  onTrack,
  trackingLabel,
  componentName = 'MenuItem',
}) => {
  const handleClick = () => {
    if (disabled) return;
    onTrack?.({ action: 'click', trackingLabel, componentName });
    onClick?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <div
      role='menuitem'
      tabIndex={disabled ? -1 : 0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        'flex items-center gap-3 px-3 py-2',
        'transition-colors duration-150',
        'cursor-pointer select-none',
        !disabled && !danger && !selected && 'hover:bg-muted',
        !disabled && !danger && selected && 'bg-primary/10 text-primary',
        !disabled && danger && 'hover:bg-destructive/10 text-destructive',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      aria-disabled={disabled}
    >
      {/* Icon */}
      {Icon && (
        <Icon
          className={cn(
            'h-5 w-5 flex-shrink-0',
            danger
              ? 'text-destructive'
              : selected
                ? 'text-primary'
                : 'text-muted-foreground'
          )}
        />
      )}

      {/* Content */}
      <div className='flex-1 min-w-0'>
        <div
          className={cn(
            textVariants.body.md(),
            danger && 'text-destructive',
            selected && 'text-primary font-medium',
            !danger && !selected && 'text-foreground'
          )}
        >
          {children}
        </div>
        {description && (
          <div
            className={cn(
              textVariants.caption.default(),
              'text-muted-foreground mt-0.5'
            )}
          >
            {description}
          </div>
        )}
      </div>

      {/* Shortcut */}
      {shortcut && (
        <span
          className={cn(
            textVariants.caption.default(),
            'text-muted-foreground flex-shrink-0'
          )}
        >
          {shortcut}
        </span>
      )}
    </div>
  );
};
