import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  SubscriptionProvider,
  useSubscriptionContext,
  clearRevenueCatCheckoutSessions,
} from '../subscription-provider';

// Mock subscription_lib
vi.mock('@sudobility/subscription_lib', () => ({
  isSubscriptionInitialized: vi.fn(() => false),
  getSubscriptionInstance: vi.fn(),
  setSubscriptionUserId: vi.fn(),
  refreshSubscription: vi.fn(),
  restoreSubscription: vi.fn(),
  onSubscriptionRefresh: vi.fn(() => vi.fn()),
}));

// Test component that uses the context
const TestConsumer: React.FC = () => {
  const { products, currentSubscription, isLoading, error } =
    useSubscriptionContext();

  return (
    <div>
      <div data-testid='loading'>{isLoading ? 'Loading' : 'Ready'}</div>
      <div data-testid='error'>{error || 'No error'}</div>
      <div data-testid='products'>{products.length} products</div>
      <div data-testid='subscription'>
        {currentSubscription?.isActive ? 'Active' : 'Inactive'}
      </div>
    </div>
  );
};

describe('SubscriptionProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
  });

  it('renders children', () => {
    render(
      <SubscriptionProvider apiKey=''>
        <div data-testid='child'>Child Content</div>
      </SubscriptionProvider>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('provides context to children', () => {
    render(
      <SubscriptionProvider apiKey=''>
        <TestConsumer />
      </SubscriptionProvider>
    );

    expect(screen.getByTestId('loading')).toHaveTextContent('Ready');
    expect(screen.getByTestId('error')).toHaveTextContent('No error');
    expect(screen.getByTestId('products')).toHaveTextContent('0 products');
    expect(screen.getByTestId('subscription')).toHaveTextContent('Inactive');
  });

  it('throws error when useSubscriptionContext is used outside provider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<TestConsumer />);
    }).toThrow(
      'useSubscriptionContext must be used within a SubscriptionProvider'
    );

    consoleSpy.mockRestore();
  });
});

describe('clearRevenueCatCheckoutSessions', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('removes RevenueCat-related keys from localStorage', () => {
    localStorage.setItem('revenuecat_session', 'test');
    localStorage.setItem('rcb_user', 'test');
    localStorage.setItem('rc_cache', 'test');
    localStorage.setItem('other_key', 'keep');

    clearRevenueCatCheckoutSessions();

    expect(localStorage.getItem('revenuecat_session')).toBeNull();
    expect(localStorage.getItem('rcb_user')).toBeNull();
    expect(localStorage.getItem('rc_cache')).toBeNull();
    expect(localStorage.getItem('other_key')).toBe('keep');
  });

  it('removes RevenueCat-related keys from sessionStorage', () => {
    sessionStorage.setItem('revenuecat_checkout', 'test');
    sessionStorage.setItem('other_key', 'keep');

    clearRevenueCatCheckoutSessions();

    expect(sessionStorage.getItem('revenuecat_checkout')).toBeNull();
    expect(sessionStorage.getItem('other_key')).toBe('keep');
  });
});
