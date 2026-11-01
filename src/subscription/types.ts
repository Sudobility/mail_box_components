/**
 * Type definitions for subscription components
 */

/**
 * Product information from RevenueCat or custom backend
 */
export interface SubscriptionProduct {
  /** Unique identifier for the product/package */
  identifier: string;
  /** Underlying product ID (e.g., from app store) */
  productId?: string;
  /** Numeric price value */
  price: string;
  /** Formatted price string (e.g., "$9.99") */
  priceString: string;
  /** Product title */
  title: string;
  /** Product description */
  description?: string;
  /** ISO 8601 duration (e.g., "P1M", "P1Y") */
  period?: string;
  /** Formatted introductory price */
  introPrice?: string;
  /** Raw intro price amount */
  introPriceAmount?: string;
  /** Intro price period (ISO 8601) */
  introPricePeriod?: string;
  /** Number of billing cycles for intro price */
  introPriceCycles?: number;
  /** Free trial period (ISO 8601, e.g., "P7D") */
  freeTrialPeriod?: string;
  /** Entitlement identifier this product grants (from offering metadata) */
  entitlement?: string;
}

/**
 * Active subscription status
 */
export interface SubscriptionStatus {
  /** Whether the user has an active subscription */
  isActive: boolean;
  /** Expiration date of the subscription */
  expirationDate?: Date;
  /** Date when subscription was purchased */
  purchaseDate?: Date;
  /** Product identifier of the current subscription */
  productIdentifier?: string;
  /** Whether subscription will auto-renew */
  willRenew?: boolean;
  /** Whether this is a sandbox/test subscription */
  isSandbox?: boolean;
  /** Date when unsubscription was detected */
  unsubscribeDetectedAt?: Date;
  /** Date when billing issue was detected */
  billingIssueDetectedAt?: Date;
  /** Active entitlement identifiers */
  activeEntitlements?: string[];
}

/**
 * Badge display configuration
 */
export interface BadgeConfig {
  /** Badge text */
  text: string;
  /** Badge color variant */
  color: 'purple' | 'green' | 'blue' | 'yellow' | 'red';
}

/**
 * Discount badge configuration
 */
export interface DiscountBadgeConfig {
  /** Discount text (e.g., "Save 40%") */
  text: string;
  /** Whether this is the best value option */
  isBestValue?: boolean;
}

/**
 * Premium callout section configuration
 */
export interface PremiumCalloutConfig {
  /** Callout title */
  title: string;
  /** List of premium features */
  features: string[];
}

/**
 * CTA button configuration for tile
 */
export interface CtaButtonConfig {
  /** Button label */
  label: string;
  /** Click handler (for button behavior) */
  onClick?: () => void;
  /** Link href (for link behavior) */
  href?: string;
}

/** Tracking data for SubscriptionTile actions */
export interface SubscriptionTileTrackingData {
  action: 'select' | 'cta_click';
  trackingLabel?: string;
  componentName?: string;
}

/** Tracking data for SubscriptionLayout actions */
export interface SubscriptionLayoutTrackingData {
  action: 'primary_action' | 'secondary_action';
  trackingLabel?: string;
  componentName?: string;
}

/**
 * Free tile configuration for CTA variant layout
 */
export interface FreeTileConfig {
  /** Tile title (e.g., "Free") */
  title: string;
  /** Price display (e.g., "$0") */
  price: string;
  /** Period label (e.g., "/month") */
  periodLabel?: string;
  /** List of features included in free tier */
  features: string[];
  /** CTA button configuration (omit to hide the button) */
  ctaButton?: CtaButtonConfig;
  /** Optional top badge */
  topBadge?: BadgeConfig;
}

/**
 * Subscription context value
 */
export interface SubscriptionContextValue {
  /** Available products */
  products: SubscriptionProduct[];
  /** Current subscription status */
  currentSubscription: SubscriptionStatus | null;
  /** Whether data is loading */
  isLoading: boolean;
  /** Error message if any */
  error: string | null;
  /** Initialize the subscription service. If userId is undefined, clears the current user. */
  initialize: (userId?: string, email?: string) => Promise<void>;
  /** Purchase a subscription. subscriptionUserId identifies which user/entity the subscription is for. */
  purchase: (
    productIdentifier: string,
    subscriptionUserId?: string
  ) => Promise<boolean>;
  /** Restore previous purchases. subscriptionUserId identifies which user/entity to restore for. */
  restore: (subscriptionUserId?: string) => Promise<boolean>;
  /** Refresh subscription status */
  refresh: () => Promise<void>;
  /** Clear error state */
  clearError: () => void;
}

/**
 * Provider configuration
 */
export interface SubscriptionProviderConfig {
  /** RevenueCat API key */
  apiKey: string;
  /** Optional user email for RevenueCat */
  userEmail?: string;
  /** Error callback */
  onError?: (error: Error) => void;
  /** Success callback after purchase */
  onPurchaseSuccess?: (productId: string) => void;
}
