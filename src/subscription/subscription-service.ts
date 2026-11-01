/**
 * Subscription Service
 *
 * Provides a clean abstraction over RevenueCat data model.
 *
 * Data Model:
 * - Offer (1) → Packages (many)
 * - Package (1) → Product (1)
 * - Product → grants → Entitlements (many)
 */

import type {
  Offerings,
  Package,
  CustomerInfo,
} from '@revenuecat/purchases-js';

// =============================================================================
// Types
// =============================================================================

/**
 * Entitlement granted by a subscription
 */
export interface SubscriptionEntitlement {
  /** Entitlement identifier (e.g., "bandwidth_pro") */
  identifier: string;
}

/**
 * Product pricing and billing information
 */
export interface SubscriptionProductInfo {
  /** Product ID from the store */
  productId: string;
  /** Product display name */
  name: string;
  /** Product description */
  description?: string;
  /** Numeric price value */
  price: number;
  /** Formatted price string (e.g., "$9.99") */
  priceString: string;
  /** Currency code (e.g., "USD") */
  currency?: string;
  /** Billing cycle as ISO 8601 duration (e.g., "P1M" for monthly, "P1Y" for yearly) */
  billingCycle?: string;
  /** Trial period as ISO 8601 duration (e.g., "P7D" for 7 days) */
  trialPeriod?: string;
  /** Introductory price string */
  introPrice?: string;
  /** Introductory price period */
  introPricePeriod?: string;
  /** Number of intro price billing cycles */
  introPriceCycles?: number;
}

/**
 * Package with product and entitlement information
 */
export interface SubscriptionPackage {
  /** Package identifier (e.g., "pro_monthly") */
  packageId: string;
  /** Package display name */
  name: string;
  /** Product information */
  product: SubscriptionProductInfo;
  /** Entitlements granted by this package */
  entitlements: SubscriptionEntitlement[];
}

/**
 * Offer containing packages (complete hierarchy)
 */
export interface SubscriptionOffer {
  /** Offer identifier */
  offerId: string;
  /** Offer metadata from RevenueCat */
  metadata?: Record<string, unknown>;
  /** Packages in this offer (each with product and entitlements) */
  packages: SubscriptionPackage[];
}

/**
 * Current subscription status with entitlements
 */
export interface CurrentSubscriptionInfo {
  /** Whether subscription is active */
  isActive: boolean;
  /** Active entitlements */
  entitlements: SubscriptionEntitlement[];
  /** Product identifier of the subscription */
  productId?: string;
  /** Expiration date */
  expirationDate?: Date;
  /** Whether subscription will auto-renew */
  willRenew?: boolean;
}

// =============================================================================
// Subscription Service
// =============================================================================

/**
 * Service for managing subscription data with clean abstractions.
 * All data comes from RevenueCat.
 *
 * @example
 * ```typescript
 * const service = createSubscriptionService();
 * service.loadOfferings(offerings);
 * service.loadCustomerInfo(customerInfo);
 *
 * // Get complete offer hierarchy
 * const offer = service.getOffer('default');
 * // offer.packages[0].product.priceString
 * // offer.packages[0].entitlements[0].identifier
 *
 * // Get current subscription
 * const current = service.getCurrentSubscription();
 * ```
 */
export class SubscriptionService {
  private offersCache: Map<string, SubscriptionOffer> = new Map();
  private currentSubscription: CurrentSubscriptionInfo | null = null;

  // ---------------------------------------------------------------------------
  // Data Loading
  // ---------------------------------------------------------------------------

  /**
   * Load offerings from RevenueCat response
   */
  loadOfferings(offerings: Offerings): void {
    this.offersCache.clear();

    const allOfferingsData = (offerings as { all?: Record<string, unknown> })
      .all;

    if (allOfferingsData) {
      for (const [offerId, offeringData] of Object.entries(allOfferingsData)) {
        const offer = this.parseOffer(offerId, offeringData);
        this.offersCache.set(offerId, offer);
      }
    } else if (offerings.current) {
      const offer = this.parseOffer('default', offerings.current);
      this.offersCache.set('default', offer);
    }
  }

  /**
   * Load customer info from RevenueCat response
   */
  loadCustomerInfo(customerInfo: CustomerInfo): void {
    const activeEntitlementIds = Object.keys(customerInfo.entitlements.active);

    if (activeEntitlementIds.length === 0) {
      this.currentSubscription = {
        isActive: false,
        entitlements: [],
      };
      return;
    }

    const entitlements: SubscriptionEntitlement[] = activeEntitlementIds.map(
      id => ({ identifier: id })
    );

    const firstEntitlement =
      customerInfo.entitlements.active[activeEntitlementIds[0]];

    this.currentSubscription = {
      isActive: true,
      entitlements,
      productId: firstEntitlement.productIdentifier,
      expirationDate: firstEntitlement.expirationDate
        ? new Date(firstEntitlement.expirationDate)
        : undefined,
      willRenew: firstEntitlement.willRenew,
    };
  }

  // ---------------------------------------------------------------------------
  // Public API
  // ---------------------------------------------------------------------------

  /**
   * Get offer by ID with complete hierarchy (packages → product → entitlements)
   */
  getOffer(offerId: string): SubscriptionOffer | null {
    return this.offersCache.get(offerId) ?? null;
  }

  /**
   * Get all offer IDs
   */
  getOfferIds(): string[] {
    return Array.from(this.offersCache.keys());
  }

  /**
   * Get current subscription info
   */
  getCurrentSubscription(): CurrentSubscriptionInfo | null {
    return this.currentSubscription;
  }

  // ---------------------------------------------------------------------------
  // Private Helpers
  // ---------------------------------------------------------------------------

  private parseOffer(
    offerId: string,
    offeringData: unknown
  ): SubscriptionOffer {
    const offering = offeringData as {
      availablePackages?: Package[];
      metadata?: Record<string, unknown>;
    };

    const metadata = offering.metadata;
    const packages: SubscriptionPackage[] = [];

    if (offering.availablePackages) {
      for (const pkg of offering.availablePackages) {
        packages.push(this.parsePackage(pkg, metadata));
      }
    }

    return {
      offerId,
      metadata,
      packages,
    };
  }

  private parsePackage(
    pkg: Package,
    offeringMetadata?: Record<string, unknown>
  ): SubscriptionPackage {
    const product = pkg.rcBillingProduct;
    const subscriptionOption = product?.defaultSubscriptionOption;

    const entitlements = this.extractEntitlements(offeringMetadata);

    const productInfo: SubscriptionProductInfo = {
      productId: product?.identifier ?? pkg.identifier,
      name: product?.title ?? pkg.identifier,
      description: product?.description ?? undefined,
      price: product?.currentPrice?.amountMicros
        ? product.currentPrice.amountMicros / 1000000
        : 0,
      priceString: product?.currentPrice?.formattedPrice ?? '$0',
      currency: product?.currentPrice?.currency ?? undefined,
      billingCycle: product?.normalPeriodDuration ?? undefined,
      trialPeriod: subscriptionOption?.trial?.periodDuration ?? undefined,
      introPrice:
        subscriptionOption?.introPrice?.price?.formattedPrice ?? undefined,
      introPricePeriod:
        subscriptionOption?.introPrice?.periodDuration ?? undefined,
      introPriceCycles: subscriptionOption?.introPrice?.cycleCount ?? undefined,
    };

    return {
      packageId: pkg.identifier,
      name: product?.title ?? pkg.identifier,
      product: productInfo,
      entitlements,
    };
  }

  private extractEntitlements(
    offeringMetadata?: Record<string, unknown>
  ): SubscriptionEntitlement[] {
    const entitlements: SubscriptionEntitlement[] = [];

    if (!offeringMetadata) return entitlements;

    // Single entitlement in metadata
    if (
      offeringMetadata.entitlement &&
      typeof offeringMetadata.entitlement === 'string'
    ) {
      entitlements.push({
        identifier: offeringMetadata.entitlement,
      });
    }

    // Array of entitlements in metadata
    if (Array.isArray(offeringMetadata.entitlements)) {
      for (const ent of offeringMetadata.entitlements) {
        if (typeof ent === 'string') {
          entitlements.push({ identifier: ent });
        } else if (
          typeof ent === 'object' &&
          ent !== null &&
          typeof (ent as { identifier?: string }).identifier === 'string'
        ) {
          entitlements.push({
            identifier: (ent as { identifier: string }).identifier,
          });
        }
      }
    }

    return entitlements;
  }
}

// =============================================================================
// Factory
// =============================================================================

/**
 * Create a new SubscriptionService instance
 */
export function createSubscriptionService(): SubscriptionService {
  return new SubscriptionService();
}
