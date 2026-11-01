/**
 * @sudobility/subscription-components
 *
 * Subscription UI components for React with RevenueCat integration.
 * All components support full localization - text labels are passed by the consumer.
 */

// Components
export {
  SubscriptionTile,
  type SubscriptionTileProps,
} from './subscription-tile';
export {
  SubscriptionLayout,
  type SubscriptionLayoutProps,
  type SubscriptionLayoutVariant,
  type SubscriptionStatusConfig,
  type ActionButtonConfig,
} from './subscription-layout';
export {
  SegmentedControl,
  type SegmentedControlProps,
  type SegmentedControlOption,
} from './segmented-control';
export {
  SubscriptionProvider,
  useSubscriptionContext,
  clearRevenueCatCheckoutSessions,
  closeRevenueCatInstance,
  type SubscriptionProviderProps,
} from './subscription-provider';

// Types
export type {
  SubscriptionProduct,
  SubscriptionStatus,
  SubscriptionContextValue,
  SubscriptionProviderConfig,
  BadgeConfig,
  CtaButtonConfig,
  DiscountBadgeConfig,
  PremiumCalloutConfig,
  FreeTileConfig,
} from './types';

// Subscription Service
export {
  SubscriptionService,
  createSubscriptionService,
  type SubscriptionEntitlement,
  type SubscriptionProductInfo,
  type SubscriptionPackage,
  type SubscriptionOffer,
  type CurrentSubscriptionInfo,
} from './subscription-service';

// Utilities
export { cn } from './lib/cn';
