import { useState, useRef, useEffect } from 'react';
import { Text } from '../../../index';
import { useAuthStatus } from '../../context/auth-provider';
import { Avatar } from './avatar';
import type { AuthMenuItem, AuthUser } from '../../types';
import { cn } from '../../lib/cn';
import { colors, ui, designTokens } from '@sudobility/design';

interface UserMenuProps {
  menuItems?: AuthMenuItem[];
  showUserInfo?: boolean;
  renderUserInfo?: (user: AuthUser) => React.ReactNode;
  renderAvatar?: (user: AuthUser) => React.ReactNode;
  avatarSize?: number;
  dropdownAlign?: 'left' | 'right';
  onLogoutClick?: () => void;
  /** Optional tracking callback */
  onTrack?: (action: string) => void;
}

/**
 * User menu dropdown component
 */
export function UserMenu({
  menuItems = [],
  showUserInfo = true,
  renderUserInfo,
  renderAvatar,
  avatarSize = 32,
  dropdownAlign = 'right',
  onLogoutClick,
  onTrack,
}: UserMenuProps) {
  const { user, signOut, texts } = useAuthStatus();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  if (!user) return null;

  const handleLogout = async () => {
    setIsOpen(false);
    onTrack?.('logout_click');
    onLogoutClick?.();
    await signOut();
  };

  const handleMenuItemClick = (item: AuthMenuItem) => {
    if (item.disabled) return;
    setIsOpen(false);
    onTrack?.(`menu_item_click:${item.id}`);
    item.onClick();
  };

  const handleToggleMenu = () => {
    const newState = !isOpen;
    if (newState) {
      onTrack?.('menu_open');
    }
    setIsOpen(newState);
  };

  return (
    <div ref={menuRef} className='relative'>
      {/* Avatar trigger */}
      {renderAvatar ? (
        <div onClick={handleToggleMenu} className='cursor-pointer'>
          {renderAvatar(user)}
        </div>
      ) : (
        <Avatar user={user} size={avatarSize} onClick={handleToggleMenu} />
      )}

      {/* Dropdown menu */}
      {isOpen && (
        <div
          className={cn(
            'absolute top-full mt-2 w-56',
            designTokens.radius.lg,
            designTokens.shadow.lg,
            ui.background.surface,
            'border',
            ui.border.default,
            'py-1 z-50',
            dropdownAlign === 'right' ? 'right-0' : 'left-0'
          )}
        >
          {/* User info section */}
          {showUserInfo && (
            <div className={cn('px-4 py-3 border-b', ui.border.default)}>
              {renderUserInfo ? (
                renderUserInfo(user)
              ) : (
                <>
                  {user.displayName && (
                    <Text weight='medium' className='truncate'>
                      {user.displayName}
                    </Text>
                  )}
                  {user.email && (
                    <Text size='sm' color='muted' className='truncate'>
                      {user.email}
                    </Text>
                  )}
                </>
              )}
            </div>
          )}

          {/* Custom menu items */}
          {menuItems.map(item => (
            <div key={item.id}>
              <button
                type='button'
                onClick={() => handleMenuItemClick(item)}
                disabled={item.disabled}
                className={cn(
                  'w-full px-4 py-2 text-left flex items-center gap-2',
                  'text-foreground',
                  colors.component.button.ghost.base,
                  colors.component.button.ghost.dark,
                  ui.transition.default,
                  item.disabled && 'opacity-50 cursor-not-allowed'
                )}
              >
                {item.icon && <span className='w-5 h-5'>{item.icon}</span>}
                <span>{item.label}</span>
              </button>
              {item.dividerAfter && (
                <div className={cn('my-1 border-t', ui.border.default)} />
              )}
            </div>
          ))}

          {/* Divider before logout if there are menu items */}
          {menuItems.length > 0 &&
            !menuItems[menuItems.length - 1]?.dividerAfter && (
              <div className={cn('my-1 border-t', ui.border.default)} />
            )}

          {/* Logout button */}
          <button
            type='button'
            onClick={handleLogout}
            className={cn(
              'w-full px-4 py-2 text-left',
              'text-destructive',
              colors.component.button.ghost.base,
              colors.component.button.ghost.dark,
              ui.transition.default
            )}
          >
            {texts.logout}
          </button>
        </div>
      )}
    </div>
  );
}
