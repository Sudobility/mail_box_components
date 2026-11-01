import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SubscriptionLayout } from '../subscription-layout';

// Mock @sudobility/design
vi.mock('@sudobility/design', () => ({
  textVariants: {
    heading: {
      h3: () => 'text-lg font-semibold',
      h4: () => 'text-md font-semibold',
    },
  },
}));

// Mock @sudobility/components
vi.mock('@sudobility/components', () => ({
  Button: ({
    children,
    onClick,
    disabled,
    variant,
    className,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    variant?: string;
    className?: string;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      data-variant={variant}
      className={className}
      type='button'
    >
      {children}
    </button>
  ),
  Card: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div className={className} data-testid='card'>
      {children}
    </div>
  ),
  CardContent: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div className={className} data-testid='card-content'>
      {children}
    </div>
  ),
}));

describe('SubscriptionLayout', () => {
  const defaultProps = {
    title: 'Choose Your Plan',
    primaryAction: {
      label: 'Subscribe Now',
      onClick: vi.fn(),
    },
    children: <div data-testid='child-content'>Child Content</div>,
  };

  it('renders with basic props', () => {
    render(<SubscriptionLayout {...defaultProps} />);

    // The `title` prop is accepted for API compatibility but is no longer
    // rendered as a heading (the subscription surface shows no title).
    expect(screen.queryByText('Choose Your Plan')).not.toBeInTheDocument();
    expect(screen.getByText('Subscribe Now')).toBeInTheDocument();
    expect(screen.getByTestId('child-content')).toBeInTheDocument();
  });

  it('calls primaryAction onClick when button is clicked', () => {
    const onClick = vi.fn();
    render(
      <SubscriptionLayout
        {...defaultProps}
        primaryAction={{ label: 'Subscribe', onClick }}
      />
    );

    fireEvent.click(screen.getByText('Subscribe'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders secondary action when provided', () => {
    const secondaryOnClick = vi.fn();
    render(
      <SubscriptionLayout
        {...defaultProps}
        secondaryAction={{
          label: 'Restore Purchase',
          onClick: secondaryOnClick,
        }}
      />
    );

    expect(screen.getByText('Restore Purchase')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Restore Purchase'));
    expect(secondaryOnClick).toHaveBeenCalledTimes(1);
  });

  it('disables buttons when disabled prop is true', () => {
    render(
      <SubscriptionLayout
        {...defaultProps}
        primaryAction={{ label: 'Subscribe', onClick: vi.fn(), disabled: true }}
        secondaryAction={{ label: 'Restore', onClick: vi.fn(), disabled: true }}
      />
    );

    expect(screen.getByText('Subscribe')).toBeDisabled();
    expect(screen.getByText('Restore')).toBeDisabled();
  });

  it('displays error message when error prop is provided', () => {
    render(<SubscriptionLayout {...defaultProps} error='An error occurred' />);

    expect(screen.getByText('An error occurred')).toBeInTheDocument();
  });

  it('renders active subscription status', () => {
    render(
      <SubscriptionLayout
        {...defaultProps}
        currentStatus={{
          isActive: true,
          activeContent: {
            title: 'Active Subscription',
            fields: [
              { label: 'Plan', value: 'Annual' },
              { label: 'Expires', value: 'Dec 31, 2025' },
            ],
          },
        }}
      />
    );

    expect(screen.getByText('Current Status')).toBeInTheDocument();
    expect(screen.getByText('Active Subscription')).toBeInTheDocument();
    expect(screen.getByText('Plan')).toBeInTheDocument();
    expect(screen.getByText('Annual')).toBeInTheDocument();
    expect(screen.getByText('Expires')).toBeInTheDocument();
    expect(screen.getByText('Dec 31, 2025')).toBeInTheDocument();
  });

  it('renders inactive subscription status', () => {
    render(
      <SubscriptionLayout
        {...defaultProps}
        currentStatus={{
          isActive: false,
          inactiveContent: {
            title: 'No Active Subscription',
            message: 'Subscribe to unlock premium features',
          },
        }}
      />
    );

    expect(screen.getByText('No Active Subscription')).toBeInTheDocument();
    expect(
      screen.getByText('Subscribe to unlock premium features')
    ).toBeInTheDocument();
  });

  it('uses custom currentStatusLabel', () => {
    render(
      <SubscriptionLayout
        {...defaultProps}
        currentStatus={{ isActive: false }}
        currentStatusLabel='Status'
      />
    );

    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  it('renders header content when provided', () => {
    render(
      <SubscriptionLayout
        {...defaultProps}
        headerContent={<div data-testid='header'>Header Content</div>}
      />
    );

    expect(screen.getByTestId('header')).toBeInTheDocument();
  });

  it('renders footer content when provided', () => {
    render(
      <SubscriptionLayout
        {...defaultProps}
        footerContent={<div data-testid='footer'>Footer Content</div>}
      />
    );

    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  describe('Free Tile', () => {
    const freeTileConfig = {
      title: 'Free',
      price: '$0',
      periodLabel: '/month',
      features: ['Basic feature 1', 'Basic feature 2'],
      ctaButton: {
        label: 'Get Started',
        onClick: vi.fn(),
      },
    };

    it('renders free tile when variant is cta and freeTileConfig is provided', () => {
      render(
        <SubscriptionLayout
          {...defaultProps}
          variant='cta'
          primaryAction={undefined}
          freeTileConfig={freeTileConfig}
        />
      );

      expect(screen.getByText('Free')).toBeInTheDocument();
      expect(screen.getByText('$0')).toBeInTheDocument();
      expect(screen.getByText('/month')).toBeInTheDocument();
      expect(screen.getByText('Basic feature 1')).toBeInTheDocument();
      expect(screen.getByText('Basic feature 2')).toBeInTheDocument();
      expect(screen.getByText('Get Started')).toBeInTheDocument();
    });

    it('does not render free tile when variant is selection even with freeTileConfig', () => {
      render(
        <SubscriptionLayout
          {...defaultProps}
          variant='selection'
          freeTileConfig={freeTileConfig}
        />
      );

      expect(screen.queryByText('Get Started')).not.toBeInTheDocument();
    });

    it('does not render free tile when freeTileConfig is not provided', () => {
      render(
        <SubscriptionLayout
          {...defaultProps}
          variant='cta'
          primaryAction={undefined}
        />
      );

      expect(screen.queryByText('Get Started')).not.toBeInTheDocument();
    });

    it('calls freeTileConfig ctaButton onClick when button is clicked', () => {
      const onClick = vi.fn();
      render(
        <SubscriptionLayout
          {...defaultProps}
          variant='cta'
          primaryAction={undefined}
          freeTileConfig={{
            ...freeTileConfig,
            ctaButton: { label: 'Get Started', onClick },
          }}
        />
      );

      fireEvent.click(screen.getByText('Get Started'));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('renders free tile with topBadge when provided', () => {
      render(
        <SubscriptionLayout
          {...defaultProps}
          variant='cta'
          primaryAction={undefined}
          freeTileConfig={{
            ...freeTileConfig,
            topBadge: { text: 'Popular', color: 'purple' },
          }}
        />
      );

      expect(screen.getByText('Popular')).toBeInTheDocument();
    });
  });
});
