import { Button } from '../../index';
import { useAuthStatus } from '../context/auth-provider';
import type { AuthActionProps } from '../types';
import { UserMenu } from './shared/user-menu';
import { cn } from '../lib/cn';

/**
 * AuthAction - TopBar component for authentication
 * Shows login button when logged out, avatar with dropdown when logged in
 */
export function AuthAction({
  className,
  loginButtonClassName,
  loginButtonVariant: _loginButtonVariant = 'primary',
  size = 'md',
  loginButtonContent,
  avatarSize = 32,
  menuItems = [],
  showUserInfo = true,
  renderUserInfo,
  renderAvatar,
  dropdownAlign = 'right',
  onLoginClick,
  onLogoutClick,
  onTrack,
  trackingLabel,
  componentName = 'AuthAction',
}: AuthActionProps) {
  const { isAuthenticated, isAnonymous, openModal, texts } = useAuthStatus();

  // Button size mapping
  const buttonSizeMap = {
    sm: 'sm' as const,
    md: 'default' as const,
    lg: 'lg' as const,
  };

  const handleLoginClick = () => {
    onTrack?.({ action: 'login_click', trackingLabel, componentName });
    // If custom handler returns false, don't open modal
    const result = onLoginClick?.();
    if (result === false) return;

    openModal();
  };

  // Show login button if not authenticated or anonymous
  if (!isAuthenticated || isAnonymous) {
    return (
      <div className={cn('flex items-center', className)}>
        <Button
          variant='primary'
          size={buttonSizeMap[size]}
          animation='none'
          onClick={handleLoginClick}
          className={loginButtonClassName}
        >
          {loginButtonContent ?? texts.login}
        </Button>
      </div>
    );
  }

  const handleLogoutClick = () => {
    onTrack?.({ action: 'logout_click', trackingLabel, componentName });
    onLogoutClick?.();
  };

  // Show user menu when authenticated
  return (
    <div className={cn('flex items-center', className)}>
      <UserMenu
        menuItems={menuItems}
        showUserInfo={showUserInfo}
        renderUserInfo={renderUserInfo}
        renderAvatar={renderAvatar}
        avatarSize={avatarSize}
        dropdownAlign={dropdownAlign}
        onLogoutClick={handleLogoutClick}
      />
    </div>
  );
}
