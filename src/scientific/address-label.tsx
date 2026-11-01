/**
 * AddressLabel Component
 *
 * Displays a shortened blockchain address (EVM or Solana) with tooltip showing full address.
 * Supports hover and click to show tooltip with full address.
 *
 * @example
 * ```tsx
 * <AddressLabel address="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb" />
 * <AddressLabel address="DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKK" />
 * ```
 */

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ui } from '@sudobility/design';

export interface AddressLabelProps {
  /** Blockchain address (EVM or Solana) */
  address: string;

  /** Number of characters to show at start (default: 6) */
  prefixLength?: number;

  /** Number of characters to show at end (default: 4) */
  suffixLength?: number;

  /** Optional className for custom styling */
  className?: string;

  /** Whether to show copy button (default: false) */
  showCopy?: boolean;
}

/**
 * Shortens a blockchain address for display
 * @param address - Full address
 * @param prefixLength - Characters to show at start
 * @param suffixLength - Characters to show at end
 */
const shortenAddress = (
  address: string,
  prefixLength: number,
  suffixLength: number
): string => {
  if (!address) return '';
  if (address.length <= prefixLength + suffixLength) return address;
  return `${address.slice(0, prefixLength)}...${address.slice(-suffixLength)}`;
};

/**
 * AddressLabel - Displays shortened blockchain address with tooltip
 *
 * Features:
 * - Auto-shortens long addresses
 * - Tooltip shows full address on hover
 * - Click to copy full address
 * - Supports both EVM and Solana addresses
 * - Light/dark theme support
 */
export const AddressLabel: React.FC<AddressLabelProps> = ({
  address,
  prefixLength = 6,
  suffixLength = 4,
  className = '',
  showCopy = false,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [copied, setCopied] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const elementRef = useRef<HTMLElement>(null);

  const shortAddress = shortenAddress(address, prefixLength, suffixLength);

  // Calculate tooltip position when it becomes visible
  useEffect(() => {
    if (showTooltip && elementRef.current) {
      const rect = elementRef.current.getBoundingClientRect();
      setTooltipPosition({
        top: rect.top + window.scrollY - 48, // 48px above the element
        left: rect.left + window.scrollX + rect.width / 2, // Centered horizontally
      });
    }
  }, [showTooltip]);

  const handleClick = async () => {
    if (showCopy) {
      try {
        await navigator.clipboard.writeText(address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy address:', err);
      }
    }
    setShowTooltip(true);
    setTimeout(() => setShowTooltip(false), 2000);
  };

  const handleMouseEnter = () => {
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    if (!copied) {
      setShowTooltip(false);
    }
  };

  // Render tooltip content using portal
  const tooltipContent = showTooltip && (
    <div
      className={`fixed z-[9999] px-3 py-2 bg-popover text-popover-foreground text-xs rounded ${ui.shadow.lg} whitespace-nowrap pointer-events-none`}
      style={{
        top: `${tooltipPosition.top}px`,
        left: `${tooltipPosition.left}px`,
        transform: 'translateX(-50%)',
        minWidth: 'max-content',
      }}
    >
      {copied ? (
        <span className='text-success'>✓ Copied!</span>
      ) : (
        <span className='font-mono'>{address}</span>
      )}
      {/* Arrow */}
      <div className='absolute left-1/2 transform -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-popover' />
    </div>
  );

  return (
    <>
      <code
        ref={elementRef}
        className={`
          ${ui.text.code}
          ${showCopy ? 'cursor-pointer hover:text-primary' : ''}
          ${className}
        `}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        title={address}
      >
        {shortAddress}
      </code>

      {/* Tooltip rendered via portal to prevent clipping by parent containers */}
      {tooltipContent &&
        typeof document !== 'undefined' &&
        createPortal(tooltipContent, document.body)}
    </>
  );
};
