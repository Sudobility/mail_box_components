import React from 'react';
import { colors, textVariants, ui, designTokens } from '@sudobility/design';
import { WalletIcon } from './wallet-icon';

/** Tracking data for wallet selection actions */
export interface WalletSelectionTrackingData {
  action: 'wallet_click' | 'tab_change';
  trackingLabel?: string;
  componentName?: string;
}

export interface WalletOption {
  id: string;
  name: string;
  icon?: string;
  available: boolean;
  connecting?: boolean;
  chainType: 'evm' | 'solana';
  connector?: unknown;
  onClick: () => void;
}

export interface WalletSelectionButtonProps {
  wallet: WalletOption;
  disabled?: boolean;
  className?: string;
  statusLabels?: {
    available: string;
    notAvailable: string;
  };
  /** Optional tracking callback */
  onTrack?: (data: WalletSelectionTrackingData) => void;
  /** Optional tracking label */
  trackingLabel?: string;
  /** Optional component name for tracking */
  componentName?: string;
}

export const WalletSelectionButton: React.FC<WalletSelectionButtonProps> = ({
  wallet,
  disabled = false,
  className = '',
  statusLabels = { available: 'Available', notAvailable: 'Not Available' },
  onTrack,
  trackingLabel,
  componentName = 'WalletSelectionButton',
}) => {
  const handleClick = () => {
    onTrack?.({ action: 'wallet_click', trackingLabel, componentName });
    wallet.onClick();
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || !wallet.available}
      aria-label={`Connect ${wallet.name} wallet for ${wallet.chainType === 'solana' ? 'Solana' : 'Ethereum'} network`}
      className={`
        w-full flex items-center justify-between p-4 md:p-4 py-5 md:py-4
        border ${ui.border.default} ${designTokens.radius.lg}
        ${colors.component.card.interactive.hover}
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      <div className='flex items-center space-x-3'>
        <WalletIcon
          wallet={wallet.name.toLowerCase()}
          connector={wallet.connector as { icon?: string } | undefined}
        />
        <div className='text-left'>
          <p className={textVariants.label.default()}>{wallet.name}</p>
          <p
            className={`text-xs ${
              wallet.available ? 'text-success' : 'text-destructive'
            }`}
          >
            {wallet.available
              ? statusLabels.available
              : statusLabels.notAvailable}
          </p>
        </div>
      </div>

      {wallet.connecting && (
        <div
          className={`w-4 h-4 border-2 border-t-transparent rounded-full animate-spin ${
            wallet.chainType === 'solana' ? 'border-accent' : 'border-primary'
          }`}
        />
      )}
    </button>
  );
};

export interface WalletTabProps {
  active: boolean;
  onClick: () => void;
  icon: string;
  label: string;
  color: 'blue' | 'purple';
  /** Optional tracking callback */
  onTrack?: (data: WalletSelectionTrackingData) => void;
  /** Optional tracking label */
  trackingLabel?: string;
  /** Optional component name for tracking */
  componentName?: string;
}

export const WalletTab: React.FC<WalletTabProps> = ({
  active,
  onClick,
  icon,
  label,
  color,
  onTrack,
  trackingLabel,
  componentName = 'WalletTab',
}) => {
  const handleClick = () => {
    onTrack?.({ action: 'tab_change', trackingLabel, componentName });
    onClick();
  };
  const colorClasses = {
    blue: active
      ? `${ui.background.surface} text-primary ${designTokens.shadow.sm}`
      : 'text-muted-foreground hover:text-foreground',
    purple: active
      ? `${ui.background.surface} text-accent-foreground ${designTokens.shadow.sm}`
      : 'text-muted-foreground hover:text-foreground',
  };

  return (
    <button
      onClick={handleClick}
      className={`flex-1 py-2 px-4 ${designTokens.radius.md} font-medium ${ui.transition.default} ${colorClasses[color]}`}
    >
      <span className='flex items-center justify-center space-x-2'>
        <span>{icon}</span>
        <span>{label}</span>
      </span>
    </button>
  );
};

export interface WalletSelectionGridProps {
  evmWallets: WalletOption[];
  solanaWallets: WalletOption[];
  activeTab: 'ethereum' | 'solana';
  onTabChange: (tab: 'ethereum' | 'solana') => void;
  connectingWallet?: string | null;
  className?: string;
  labels?: {
    ethereum?: string;
    solana?: string;
    available?: string;
    notAvailable?: string;
    noWalletText?: string;
    installMetaMask?: string;
    installPhantom?: string;
  };
  /** Optional tracking callback */
  onTrack?: (data: WalletSelectionTrackingData) => void;
  /** Optional tracking label */
  trackingLabel?: string;
  /** Optional component name for tracking */
  componentName?: string;
}

export const WalletSelectionGrid: React.FC<WalletSelectionGridProps> = ({
  evmWallets,
  solanaWallets,
  activeTab,
  onTabChange,
  connectingWallet,
  className = '',
  labels = {},
  onTrack,
  trackingLabel,
  componentName: _componentName = 'WalletSelectionGrid',
}) => {
  const defaultLabels = {
    ethereum: 'Ethereum',
    solana: 'Solana',
    available: 'Available',
    notAvailable: 'Not Available',
    noWalletText: "Don't have a wallet?",
    installMetaMask: 'Install MetaMask',
    installPhantom: 'Install Phantom',
  };

  const finalLabels = { ...defaultLabels, ...labels };
  const currentWallets = activeTab === 'ethereum' ? evmWallets : solanaWallets;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Tab Navigation */}
      <div
        className={`flex space-x-1 p-1 ${ui.background.muted} ${designTokens.radius.lg}`}
      >
        <WalletTab
          active={activeTab === 'ethereum'}
          onClick={() => onTabChange('ethereum')}
          icon='⟠'
          label={finalLabels.ethereum}
          color='blue'
          onTrack={onTrack}
          trackingLabel={trackingLabel}
        />
        <WalletTab
          active={activeTab === 'solana'}
          onClick={() => onTabChange('solana')}
          icon='◎'
          label={finalLabels.solana}
          color='purple'
          onTrack={onTrack}
          trackingLabel={trackingLabel}
        />
      </div>

      {/* Wallet Grid */}
      <div className='space-y-3'>
        {currentWallets.map(wallet => (
          <WalletSelectionButton
            key={wallet.id}
            wallet={{
              ...wallet,
              connecting: connectingWallet === wallet.name,
            }}
            disabled={!!connectingWallet}
            statusLabels={{
              available: finalLabels.available,
              notAvailable: finalLabels.notAvailable,
            }}
            onTrack={onTrack}
            trackingLabel={trackingLabel}
          />
        ))}
      </div>

      {/* Help Text */}
      <div className='text-center pt-2'>
        <p className={textVariants.body.sm()}>
          {finalLabels.noWalletText}{' '}
          {activeTab === 'ethereum' ? (
            <a
              href='https://metamask.io/download/'
              target='_blank'
              rel='noopener noreferrer'
              className='text-primary hover:text-primary/80'
            >
              {finalLabels.installMetaMask}
            </a>
          ) : (
            <a
              href='https://phantom.app/download'
              target='_blank'
              rel='noopener noreferrer'
              className='text-accent-foreground hover:text-accent-foreground/80'
            >
              {finalLabels.installPhantom}
            </a>
          )}
        </p>
      </div>
    </div>
  );
};
