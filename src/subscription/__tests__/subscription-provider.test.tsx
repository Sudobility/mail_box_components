import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  SubscriptionProvider,
  useSubscriptionContext,
  clearRevenueCatCheckoutSessions,
} from '../subscription-provider';

// Helper component that exposes context values for testing
const TestConsumer: React.FC = () => {
  const ctx = useSubscriptionContext();
  return (
    <div>
      <div data-testid='loading'>{ctx.isLoading ? 'true' : 'false'}</div>
      <div data-testid='error'>{ctx.error ?? 'none'}</div>
      <div data-testid='products'>{ctx.products.length} products</div>
      <div data-testid='subscription'>
        {ctx.currentSubscription?.isActive ? 'active' : 'none'}
      </div>
      <button data-testid='initialize' onClick={() => ctx.initialize()} />
      <button
        data-testid='purchase'
        onClick={() => ctx.purchase('test_product')}
      />
      <button data-testid='restore' onClick={() => ctx.restore()} />
      <button data-testid='clearError' onClick={() => ctx.clearError()} />
    </div>
  );
};

describe('SubscriptionProvider', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders children', () => {
    render(
      <SubscriptionProvider apiKey=''>
        <div data-testid='child'>Child Content</div>
      </SubscriptionProvider>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('provides initial state with no loading, no error, no subscription', () => {
    render(
      <SubscriptionProvider apiKey=''>
        <TestConsumer />
      </SubscriptionProvider>
    );

    expect(screen.getByTestId('loading')).toHaveTextContent('false');
    expect(screen.getByTestId('error')).toHaveTextContent('none');
    expect(screen.getByTestId('products')).toHaveTextContent('0 products');
    expect(screen.getByTestId('subscription')).toHaveTextContent('none');
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

  it('initializes in development mode (no real API key)', async () => {
    const onError = vi.fn();
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(
      <SubscriptionProvider apiKey='' onError={onError}>
        <TestConsumer />
      </SubscriptionProvider>
    );

    await act(async () => {
      fireEvent.click(screen.getByTestId('initialize'));
    });

    expect(screen.getByTestId('loading')).toHaveTextContent('false');
    expect(screen.getByTestId('error')).toHaveTextContent('none');
    expect(onError).not.toHaveBeenCalled();
    warn.mockRestore();
  });

  it('purchase flow sets active subscription in dev mode', async () => {
    const onPurchaseSuccess = vi.fn();
    render(
      <SubscriptionProvider apiKey='' onPurchaseSuccess={onPurchaseSuccess}>
        <TestConsumer />
      </SubscriptionProvider>
    );

    await act(async () => {
      fireEvent.click(screen.getByTestId('purchase'));
    });

    // Advance past the 2000ms simulated delay
    await act(async () => {
      await vi.advanceTimersByTimeAsync(2100);
    });

    expect(screen.getByTestId('subscription')).toHaveTextContent('active');
    expect(onPurchaseSuccess).toHaveBeenCalledWith('test_product');
  });

  it('restore flow sets error "No previous purchases found" in dev mode', async () => {
    render(
      <SubscriptionProvider apiKey=''>
        <TestConsumer />
      </SubscriptionProvider>
    );

    await act(async () => {
      fireEvent.click(screen.getByTestId('restore'));
    });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1100);
    });

    expect(screen.getByTestId('error')).toHaveTextContent(
      'No previous purchases found'
    );
  });

  it('clearError resets error to null', async () => {
    render(
      <SubscriptionProvider apiKey=''>
        <TestConsumer />
      </SubscriptionProvider>
    );

    await act(async () => {
      fireEvent.click(screen.getByTestId('restore'));
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1100);
    });

    expect(screen.getByTestId('error')).toHaveTextContent(
      'No previous purchases found'
    );

    await act(async () => {
      fireEvent.click(screen.getByTestId('clearError'));
    });

    expect(screen.getByTestId('error')).toHaveTextContent('none');
  });

  it('initialize only runs once (idempotent)', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(
      <SubscriptionProvider apiKey=''>
        <TestConsumer />
      </SubscriptionProvider>
    );

    await act(async () => {
      fireEvent.click(screen.getByTestId('initialize'));
    });

    warn.mockClear();

    // Second call should be a no-op (isInitialized is true)
    await act(async () => {
      fireEvent.click(screen.getByTestId('initialize'));
    });

    expect(warn).not.toHaveBeenCalled();
    warn.mockRestore();
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
