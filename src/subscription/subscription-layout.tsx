import React from 'react';
import { Button } from '../index';
import { textVariants } from '@sudobility/design';
import { cn } from './lib/cn';
import { SubscriptionTile } from './subscription-tile';
import { PlatformIcon, platformDisplayName } from './platform-icon';
import type { FreeTileConfig, SubscriptionLayoutTrackingData } from './types';

/**
 * Current subscription status display configuration
 */
export interface SubscriptionStatusConfig {
  /** Whether user has an active subscription */
  isActive: boolean;
  /** Content to display when subscription is active */
  activeContent?: {
    /** Status title (e.g., "Active Subscription") */
    title: string;
    /** Status fields to display */
    fields?: Array<{
      label: string;
      value: string;
    }>;
    /** Subscription platform display */
    platform?: {
      label: string;
      value: 'web' | 'ios' | 'android' | 'macos';
    };
  };
  /** Content to display when no active subscription */
  inactiveContent?: {
    /** Status title (e.g., "No Active Subscription") */
    title: string;
    /** Description message */
    message: string;
  };
}

/**
 * Action button configuration
 */
export interface ActionButtonConfig {
  /** Button label */
  label: string;
  /** Click handler */
  onClick: () => void;
  /** Whether button is disabled */
  disabled?: boolean;
  /** Whether button is in loading state */
  loading?: boolean;
}

/**
 * Layout variant:
 * - 'selection': User selects a tile, then clicks a shared CTA button (default)
 * - 'cta': Each tile has its own CTA button, no shared action buttons
 */
export type SubscriptionLayoutVariant = 'selection' | 'cta';

export interface SubscriptionLayoutProps {
  /** Section title */
  title: string;
  /** Subscription tiles to render */
  children: React.ReactNode;
  /** Error message to display */
  error?: string | null;

  /**
   * Layout variant
   * - 'selection': User selects a tile, then clicks primary action button
   * - 'cta': Each tile has its own CTA button (use ctaButton prop on tiles)
   * @default 'selection'
   */
  variant?: SubscriptionLayoutVariant;

  /** Current subscription status configuration */
  currentStatus?: SubscriptionStatusConfig;

  /** Primary action button (e.g., "Subscribe Now") - only shown in 'selection' variant */
  primaryAction?: ActionButtonConfig;

  /** Secondary action button (e.g., "Restore Purchase") - only shown in 'selection' variant */
  secondaryAction?: ActionButtonConfig;

  /** Minimum tile width in pixels (default: 240) */
  minTileWidth?: number;

  /** Additional CSS classes */
  className?: string;

  /** Custom header content */
  headerContent?: React.ReactNode;

  /** Content to render above the product tiles (e.g., billing period selector) */
  aboveProducts?: React.ReactNode;

  /** Custom footer content (rendered above action buttons) */
  footerContent?: React.ReactNode;

  /** Label for "Current Status" section - for localization */
  currentStatusLabel?: string;

  /**
   * Configuration for the free tile - only used when variant is 'cta'
   * When provided, a "Free" subscription tile will be shown at the start of the grid
   */
  freeTileConfig?: FreeTileConfig;

  /** Optional tracking callback */
  onTrack?: (data: SubscriptionLayoutTrackingData) => void;
  /** Optional tracking label */
  trackingLabel?: string;
  /** Optional component name for tracking */
  componentName?: string;
}

/**
 * SubscriptionLayout - Container component for subscription selection UI
 *
 * Provides a consistent layout with:
 * - Optional current status display
 * - Title heading
 * - Responsive grid of subscription tiles (auto-wrapping)
 * - Error message display
 * - Primary and optional secondary action buttons
 *
 * All labels are passed by the consumer for full localization control.
 *
 * @example
 * ```tsx
 * <SubscriptionLayout
 *   title={t('selectPlan')}
 *   currentStatus={{
 *     isActive: hasSubscription,
 *     activeContent: {
 *       title: t('status.active'),
 *       fields: [
 *         { label: t('plan'), value: planName },
 *         { label: t('expires'), value: expirationDate },
 *       ],
 *     },
 *   }}
 *   primaryAction={{
 *     label: t('buttons.subscribe'),
 *     onClick: handleSubscribe,
 *   }}
 *   secondaryAction={{
 *     label: t('buttons.restore'),
 *     onClick: handleRestore,
 *   }}
 *   error={error}
 * >
 *   {plans.map(plan => <SubscriptionTile key={plan.id} {...plan} />)}
 * </SubscriptionLayout>
 * ```
 */
export const SubscriptionLayout: React.FC<SubscriptionLayoutProps> = ({
  // `title` is still accepted for API compatibility but no longer rendered as a
  // heading — the subscription surface shows no title above the controls.
  children,
  error,
  variant = 'selection',
  currentStatus,
  primaryAction,
  secondaryAction,
  minTileWidth = 240,
  className,
  headerContent,
  aboveProducts,
  footerContent,
  currentStatusLabel = 'Current Status',
  freeTileConfig,
  onTrack,
  trackingLabel,
  componentName = 'SubscriptionLayout',
}) => {
  const showActionButtons = variant === 'selection' && primaryAction;

  const handlePrimaryClick = () => {
    onTrack?.({ action: 'primary_action', trackingLabel, componentName });
    primaryAction?.onClick();
  };

  const handleSecondaryClick = () => {
    onTrack?.({ action: 'secondary_action', trackingLabel, componentName });
    secondaryAction?.onClick();
  };
  // Free tile is only valid in 'cta' variant
  const shouldShowFreeTile = variant === 'cta' && freeTileConfig;
  // Use CSS Grid auto-fit with minmax for responsive behavior
  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, ${minTileWidth}px), 1fr))`,
    gap: '1.5rem',
  };

  return (
    <div className={cn('flex flex-col min-h-0', className)}>
      {/* Custom Header Content */}
      {headerContent}

      {/* Segmented control: stays fixed at the top; the content below scrolls. */}
      {aboveProducts}

      {/* Scrollable region — the subscription surface owns its own scroll, so
          the detail pane around it does not need to scroll. `pt-4` leaves room
          for a tile's top badge (e.g. "Current"), which overflows the tile's
          top edge and would otherwise be clipped by the scroll container. */}
      <div className='flex-1 min-h-0 overflow-y-auto pt-4'>
        {/* Current Status Section */}
        {currentStatus && (
          <>
            <h2 className={cn(textVariants.heading.h3(), 'mb-4')}>
              {currentStatusLabel}
            </h2>

            {currentStatus.isActive ? (
              <div className='bg-card/30 border border-border rounded-lg p-4 mb-6'>
                <div className='flex items-center mb-2'>
                  <div className='w-3 h-3 bg-success rounded-full mr-3' />
                  <span className='font-semibold text-foreground'>
                    {currentStatus.activeContent?.title ||
                      'Active Subscription'}
                  </span>
                </div>
                {currentStatus.activeContent?.fields &&
                  currentStatus.activeContent.fields.length > 0 && (
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
                      {currentStatus.activeContent.fields.map(
                        (field, index) => (
                          <div key={index}>
                            <p className='text-sm text-muted-foreground'>
                              {field.label}
                            </p>
                            <p className='font-semibold text-muted-foreground'>
                              {field.value}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  )}
                {currentStatus.activeContent?.platform && (
                  <div className='mt-4'>
                    <p className='text-sm text-muted-foreground'>
                      {currentStatus.activeContent.platform.label}
                    </p>
                    <div className='flex items-center gap-1.5 mt-0.5'>
                      <PlatformIcon
                        platform={currentStatus.activeContent.platform.value}
                        size={16}
                        className='text-muted-foreground'
                      />
                      <p className='font-semibold text-muted-foreground'>
                        {platformDisplayName(
                          currentStatus.activeContent.platform.value
                        )}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className='bg-warning/10 border border-warning/20 rounded-lg p-4 mb-6'>
                <div className='flex items-center mb-2'>
                  <div className='w-3 h-3 bg-warning rounded-full mr-3' />
                  <span className='font-semibold text-warning'>
                    {currentStatus.inactiveContent?.title ||
                      'No Active Subscription'}
                  </span>
                </div>
                {currentStatus.inactiveContent?.message && (
                  <p className='text-warning'>
                    {currentStatus.inactiveContent.message}
                  </p>
                )}
              </div>
            )}
          </>
        )}

        {/* Subscription Tiles Grid (features + options) */}
        <div style={gridStyle}>
          {/* Free Tile - only shown in 'cta' variant when enabled */}
          {shouldShowFreeTile && (
            <SubscriptionTile
              id='free'
              title={freeTileConfig.title}
              price={freeTileConfig.price}
              periodLabel={freeTileConfig.periodLabel}
              features={freeTileConfig.features}
              isSelected={false}
              onSelect={() => {}}
              topBadge={freeTileConfig.topBadge}
              ctaButton={freeTileConfig.ctaButton}
            />
          )}
          {children}
        </div>

        {/* Custom Footer Content */}
        {footerContent}

        {/* Error Message */}
        {error && (
          <div className='bg-destructive/10 border border-destructive/20 rounded-lg p-4 mt-6'>
            <p className='text-destructive'>{error}</p>
          </div>
        )}
      </div>

      {/* Action Buttons - only shown in 'selection' variant */}
      {showActionButtons && (
        <div className='flex flex-col sm:flex-row gap-3 mt-6'>
          {secondaryAction && (
            <Button
              onClick={handleSecondaryClick}
              disabled={secondaryAction.disabled || secondaryAction.loading}
              variant='outline'
              className='sm:flex-shrink-0'
            >
              {secondaryAction.label}
            </Button>
          )}

          <Button
            onClick={handlePrimaryClick}
            disabled={primaryAction.disabled || primaryAction.loading}
            className='flex-1'
          >
            {primaryAction.label}
          </Button>
        </div>
      )}
    </div>
  );
};

export default SubscriptionLayout;
