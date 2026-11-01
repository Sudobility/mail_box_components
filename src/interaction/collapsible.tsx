import React, { useState, KeyboardEvent } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { cn } from '../index';
import { ui } from '@sudobility/design';

/** Tracking data for Collapsible actions */
export interface CollapsibleTrackingData {
  action: 'toggle';
  trackingLabel?: string;
  componentName?: string;
}

export interface CollapsibleProps {
  /** Trigger content (can be string or React node) */
  trigger: React.ReactNode;
  /** Content to show when expanded */
  children: React.ReactNode;
  /** Initially open state */
  defaultOpen?: boolean;
  /** Controlled open state */
  isOpen?: boolean;
  /** Callback when open state changes */
  onToggle?: (open: boolean) => void;
  /** Show chevron icon */
  showIcon?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Transition duration in ms */
  transitionDuration?: number;
  /** Visual variant */
  variant?: 'default' | 'outlined';
  /** Enable animations */
  animated?: boolean;
  /** Additional className */
  className?: string;
  /** Optional tracking callback */
  onTrack?: (data: CollapsibleTrackingData) => void;
  /** Optional tracking label */
  trackingLabel?: string;
  /** Optional component name for tracking */
  componentName?: string;
}

/**
 * Collapsible Component
 *
 * Expandable/collapsible section with customizable trigger and content.
 * Can be controlled or uncontrolled with icon indicators and animations.
 *
 * @example
 * ```tsx
 * <Collapsible trigger="Show More">
 *   <p>Hidden content goes here...</p>
 * </Collapsible>
 * ```
 *
 * @example
 * ```tsx
 * <Collapsible
 *   trigger={<h3>Advanced Settings</h3>}
 *   defaultOpen
 *   showIcon
 *   animated
 * >
 *   <div>Settings content...</div>
 * </Collapsible>
 * ```
 */
export const Collapsible: React.FC<CollapsibleProps> = ({
  trigger,
  children,
  defaultOpen = false,
  isOpen: controlledIsOpen,
  onToggle,
  showIcon = true,
  disabled = false,
  transitionDuration = 300,
  variant = 'default',
  animated = false,
  className,
  onTrack,
  trackingLabel,
  componentName = 'Collapsible',
}) => {
  const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(defaultOpen);

  // Use controlled value if provided, otherwise use internal state
  const isOpen =
    controlledIsOpen !== undefined ? controlledIsOpen : uncontrolledIsOpen;
  const isControlled = controlledIsOpen !== undefined;

  const handleToggle = () => {
    if (disabled) return;

    onTrack?.({ action: 'toggle', trackingLabel, componentName });

    const newOpen = !isOpen;

    if (!isControlled) {
      setUncontrolledIsOpen(newOpen);
    }

    onToggle?.(newOpen);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggle();
    }
  };

  const variantClasses = {
    default: '',
    outlined: cn('border p-4', ui.border.default, ui.border.radius),
  };

  return (
    <div className={cn('w-full', variantClasses[variant], className)}>
      {/* Trigger */}
      <div
        role='button'
        tabIndex={disabled ? -1 : 0}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        className={cn(
          'flex items-center justify-between w-full text-left cursor-pointer',
          ui.transition.default,
          !disabled && 'hover:opacity-80',
          disabled && 'opacity-50 cursor-not-allowed',
          variant === 'default' && 'py-2'
        )}
        aria-expanded={isOpen}
        aria-disabled={disabled}
      >
        <div className='flex-1 min-w-0'>{trigger}</div>
        {showIcon && (
          <ChevronDownIcon
            className={cn(
              'h-5 w-5 ml-2 flex-shrink-0',
              ui.text.muted,
              'transition-transform',
              isOpen && 'rotate-180'
            )}
          />
        )}
      </div>

      {/* Content */}
      {isOpen && (
        <div
          className={cn(
            'overflow-hidden pt-2',
            (animated || transitionDuration) &&
              'animate-in slide-in-from-top-1 fade-in'
          )}
          style={{
            animationDuration: transitionDuration
              ? `${transitionDuration}ms`
              : undefined,
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
};
