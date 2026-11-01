/**
 * @fileoverview Member Role Selector Component
 * @description Dropdown for selecting member roles
 */

import { useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  ChevronDownIcon,
  ShieldCheckIcon,
  BriefcaseIcon,
  EyeIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import { EntityRole } from '@sudobility/types';
import { cn } from '../lib/utils';
import { colors, ui, designTokens } from '@sudobility/design';

/** Tracking data for MemberRoleSelector actions */
export interface MemberRoleSelectorTrackingData {
  action: 'toggle' | 'select';
  trackingLabel?: string;
  componentName?: string;
}

export interface MemberRoleSelectorProps {
  /** Current role value */
  value: EntityRole;
  /** Change handler */
  onChange: (role: EntityRole) => void;
  /** Whether the selector is disabled */
  disabled?: boolean;
  /** Additional class names */
  className?: string;
  /** Optional tracking callback */
  onTrack?: (data: MemberRoleSelectorTrackingData) => void;
  /** Optional tracking label */
  trackingLabel?: string;
  /** Optional component name for tracking */
  componentName?: string;
}

interface RoleOption {
  value: EntityRole;
  label: string;
  description: string;
  icon: typeof ShieldCheckIcon;
  color: string;
}

const roleOptions: RoleOption[] = [
  {
    value: EntityRole.OWNER,
    label: 'Owner',
    description: 'Full access to all settings and members',
    icon: ShieldCheckIcon,
    color: 'text-accent-foreground',
  },
  {
    value: EntityRole.MANAGER,
    label: 'Manager',
    description: 'Can manage projects and API keys',
    icon: BriefcaseIcon,
    color: 'text-primary',
  },
  {
    value: EntityRole.MEMBER,
    label: 'Member',
    description: 'Read-only access',
    icon: EyeIcon,
    color: 'text-muted-foreground',
  },
];

/**
 * Dropdown selector for member roles.
 * Uses a portal to render the menu on document.body so it escapes
 * overflow-hidden and transform parents (same pattern as ShareDropdown).
 */
export function MemberRoleSelector({
  value,
  onChange,
  disabled = false,
  className,
  onTrack,
  trackingLabel,
  componentName = 'MemberRoleSelector',
}: MemberRoleSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [menuPos, setMenuPos] = useState<{ top: number; right: number }>({
    top: 0,
    right: 0,
  });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const selectedRole =
    roleOptions.find(r => r.value === value) || roleOptions[2];

  const updateMenuPosition = useCallback(() => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setMenuPos({
        top: rect.bottom + 4,
        right: window.innerWidth - rect.right,
      });
    }
  }, []);

  const handleToggle = () => {
    if (!disabled) {
      onTrack?.({ action: 'toggle', trackingLabel, componentName });
      if (!isOpen) {
        updateMenuPosition();
      }
      setIsOpen(!isOpen);
    }
  };

  const handleSelect = (role: EntityRole) => {
    onTrack?.({ action: 'select', trackingLabel, componentName });
    onChange(role);
    setIsOpen(false);
  };

  return (
    <div className={cn('relative', className)}>
      {/* Trigger Button */}
      <button
        ref={triggerRef}
        type='button'
        onClick={handleToggle}
        disabled={disabled}
        className={cn(
          'flex items-center gap-1.5 px-2 py-1 rounded border text-sm',
          'bg-background transition-colors',
          disabled
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-muted cursor-pointer'
        )}
        aria-expanded={isOpen}
        aria-haspopup='listbox'
      >
        <selectedRole.icon className={cn('h-3.5 w-3.5', selectedRole.color)} />
        <span>{selectedRole.label}</span>
        <ChevronDownIcon
          className={cn(
            'h-3.5 w-3.5 text-muted-foreground transition-transform',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {/* Dropdown - portaled to document.body to escape overflow-hidden + transform parents */}
      {isOpen &&
        createPortal(
          <>
            {/* Backdrop to catch outside clicks */}
            <div
              className='fixed inset-0 z-[999998]'
              onClick={() => setIsOpen(false)}
            />
            {/* Menu */}
            <div
              className={cn(
                'fixed z-[999999] w-52 py-1',
                ui.background.surface,
                designTokens.radius.lg,
                designTokens.shadow.lg,
                'border',
                ui.border.default
              )}
              style={{ top: menuPos.top, right: menuPos.right }}
              role='listbox'
              aria-label='Roles'
            >
              {roleOptions.map(option => (
                <button
                  key={option.value}
                  type='button'
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    'flex items-start gap-2 w-full px-3 py-2 text-left',
                    ui.transition.default,
                    'cursor-pointer',
                    option.value === value
                      ? ui.background.subtle
                      : `${colors.component.button.ghost.base} ${colors.component.button.ghost.dark}`
                  )}
                  role='option'
                  aria-selected={option.value === value}
                >
                  <option.icon className={cn('h-4 w-4 mt-0.5', option.color)} />
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center gap-2'>
                      <span className='font-medium text-sm text-foreground'>
                        {option.label}
                      </span>
                      {option.value === value && (
                        <CheckIcon className='h-3.5 w-3.5 text-primary' />
                      )}
                    </div>
                    <p className='text-xs text-muted-foreground'>
                      {option.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </>,
          document.body
        )}
    </div>
  );
}
