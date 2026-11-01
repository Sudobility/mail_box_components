import React from 'react';
import { colors, textVariants, ui, designTokens } from '@sudobility/design';
import { WalletIcon } from './wallet-icon';
import { ChainType } from '@sudobility/types';

export interface WalletVerifyScreenProps {
  /** Connected wallet address */
  walletAddress: string;
  /** Chain type (evm or solana) */
  chainType: ChainType;
  /** Name of the connected wallet provider (e.g., "MetaMask", "Phantom") */
  walletProvider?: string;
  /** Connector object for WalletIcon (optional, for EVM wallets) */
  walletConnector?: { icon?: string };
  /** Whether currently signing */
  isSigning: boolean;
  /** Error message to display */
  error?: string | null;
  /** Callback when sign button is clicked */
  onSign: () => void;
  /** Callback when "use different wallet" is clicked */
  onUseDifferentWallet: () => void;
  /** All UI labels */
  labels: {
    // Header
    pageTitle: string;
    pageDescription: string;
    // Wallet info
    connectedWalletLabel: string;
    ethereumChainLabel: string;
    solanaChainLabel: string;
    // Sign section
    signInEthereumTitle: string;
    signInEthereumDescription: string;
    signInSolanaTitle: string;
    signInSolanaDescription: string;
    // Buttons
    signMessageButton: string;
    signingButton: string;
    useDifferentWallet: string;
  };
  /** Optional className */
  className?: string;
  /** Optional children to render after the sign button (e.g., footer links) */
  children?: React.ReactNode;
}

/**
 * WalletVerifyScreen - "Verify Your Wallet" signing UI
 *
 * A presentational component for the wallet verification/signing step.
 * Shows connected wallet info and a sign message button.
 *
 * @example
 * ```tsx
 * <WalletVerifyScreen
 *   walletAddress={address}
 *   chainType={ChainType.EVM}
 *   walletProvider="MetaMask"
 *   isSigning={isSigning}
 *   onSign={handleSign}
 *   onUseDifferentWallet={handleReset}
 *   labels={{
 *     pageTitle: 'Verify Your Wallet',
 *     pageDescription: 'Sign a message to verify ownership',
 *     connectedWalletLabel: 'Connected Wallet',
 *     ethereumChainLabel: 'Ethereum',
 *     solanaChainLabel: 'Solana',
 *     signInEthereumTitle: 'Sign with Ethereum',
 *     signInEthereumDescription: 'Sign a message to verify you own this wallet',
 *     signInSolanaTitle: 'Sign with Solana',
 *     signInSolanaDescription: 'Sign a message to verify you own this wallet',
 *     signMessageButton: 'Sign Message',
 *     signingButton: 'Signing...',
 *     useDifferentWallet: 'Use a different wallet',
 *   }}
 * />
 * ```
 */
export const WalletVerifyScreen: React.FC<WalletVerifyScreenProps> = ({
  walletAddress,
  chainType,
  walletProvider,
  walletConnector,
  isSigning,
  error,
  onSign,
  onUseDifferentWallet,
  labels,
  className = '',
  children,
}) => {
  const isSolana = chainType === ChainType.SOLANA;
  const chainLabel = isSolana
    ? labels.solanaChainLabel
    : labels.ethereumChainLabel;
  const signTitle = isSolana
    ? labels.signInSolanaTitle
    : labels.signInEthereumTitle;
  const signDescription = isSolana
    ? labels.signInSolanaDescription
    : labels.signInEthereumDescription;

  // Color classes based on chain
  const chainBadgeClasses = isSolana
    ? `${colors.component.badge.solana.base} ${colors.component.badge.solana.dark}`
    : `${colors.component.badge.ethereum.base} ${colors.component.badge.ethereum.dark}`;

  const signSectionClasses = isSolana
    ? 'bg-accent/50 border-accent'
    : 'bg-primary/10 border-primary/20';

  const signTitleClasses = isSolana ? 'text-accent-foreground' : 'text-primary';

  const signDescriptionClasses = isSolana
    ? 'text-accent-foreground dark:text-accent-foreground'
    : 'text-primary';

  // intentional: chain-brand accent gradients (Solana vs Ethereum) signal the active chain
  const buttonGradient = isSolana
    ? 'from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
    : 'from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700';

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Error message */}
      {error && (
        <div
          className={`p-3 border ${colors.component.card.error.base} ${colors.component.card.error.dark} ${designTokens.radius.lg}`}
        >
          <p className={`text-sm ${colors.component.alert.error.icon}`}>
            {error}
          </p>
        </div>
      )}

      {/* Connected wallet info */}
      <div className={`${ui.background.muted} ${designTokens.radius.lg} p-4`}>
        <div className='flex justify-between items-start mb-2'>
          <p className={textVariants.body.sm()}>
            {labels.connectedWalletLabel}
          </p>
          <span
            className={`text-xs px-2 py-1 rounded-full ${chainBadgeClasses}`}
          >
            {chainLabel}
          </span>
        </div>
        <div className='flex items-center gap-2'>
          {walletProvider && (
            <WalletIcon
              wallet={walletProvider}
              connector={walletConnector}
              className='w-5 h-5'
            />
          )}
          <p className={textVariants.web3.address()}>{walletAddress}</p>
        </div>
      </div>

      {/* Sign message section */}
      <div
        className={`border ${designTokens.radius.lg} p-4 ${signSectionClasses}`}
      >
        <h3 className={`font-semibold mb-2 ${signTitleClasses}`}>
          {signTitle}
        </h3>
        <p className={`text-sm ${signDescriptionClasses}`}>{signDescription}</p>
      </div>

      {/* Sign button */}
      {/* intentional: white sits on the preserved chain-brand gradient surface */}
      <button
        onClick={onSign}
        disabled={isSigning}
        className={`w-full py-4 md:py-3 text-lg font-medium text-white ${designTokens.radius.lg} ${ui.transition.all} bg-gradient-to-r ${buttonGradient} disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isSigning ? (
          <div className='flex items-center justify-center'>
            <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2' />
            {labels.signingButton}
          </div>
        ) : (
          labels.signMessageButton
        )}
      </button>

      {/* Use different wallet link */}
      <button
        onClick={onUseDifferentWallet}
        className={`w-full ${textVariants.body.sm()} hover:text-foreground`}
      >
        {labels.useDifferentWallet}
      </button>

      {/* Optional children (e.g., footer) */}
      {children}
    </div>
  );
};
