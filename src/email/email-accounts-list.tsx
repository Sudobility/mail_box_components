import React, { useRef, useEffect, useState } from 'react';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { cn } from '../index';
import { textVariants } from '@sudobility/design';
import { AddressType, Optional } from '@sudobility/types';

export interface EmailAccount {
  address: string;
  name: string;
  walletAddress: string;
  addressType: Optional<AddressType>;
  entitled?: boolean;
}

export interface WalletEmailGroup {
  walletAddress: string;
  addressType: Optional<AddressType>;
  primaryEmail: EmailAccount;
  domainEmails: EmailAccount[];
  customColor?: string;
}

export interface EmailAccountsListProps {
  walletGroups: WalletEmailGroup[];
  selectedAccount?: string;
  expandedWallets: string[];
  onAccountSelect: (address: string) => void;
  onToggleWallet: (walletAddress: string) => void;
  onAccountSettings?: (address: string) => void;
  className?: string;
  /** Optional tracking callback */
  onTrack?: (action: string) => void;
}

// Helper function to format wallet addresses
const formatWalletAddress = (address: string): string => {
  if (!address) return '';
  if (address.length <= 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const ChainPill: React.FC<{
  addressType: Optional<AddressType>;
}> = ({ addressType }) => {
  // Get label based on address type
  const getChainLabel = () => {
    switch (addressType) {
      case AddressType.EVMAddress:
        return 'ETH';
      case AddressType.SolanaAddress:
        return 'SOL';
      case AddressType.ENSName:
        return 'ENS';
      case AddressType.SNSName:
        return 'SNS';
      default:
        return 'DOMAIN';
    }
  };

  // Get consistent styling for all pill types
  const getChainStyle = () => {
    switch (addressType) {
      case AddressType.EVMAddress:
        return 'bg-primary/10 text-primary border-primary/20';
      case AddressType.SolanaAddress:
        return 'bg-accent text-accent-foreground border-accent';
      case AddressType.ENSName:
        return 'bg-success/10 text-success border-success/20';
      case AddressType.SNSName:
        return 'bg-warning/10 text-warning border-warning/20';
      default:
        return 'bg-muted text-foreground border-border';
    }
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border',
        getChainStyle()
      )}
    >
      {getChainLabel()}
    </span>
  );
};

const CollapsibleDomainEmails: React.FC<{
  domainEmails: EmailAccount[];
  isExpanded: boolean;
  selectedAccount?: string;
  onAccountSelect: (address: string) => void;
  onAccountSettings?: (address: string) => void;
  onTrack?: (action: string) => void;
}> = ({
  domainEmails,
  isExpanded,
  selectedAccount,
  onAccountSelect,
  onAccountSettings: _onAccountSettings,
  onTrack,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (contentRef.current) {
      const scrollHeight = contentRef.current.scrollHeight;
      setHeight(isExpanded ? scrollHeight + 8 : 0);
    }
  }, [isExpanded, domainEmails]);

  return (
    <div
      className='overflow-hidden transition-all duration-300 ease-in-out'
      style={{ height: height !== undefined ? `${height}px` : 'auto' }}
    >
      <div ref={contentRef} className='ml-6 mt-2 space-y-1'>
        {domainEmails.map(email => (
          <button
            key={email.address}
            onClick={() => {
              onTrack?.('account_select');
              onAccountSelect(email.address);
            }}
            className={cn(
              'w-full flex items-center justify-between text-left px-3 py-2 rounded-lg transition-colors h-[44px]',
              textVariants.body.sm(),
              selectedAccount === email.address
                ? 'bg-primary/10 text-primary'
                : 'hover:bg-muted'
            )}
          >
            <span className='truncate flex-1'>{email.name}</span>
            <ChainPill addressType={email.addressType} />
          </button>
        ))}
      </div>
    </div>
  );
};

const EmailAccountsList: React.FC<EmailAccountsListProps> = ({
  walletGroups,
  selectedAccount,
  expandedWallets,
  onAccountSelect,
  onToggleWallet,
  onAccountSettings,
  className = '',
  onTrack,
}) => {
  return (
    <nav className={cn('space-y-1', className)}>
      {walletGroups.map(group => (
        <div key={group.walletAddress}>
          <button
            onClick={() => {
              onTrack?.('primary_account_select');
              onAccountSelect(group.primaryEmail.address);
            }}
            className={cn(
              'w-full flex items-center justify-between text-left px-3 py-2 rounded-lg transition-colors h-[44px]',
              textVariants.body.sm(),
              selectedAccount === group.primaryEmail.address &&
                group.domainEmails.length === 0
                ? 'bg-primary/10 text-primary'
                : 'hover:bg-muted'
            )}
            style={
              group.customColor
                ? { backgroundColor: group.customColor }
                : undefined
            }
          >
            <div className='flex items-center flex-1 min-w-0'>
              <span className='truncate flex-1'>
                {formatWalletAddress(group.walletAddress)}
              </span>
              <ChainPill addressType={group.primaryEmail.addressType} />
            </div>
            {group.domainEmails.length > 0 && (
              <div
                onClick={e => {
                  e.stopPropagation();
                  onTrack?.('toggle_wallet');
                  onToggleWallet(group.walletAddress);
                }}
                className='p-1 rounded-lg hover:bg-muted dark:hover:bg-muted transition-colors cursor-pointer'
                role='button'
                tabIndex={0}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.stopPropagation();
                    onTrack?.('toggle_wallet');
                    onToggleWallet(group.walletAddress);
                  }
                }}
              >
                <ChevronRightIcon
                  className={cn(
                    'h-4 w-4 text-muted-foreground transition-transform duration-300 ease-in-out',
                    expandedWallets.includes(group.walletAddress)
                      ? 'rotate-90'
                      : 'rotate-0'
                  )}
                />
              </div>
            )}
          </button>

          {group.domainEmails.length > 0 && (
            <CollapsibleDomainEmails
              domainEmails={group.domainEmails}
              isExpanded={expandedWallets.includes(group.walletAddress)}
              selectedAccount={selectedAccount}
              onAccountSelect={onAccountSelect}
              onAccountSettings={onAccountSettings}
              onTrack={onTrack}
            />
          )}
        </div>
      ))}
    </nav>
  );
};

export { EmailAccountsList };
