import React from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { Dropdown, StatusBadge, ChainBadge } from '../index';
import { AuthStatus, ChainType, formatWalletAddress } from '@sudobility/types';
import { colors, textVariants, ui } from '@sudobility/design';

export interface WalletMenuItem {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  disabled?: boolean;
  separator?: boolean;
}

export interface WalletDropdownMenuProps {
  /** Wallet address to display */
  walletAddress: string;
  /** Authentication status for status badge */
  authStatus: AuthStatus;
  /** Chain type for chain badge */
  chainType: ChainType | 'unknown';
  /** Menu items provided by consumer */
  menuItems: WalletMenuItem[];
  /** Optional user avatar URL */
  avatar?: string;
  /** Optional display name (falls back to formatted address) */
  displayName?: string;
  /** Optional custom address formatter */
  formatAddress?: (address: string) => string;
  /** Optional custom labels for status badge */
  statusLabels?: {
    verified?: string;
    connected?: string;
    disconnected?: string;
  };
  /** Optional className for the trigger button */
  className?: string;
  /** Dropdown alignment */
  align?: 'left' | 'right';
}

/**
 * WalletDropdownMenu - A connected wallet dropdown menu component
 *
 * Displays wallet address, status badges, and a customizable dropdown menu.
 * All menu items and actions are provided by the consumer for maximum flexibility.
 *
 * @example
 * ```tsx
 * const menuItems = [
 *   { id: 'copy', label: 'Copy Address', icon: ClipboardIcon, onClick: handleCopy },
 *   { id: 'separator', separator: true },
 *   { id: 'disconnect', label: 'Disconnect', icon: LogoutIcon, onClick: handleDisconnect },
 * ];
 *
 * <WalletDropdownMenu
 *   walletAddress={address}
 *   authStatus={AuthStatus.VERIFIED}
 *   chainType={ChainType.EVM}
 *   menuItems={menuItems}
 * />
 * ```
 */
export const WalletDropdownMenu: React.FC<WalletDropdownMenuProps> = ({
  walletAddress,
  authStatus,
  chainType,
  menuItems,
  avatar,
  displayName,
  formatAddress = formatWalletAddress,
  statusLabels,
  className = '',
  align = 'right',
}) => {
  // Map AuthStatus to StatusBadge status type
  const getStatusType = (status: AuthStatus) => {
    switch (status) {
      case AuthStatus.VERIFIED:
        return 'verified';
      case AuthStatus.CONNECTED:
        return 'connected';
      case AuthStatus.DISCONNECTED:
      default:
        return 'disconnected';
    }
  };

  // Get status label
  const getStatusLabel = (status: AuthStatus) => {
    if (statusLabels) {
      switch (status) {
        case AuthStatus.VERIFIED:
          return statusLabels.verified;
        case AuthStatus.CONNECTED:
          return statusLabels.connected;
        case AuthStatus.DISCONNECTED:
          return statusLabels.disconnected;
      }
    }
    return undefined; // Use default from StatusBadge
  };

  const formattedAddress = formatAddress(walletAddress);
  const display = displayName || formattedAddress;

  return (
    <Dropdown
      items={menuItems}
      align={align}
      trigger={
        <button
          className={`flex items-center space-x-2 px-3 py-2 ${ui.border.radius} ${colors.component.button.ghost.base} ${colors.component.button.ghost.dark} ${ui.transition.default} ${className}`}
        >
          {avatar && (
            <img src={avatar} alt={display} className='h-8 w-8 rounded-full' />
          )}
          <div className='hidden md:block text-left'>
            <div className={textVariants.label.default()}>{display}</div>
            <div className='flex items-center space-x-1'>
              <StatusBadge
                status={getStatusType(authStatus)}
                label={getStatusLabel(authStatus)}
                size='sm'
              />
              <ChainBadge
                chainType={chainType === 'unknown' ? undefined : chainType}
                size='sm'
              />
            </div>
          </div>
          <ChevronDownIcon className={`h-4 w-4 ${ui.text.muted}`} />
        </button>
      }
    />
  );
};
