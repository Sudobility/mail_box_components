import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from 'react';
import type {
  SubscriptionProduct,
  SubscriptionStatus,
  SubscriptionContextValue,
  SubscriptionProviderConfig,
} from './types';

// Import from subscription_lib — the single source of truth for state.
// subscription_lib must be initialized by the consuming app before
// SubscriptionProvider is mounted (via initializeSubscription + adapter).
import {
  isSubscriptionInitialized,
  getSubscriptionInstance,
  setSubscriptionUserId,
  refreshSubscription,
  restoreSubscription,
  onSubscriptionRefresh,
} from '@sudobility/subscription_lib';
import type {
  SubscriptionOffer,
  CurrentSubscription,
} from '@sudobility/subscription_lib';

// ---------------------------------------------------------------------------
// Helpers: convert subscription_lib types → subscription-components types
// ---------------------------------------------------------------------------

function offersToProducts(offers: SubscriptionOffer[]): SubscriptionProduct[] {
  const products: SubscriptionProduct[] = [];
  for (const offer of offers) {
    for (const pkg of offer.packages) {
      if (!pkg.product) continue;
      products.push({
        identifier: pkg.packageId,
        productId: pkg.product.productId,
        price: String(pkg.product.price),
        priceString: pkg.product.priceString,
        title: pkg.product.name,
        description: pkg.product.description,
        period: pkg.product.periodDuration || undefined,
        introPrice: pkg.product.introPrice,
        introPricePeriod: pkg.product.introPricePeriod,
        introPriceCycles: pkg.product.introPriceCycles,
        freeTrialPeriod: pkg.product.trialPeriod,
        entitlement: pkg.entitlements?.[0] ?? undefined,
      });
    }
  }
  return products;
}

function subscriptionToStatus(
  sub: CurrentSubscription | null
): SubscriptionStatus | null {
  if (!sub || !sub.isActive) return null;
  return {
    isActive: true,
    expirationDate: sub.expirationDate,
    productIdentifier: sub.productId,
    willRenew: sub.willRenew,
    activeEntitlements: sub.entitlements,
  };
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const SubscriptionContext = createContext<SubscriptionContextValue | undefined>(
  undefined
);

export interface SubscriptionProviderProps extends SubscriptionProviderConfig {
  children: ReactNode;
}

/**
 * SubscriptionProvider — React context wrapping subscription_lib.
 *
 * subscription_lib is the single source of truth for all subscription state.
 * This provider exposes it via React context for convenience.
 *
 * The consuming app must call `initializeSubscription()` from subscription_lib
 * before mounting this provider (typically done in the app's DI/init layer).
 */
export const SubscriptionProvider: React.FC<SubscriptionProviderProps> = ({
  apiKey: _apiKey,
  userEmail: _userEmail,
  onError,
  onPurchaseSuccess,
  children,
}) => {
  const [products, setProducts] = useState<SubscriptionProduct[]>([]);
  const [currentSubscription, setCurrentSubscription] =
    useState<SubscriptionStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync state from subscription_lib on mount and after refreshes
  const syncState = useCallback(() => {
    if (!isSubscriptionInitialized()) return;
    const service = getSubscriptionInstance();
    const offers = service.getAllOffers();
    if (offers.length > 0) {
      setProducts(offersToProducts(offers));
    }
    const sub = service.getCurrentSubscription();
    setCurrentSubscription(subscriptionToStatus(sub));
  }, []);

  useEffect(() => {
    syncState();
    const unsubscribe = onSubscriptionRefresh(() => {
      syncState();
    });
    return unsubscribe;
  }, [syncState]);

  const initialize = useCallback(
    async (userId?: string, email?: string) => {
      try {
        setIsLoading(true);
        setError(null);

        await setSubscriptionUserId(userId, email);

        if (isSubscriptionInitialized()) {
          const service = getSubscriptionInstance();

          // Ensure offerings are loaded
          if (!service.hasLoadedOfferings()) {
            await service.loadOfferings();
          }

          // Load customer info if we have a user
          if (userId) {
            await service.loadCustomerInfo();
          }

          syncState();
        }
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : 'Failed to initialize';
        setError(errorMsg);
        onError?.(err instanceof Error ? err : new Error(errorMsg));
      } finally {
        setIsLoading(false);
      }
    },
    [syncState, onError]
  );

  const purchase = useCallback(
    async (productIdentifier: string): Promise<boolean> => {
      if (!isSubscriptionInitialized()) {
        setError('Subscription service not initialized');
        return false;
      }

      try {
        setIsLoading(true);
        setError(null);

        const service = getSubscriptionInstance();

        // Find which offering contains this package
        const offers = service.getAllOffers();
        let offeringId: string | undefined;
        for (const offer of offers) {
          if (offer.packages.some(p => p.packageId === productIdentifier)) {
            offeringId = offer.offerId;
            break;
          }
        }

        await service.purchase({
          packageId: productIdentifier,
          offeringId: offeringId ?? '',
        });

        await refreshSubscription();
        syncState();
        onPurchaseSuccess?.(productIdentifier);
        return true;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Purchase failed';
        setError(errorMsg);
        onError?.(err instanceof Error ? err : new Error(errorMsg));
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [syncState, onPurchaseSuccess, onError]
  );

  const restore = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await restoreSubscription();
      syncState();

      if (!result?.isActive) {
        setError('No previous purchases found');
      }

      return result?.isActive ?? false;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Restore failed';
      setError(errorMsg);
      onError?.(err instanceof Error ? err : new Error(errorMsg));
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [syncState, onError]);

  const refresh = useCallback(async () => {
    try {
      setError(null);
      await refreshSubscription();
      syncState();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Refresh failed';
      setError(errorMsg);
      onError?.(err instanceof Error ? err : new Error(errorMsg));
    }
  }, [syncState, onError]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: SubscriptionContextValue = {
    products,
    currentSubscription,
    isLoading,
    error,
    initialize,
    purchase,
    restore,
    refresh,
    clearError,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

/**
 * Hook to access subscription context
 */
export const useSubscriptionContext = (): SubscriptionContextValue => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error(
      'useSubscriptionContext must be used within a SubscriptionProvider'
    );
  }
  return context;
};

/**
 * Clear RevenueCat checkout sessions from browser storage
 */
export const clearRevenueCatCheckoutSessions = (): void => {
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (
        key &&
        (key.includes('revenuecat') ||
          key.includes('rcb') ||
          key.includes('rc_'))
      ) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));

    const sessionKeysToRemove: string[] = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (
        key &&
        (key.includes('revenuecat') ||
          key.includes('rcb') ||
          key.includes('rc_'))
      ) {
        sessionKeysToRemove.push(key);
      }
    }
    sessionKeysToRemove.forEach(key => sessionStorage.removeItem(key));
  } catch {
    // Ignore storage errors
  }
};

/**
 * Close RevenueCat instance and clear sessions
 */
export const closeRevenueCatInstance = (): void => {
  try {
    clearRevenueCatCheckoutSessions();
  } catch {
    // Ignore close errors
  }
};

export default SubscriptionProvider;
