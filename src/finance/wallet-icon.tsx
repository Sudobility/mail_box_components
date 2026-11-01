import React from 'react';
import { designTokens } from '@sudobility/design';

export interface WalletIconProps {
  wallet: string;
  connector?: { icon?: string }; // Simplified connector type with optional icon
  className?: string;
  iconBasePath?: string; // Allow customizing the base path for icons
}

export const WalletIcon: React.FC<WalletIconProps> = ({
  wallet,
  connector,
  className = 'w-8 h-8',
  iconBasePath = '/wallet-icons',
}) => {
  const walletName = wallet.toLowerCase();

  const getWalletIconPath = (name: string): string => {
    // Map wallet names to icon filenames
    const iconMap: Record<string, string> = {
      metamask: 'metamask.svg',
      walletconnect: 'walletconnect.svg',
      coinbase: 'coinbase.svg',
      phantom: 'phantom.svg',
      solflare: 'solflare.svg',
      keplr: 'keplr.svg',
      browser: 'browser-wallet.svg',
      injected: 'browser-wallet.svg',
    };

    // Find matching wallet name
    for (const [key, filename] of Object.entries(iconMap)) {
      if (name.includes(key)) {
        return `${iconBasePath}/${filename}`;
      }
    }

    // Default fallback
    return `${iconBasePath}/default.svg`;
  };

  // First check if connector has an icon property
  if (connector?.icon) {
    return (
      <img
        src={connector.icon}
        alt={`${wallet} wallet`}
        className={`${className} ${designTokens.radius.lg}`}
        onError={e => {
          // If connector icon fails, fallback to our custom icons
          const target = e.target as HTMLImageElement;
          target.src = getWalletIconPath(walletName);
        }}
      />
    );
  }

  const iconPath = getWalletIconPath(walletName);

  return (
    <img
      src={iconPath}
      alt={`${wallet} wallet`}
      className={`${className} ${designTokens.radius.lg}`}
      onError={e => {
        // Fallback to default icon if image fails to load
        const target = e.target as HTMLImageElement;
        target.src = `${iconBasePath}/default.svg`;
      }}
    />
  );
};
