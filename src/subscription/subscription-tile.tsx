import React from 'react';
import { textVariants } from '@sudobility/design';
import { cn } from './lib/cn';
import type {
  BadgeConfig,
  CtaButtonConfig,
  DiscountBadgeConfig,
  PremiumCalloutConfig,
  SubscriptionTileTrackingData,
} from './types';

export interface SubscriptionTileProps {
  /** Unique identifier for the subscription */
  id: string;
  /** Plan title */
  title: string;
  /** Formatted price string (e.g., "$9.99") */
  price: string;
  /** Period label (e.g., "/month", "/year") - passed by consumer for localization */
  periodLabel?: string;
  /** List of features/benefits */
  features: string[];
  /** Whether this tile is currently selected */
  isSelected: boolean;
  /** Selection callback */
  onSelect: () => void;
  /** Whether this is the user's current plan (shows persistent blue border) */
  isCurrentPlan?: boolean;

  /** Optional top badge (e.g., "Most Popular", "Free Trial") */
  topBadge?: BadgeConfig;
  /** Optional discount badge (e.g., "Save 40%") */
  discountBadge?: DiscountBadgeConfig;
  /** Optional premium callout section */
  premiumCallout?: PremiumCalloutConfig;
  /** Optional bottom note (e.g., new expiration date) */
  bottomNote?: string;
  /** Optional intro price note */
  introPriceNote?: string;

  /** Whether this is the best value option (affects styling) */
  isBestValue?: boolean;
  /** CTA button configuration - when provided, renders a button instead of radio indicator */
  ctaButton?: CtaButtonConfig;
  /** Additional CSS classes */
  className?: string;
  /** Custom content to render in the content area */
  children?: React.ReactNode;
  /** Disabled state (prevents interaction but keeps normal appearance) */
  disabled?: boolean;
  /** Whether this tile is enabled/selectable (false = grayed out, no indicator) */
  enabled?: boolean;

  /** Accessibility label */
  ariaLabel?: string;

  /** Optional tracking callback */
  onTrack?: (data: SubscriptionTileTrackingData) => void;
  /** Optional tracking label */
  trackingLabel?: string;
  /** Optional component name for tracking */
  componentName?: string;
  /** Hide both radio button and CTA button (for free tier tiles) */
  hideSelectionIndicator?: boolean;
}

const BADGE_COLORS: Record<BadgeConfig['color'], string> = {
  purple: 'bg-accent',
  green: 'bg-success',
  blue: 'bg-primary',
  yellow: 'bg-warning !text-warning-foreground',
  red: 'bg-destructive',
};

/**
 * SubscriptionTile - A reusable subscription plan display component
 *
 * Displays a subscription plan with pricing, features, badges, and selection state.
 * All text is passed by the consumer for full localization control.
 *
 * Layout: Uses flexbox with content area (flex-1) and a fixed-height bottom area
 * for button/radio. This ensures no overlap between content and bottom elements.
 */
export const SubscriptionTile: React.FC<SubscriptionTileProps> = ({
  id: _id,
  title,
  price,
  periodLabel,
  features,
  isSelected,
  onSelect,
  isCurrentPlan = false,
  topBadge,
  discountBadge,
  premiumCallout,
  bottomNote,
  introPriceNote,
  isBestValue: _isBestValue = false,
  ctaButton,
  className,
  children,
  disabled = false,
  enabled = true,
  ariaLabel,
  onTrack,
  trackingLabel,
  componentName = 'SubscriptionTile',
  hideSelectionIndicator = false,
}) => {
  // When ctaButton is provided, tile is not selectable (CTA mode)
  const isCtaMode = !!ctaButton;
  // Whether to show any bottom indicator (radio or CTA)
  // Hide indicator when: hideSelectionIndicator, isCurrentPlan (user's current plan), or not enabled
  const showIndicator = !hideSelectionIndicator && !isCurrentPlan && enabled;
  // Whether the tile is interactive (can be clicked/selected)
  const isInteractive = enabled && !isCurrentPlan && !disabled;
  // Styling logic:
  // - Selected: Blue background with blue border
  // - Current plan (not selected): Blue border to indicate current subscription
  // - Not enabled: Grayed out with opacity-50
  // - Default: Gray background
  // Note: All states use the same border-2 and shadow-md for consistent layout
  const tileStyles = isSelected
    ? 'bg-primary text-primary-foreground border-2 border-primary shadow-md'
    : isCurrentPlan
      ? 'bg-muted border-2 border-primary shadow-md'
      : !enabled
        ? 'bg-muted border-2 border-border opacity-50 shadow-md'
        : 'bg-muted border-2 border-border shadow-md hover:border-border ';

  const handleClick = () => {
    if (isInteractive && !isCtaMode) {
      onTrack?.({ action: 'select', trackingLabel, componentName });
      onSelect();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isInteractive && !isCtaMode && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onTrack?.({ action: 'select', trackingLabel, componentName });
      onSelect();
    }
  };

  const handleCtaClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onTrack?.({ action: 'cta_click', trackingLabel, componentName });
    if (ctaButton?.onClick) {
      ctaButton.onClick();
    }
  };

  return (
    <div
      className={cn(
        'relative rounded-2xl p-6 transition-all flex flex-col h-full',
        !isInteractive || isCtaMode ? 'cursor-default' : 'cursor-pointer',
        disabled && 'cursor-not-allowed',
        tileStyles,
        className
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role={isCtaMode ? 'article' : 'radio'}
      aria-checked={isCtaMode ? undefined : isSelected}
      aria-label={ariaLabel || `${title} - ${price}${periodLabel || ''}`}
      aria-disabled={!isInteractive}
      tabIndex={isCtaMode || !isInteractive ? -1 : 0}
    >
      {/* Top Badge - vertically centered on the top border */}
      {topBadge && (
        <div className='absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10'>
          <span
            className={cn(
              BADGE_COLORS[topBadge.color],
              'text-primary-foreground px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg whitespace-nowrap'
            )}
          >
            {topBadge.text}
          </span>
        </div>
      )}

      {/* Main content - flex-1 takes available space above the fixed bottom area */}
      <div className='flex-1 flex flex-col'>
        {/* Title and Price - add top margin when there's a topBadge */}
        <div className={cn('text-center mb-6', topBadge && 'mt-2')}>
          <h3
            className={cn(
              textVariants.heading.h4(),
              'mb-2',
              isSelected ? 'text-primary-foreground' : ''
            )}
          >
            {title}
          </h3>
          <div className='mb-3'>
            <span
              className={cn(
                'text-4xl font-bold',
                isSelected ? 'text-primary-foreground' : 'text-foreground'
              )}
            >
              {price}
            </span>
            {periodLabel && (
              <span
                className={cn(
                  'text-lg',
                  isSelected
                    ? 'text-primary-foreground'
                    : 'text-muted-foreground'
                )}
              >
                {periodLabel}
              </span>
            )}
          </div>

          {/* Discount Badge */}
          {discountBadge && (
            <div
              className={cn(
                'inline-flex items-center px-2 py-1 rounded-full text-sm font-semibold',
                isSelected
                  ? 'bg-primary-foreground/20 text-primary-foreground'
                  : 'bg-success/10 text-success'
              )}
            >
              {discountBadge.text}
            </div>
          )}
        </div>

        {/* Custom Content Area */}
        {children}

        {/* Features List - no flex-grow, just takes its natural height */}
        {features.length > 0 && (
          <div className='space-y-3 mb-6'>
            {features.map((feature, index) => (
              <div key={index} className='flex items-start'>
                <svg
                  className={cn(
                    'w-5 h-5 mr-3 flex-shrink-0',
                    isSelected ? 'text-primary-foreground' : 'text-success'
                  )}
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M5 13l4 4L19 7'
                  />
                </svg>
                <span
                  className={cn(
                    'text-sm text-left',
                    isSelected
                      ? 'text-primary-foreground'
                      : 'text-muted-foreground'
                  )}
                >
                  {feature.replace(/^✓\s*/, '')}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Premium Callout */}
        {premiumCallout && (
          <div
            className={cn(
              'rounded-lg p-4 mb-4',
              isSelected
                ? 'bg-primary/30'
                : 'bg-gradient-to-r from-primary/10 to-accent/10'
            )}
          >
            <div className='flex items-center mb-2'>
              <span
                className={cn(
                  'font-semibold text-sm',
                  isSelected
                    ? 'text-primary-foreground'
                    : 'text-accent-foreground'
                )}
              >
                {premiumCallout.title}
              </span>
            </div>
            <ul
              className={cn(
                'text-xs space-y-1',
                isSelected ? 'text-primary-foreground' : 'text-muted-foreground'
              )}
            >
              {premiumCallout.features.map((feat, idx) => (
                <li key={idx}>• {feat}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Bottom Note (e.g., new expiration date) */}
        {bottomNote && (
          <div
            className={cn(
              'text-center text-sm font-medium mb-4',
              isSelected ? 'text-primary-foreground' : 'text-primary'
            )}
          >
            {bottomNote}
          </div>
        )}

        {/* Intro Price Banner */}
        {introPriceNote && (
          <div
            className={cn(
              'p-3 rounded-lg',
              isSelected
                ? 'bg-primary/30'
                : 'bg-warning/10 border border-warning/20'
            )}
          >
            <p
              className={cn(
                'text-sm font-semibold text-center',
                isSelected ? 'text-primary-foreground' : 'text-warning'
              )}
            >
              {introPriceNote}
            </p>
          </div>
        )}
      </div>

      {/* Fixed-height bottom area - always present to reserve space */}
      <div className='h-14 flex-shrink-0 flex items-end justify-center'>
        {/* CTA Button */}
        {showIndicator && isCtaMode && (
          <div className='w-full'>
            {ctaButton.href ? (
              <a
                href={ctaButton.href}
                className={cn(
                  'block w-full py-3 font-semibold rounded-lg text-center transition-colors',
                  isSelected
                    ? 'bg-background text-primary hover:bg-muted'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90'
                )}
                onClick={e => e.stopPropagation()}
              >
                {ctaButton.label}
              </a>
            ) : (
              <button
                onClick={handleCtaClick}
                disabled={disabled}
                className={cn(
                  'w-full py-3 font-semibold rounded-lg transition-colors',
                  isSelected
                    ? 'bg-background text-primary hover:bg-muted'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90',
                  disabled && 'opacity-50 cursor-not-allowed'
                )}
              >
                {ctaButton.label}
              </button>
            )}
          </div>
        )}

        {/* Radio button indicator */}
        {showIndicator && !isCtaMode && (
          <div
            className={cn(
              'w-5 h-5 rounded-full border-2 flex items-center justify-center',
              isSelected
                ? 'border-primary-foreground bg-primary-foreground'
                : 'border-border'
            )}
          >
            {isSelected && <div className='w-2 h-2 rounded-full bg-primary' />}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionTile;
