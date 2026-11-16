import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import type {
  SubscriptionProduct,
  SubscriptionStatus,
  SubscriptionContextValue,
  SubscriptionProviderConfig,
} from './types';

const SubscriptionContext = createContext<SubscriptionContextValue | undefined>(
  undefined
);

export interface SubscriptionProviderProps extends SubscriptionProviderConfig {
  children: ReactNode;
}

/**
 * SubscriptionProvider - Context provider for subscription management
 *
 * Provides subscription state and actions to all child components.
 * Handles RevenueCat SDK initialization, product fetching, and purchase flow.
 *
 * This component is self-contained: it owns no cross-package state and does not
 * depend on `@sudobility/subscription_lib`. On the web the real RevenueCat work
 * (`@revenuecat/purchases-js`, transformed through the `SubscriptionService` in
 * this package) is wired in by the consuming pages layer, exactly as the React
 * Native port leaves the native `react-native-purchases` wiring to its pages —
 * the two packages mirror each other. The placeholders below mark where a
 * consumer that wants this provider to own the SDK would drop that wiring in.
 *
 * @example
 * ```tsx
 * <SubscriptionProvider
 *   apiKey="your_revenuecat_api_key"
 *   onError={(error) => console.error(error)}
 *   onPurchaseSuccess={(productId) => analytics.track('purchase', { productId })}
 * >
 *   <App />
 * </SubscriptionProvider>
 * ```
 */
export function SubscriptionProvider({
  apiKey,
  userEmail,
  onError,
  onPurchaseSuccess,
  children,
}: SubscriptionProviderProps) {
  const [products, setProducts] = useState<SubscriptionProduct[]>([]);
  const [currentSubscription, setCurrentSubscription] =
    useState<SubscriptionStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const isDevelopment = !apiKey || apiKey === 'your_revenuecat_api_key_here';

  /**
   * Initialize RevenueCat with optional user ID.
   * If userId is undefined, fetches offerings for anonymous browsing.
   * If userId is provided, also fetches customer subscription info.
   */
  const initialize = useCallback(
    async (userId?: string, email?: string) => {
      if (isInitialized) return;

      try {
        setIsLoading(true);
        setError(null);

        if (isDevelopment) {
          console.warn(
            '[SubscriptionProvider] RevenueCat API key not configured'
          );
          setProducts([]);
          setCurrentSubscription(null);
        } else {
          // Placeholder for @revenuecat/purchases-js integration.
          // In actual implementation:
          //   import { Purchases } from '@revenuecat/purchases-js';
          //   Purchases.configure(apiKey, userId ?? anonymousId);
          //   const offerings = await Purchases.getSharedInstance().getOfferings();
          //   const customerInfo = await Purchases.getSharedInstance().getCustomerInfo();
          //   const service = createSubscriptionService();
          //   service.loadOfferings(offerings);
          //   service.loadCustomerInfo(customerInfo);
          //   // → setProducts(...) / setCurrentSubscription(...)
          void userId;
          void email;
          void userEmail;
        }

        setIsInitialized(true);
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : 'Failed to initialize';
        setError(errorMsg);
        setCurrentSubscription(null);
        setProducts([]);
        onError?.(err instanceof Error ? err : new Error(errorMsg));
      } finally {
        setIsLoading(false);
      }
    },
    [isInitialized, isDevelopment, userEmail, onError]
  );

  /**
   * Purchase a subscription
   * @param productIdentifier - The product/package identifier to purchase
   * @param _subscriptionUserId - Optional user ID (for reference)
   */
  const purchase = useCallback(
    async (
      productIdentifier: string,
      _subscriptionUserId?: string
    ): Promise<boolean> => {
      try {
        setIsLoading(true);
        setError(null);

        if (isDevelopment) {
          // Simulate purchase in development
          await new Promise<void>(resolve => setTimeout(resolve, 2000));
          const mockSubscription: SubscriptionStatus = {
            isActive: true,
            expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            purchaseDate: new Date(),
            productIdentifier,
            willRenew: true,
          };
          setCurrentSubscription(mockSubscription);
          onPurchaseSuccess?.(productIdentifier);
          return true;
        }

        // Placeholder for @revenuecat/purchases-js integration.
        // In actual implementation:
        //   const offerings = await Purchases.getSharedInstance().getOfferings();
        //   find the package, then:
        //   const { customerInfo } = await Purchases.getSharedInstance().purchase({ rcPackage });
        //   const status = parseCustomerInfo(customerInfo);
        //   setCurrentSubscription(status.isActive ? status : null);

        return false;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Purchase failed';
        setError(errorMsg);
        onError?.(err instanceof Error ? err : new Error(errorMsg));
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [isDevelopment, onPurchaseSuccess, onError]
  );

  /**
   * Restore previous purchases
   * @param _subscriptionUserId - Optional user ID (for reference)
   */
  const restore = useCallback(
    async (_subscriptionUserId?: string): Promise<boolean> => {
      try {
        setIsLoading(true);
        setError(null);

        if (isDevelopment) {
          await new Promise<void>(resolve => setTimeout(resolve, 1000));
          setError('No previous purchases found');
          return false;
        }

        // Placeholder for @revenuecat/purchases-js integration.
        // In actual implementation:
        //   const customerInfo = await Purchases.getSharedInstance().getCustomerInfo();
        //   const status = parseCustomerInfo(customerInfo);
        //   setCurrentSubscription(status.isActive ? status : null);

        return false;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Restore failed';
        setError(errorMsg);
        onError?.(err instanceof Error ? err : new Error(errorMsg));
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [isDevelopment, onError]
  );

  /**
   * Refresh subscription status
   */
  const refresh = useCallback(async () => {
    if (isDevelopment) return;

    try {
      setError(null);
      // Placeholder for @revenuecat/purchases-js integration.
      // In actual implementation:
      //   const customerInfo = await Purchases.getSharedInstance().getCustomerInfo();
      //   const offerings = await Purchases.getSharedInstance().getOfferings();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Refresh failed';
      setError(errorMsg);
      onError?.(err instanceof Error ? err : new Error(errorMsg));
    }
  }, [isDevelopment, onError]);

  /**
   * Clear error state
   */
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
}

/**
 * Hook to access subscription context
 *
 * @throws Error if used outside of SubscriptionProvider
 */
export function useSubscriptionContext(): SubscriptionContextValue {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error(
      'useSubscriptionContext must be used within a SubscriptionProvider'
    );
  }
  return context;
}

export { SubscriptionContext };

interface WebStorageLike {
  length: number;
  key(index: number): string | null;
  removeItem(key: string): void;
}

/**
 * Clear RevenueCat Web Billing state from Web Storage.
 *
 * RevenueCat Web Billing (`@revenuecat/purchases-js`) persists
 * checkout/session state under keys containing `revenuecat` / `rcb` / `rc_`.
 * Clearing them (e.g. on sign-out/reset) drops any in-flight checkout session.
 * The React Native port exposes the identical function so the two packages
 * mirror each other.
 */
export const clearRevenueCatCheckoutSessions = (): void => {
  const clearFrom = (storage: WebStorageLike | undefined): void => {
    if (!storage) return;
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i);
        if (
          key &&
          (key.includes('revenuecat') ||
            key.includes('rcb') ||
            key.includes('rc_'))
        ) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => storage.removeItem(key));
    } catch {
      // Ignore storage errors
    }
  };

  const g = globalThis as unknown as {
    localStorage?: WebStorageLike;
    sessionStorage?: WebStorageLike;
  };
  clearFrom(g.localStorage);
  clearFrom(g.sessionStorage);
};

/**
 * Close RevenueCat instance and clear sessions.
 */
export const closeRevenueCatInstance = (): void => {
  try {
    clearRevenueCatCheckoutSessions();
  } catch {
    // Ignore close errors
  }
};

export default SubscriptionProvider;
