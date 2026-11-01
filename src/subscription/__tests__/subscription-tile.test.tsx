import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SubscriptionTile } from '../subscription-tile';

// Mock @sudobility/design
vi.mock('@sudobility/design', () => ({
  textVariants: {
    heading: {
      h4: () => 'text-xl font-semibold',
    },
  },
}));

describe('SubscriptionTile', () => {
  const defaultProps = {
    id: 'test-plan',
    title: 'Test Plan',
    price: '$9.99',
    features: ['Feature 1', 'Feature 2'],
    isSelected: false,
    onSelect: vi.fn(),
  };

  it('renders with basic props', () => {
    render(<SubscriptionTile {...defaultProps} />);

    expect(screen.getByText('Test Plan')).toBeInTheDocument();
    expect(screen.getByText('$9.99')).toBeInTheDocument();
    expect(screen.getByText('Feature 1')).toBeInTheDocument();
    expect(screen.getByText('Feature 2')).toBeInTheDocument();
  });

  it('renders with period label', () => {
    render(<SubscriptionTile {...defaultProps} periodLabel='/month' />);

    expect(screen.getByText('/month')).toBeInTheDocument();
  });

  it('calls onSelect when clicked', () => {
    const onSelect = vi.fn();
    render(<SubscriptionTile {...defaultProps} onSelect={onSelect} />);

    fireEvent.click(screen.getByRole('radio'));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('does not call onSelect when disabled', () => {
    const onSelect = vi.fn();
    render(<SubscriptionTile {...defaultProps} onSelect={onSelect} disabled />);

    fireEvent.click(screen.getByRole('radio'));
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('renders top badge when provided', () => {
    render(
      <SubscriptionTile
        {...defaultProps}
        topBadge={{ text: 'Best Value', color: 'purple' }}
      />
    );

    expect(screen.getByText('Best Value')).toBeInTheDocument();
  });

  it('renders discount badge when provided', () => {
    render(
      <SubscriptionTile
        {...defaultProps}
        discountBadge={{ text: 'Save 40%', isBestValue: true }}
      />
    );

    expect(screen.getByText('Save 40%')).toBeInTheDocument();
  });

  it('renders premium callout when provided', () => {
    render(
      <SubscriptionTile
        {...defaultProps}
        premiumCallout={{
          title: 'Premium Features',
          features: ['Premium Feature 1', 'Premium Feature 2'],
        }}
      />
    );

    expect(screen.getByText('Premium Features')).toBeInTheDocument();
    expect(screen.getByText('• Premium Feature 1')).toBeInTheDocument();
    expect(screen.getByText('• Premium Feature 2')).toBeInTheDocument();
  });

  it('renders bottom note when provided', () => {
    render(
      <SubscriptionTile {...defaultProps} bottomNote='Expires Dec 31, 2025' />
    );

    expect(screen.getByText('Expires Dec 31, 2025')).toBeInTheDocument();
  });

  it('renders intro price note when provided', () => {
    render(
      <SubscriptionTile
        {...defaultProps}
        introPriceNote='$4.99 for first 3 months'
      />
    );

    expect(screen.getByText('$4.99 for first 3 months')).toBeInTheDocument();
  });

  it('renders custom children content', () => {
    render(
      <SubscriptionTile {...defaultProps}>
        <div data-testid='custom-content'>Custom Content</div>
      </SubscriptionTile>
    );

    expect(screen.getByTestId('custom-content')).toBeInTheDocument();
  });

  it('applies selected styles when isSelected is true', () => {
    const { container } = render(
      <SubscriptionTile {...defaultProps} isSelected />
    );

    // Selected tiles have primary background with border
    expect(container.firstChild).toHaveClass('bg-primary');
    expect(container.firstChild).toHaveClass('border-primary');
  });

  it('applies unselected styles when isSelected is false', () => {
    const { container } = render(
      <SubscriptionTile {...defaultProps} isSelected={false} />
    );

    // Unselected tiles have muted background
    expect(container.firstChild).toHaveClass('bg-muted');
    expect(container.firstChild).not.toHaveClass('ring-4');
  });

  it('handles keyboard navigation', () => {
    const onSelect = vi.fn();
    render(<SubscriptionTile {...defaultProps} onSelect={onSelect} />);

    const tile = screen.getByRole('radio');
    fireEvent.keyDown(tile, { key: 'Enter' });
    expect(onSelect).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(tile, { key: ' ' });
    expect(onSelect).toHaveBeenCalledTimes(2);
  });

  it('has correct accessibility attributes', () => {
    render(<SubscriptionTile {...defaultProps} isSelected />);

    const tile = screen.getByRole('radio');
    expect(tile).toHaveAttribute('aria-checked', 'true');
    expect(tile).toHaveAttribute('aria-label', 'Test Plan - $9.99');
  });

  // CTA Button tests (Style 2)
  describe('CTA Button mode', () => {
    it('renders CTA button when ctaButton prop is provided', () => {
      render(
        <SubscriptionTile
          {...defaultProps}
          ctaButton={{ label: 'Get Started', onClick: vi.fn() }}
        />
      );

      expect(
        screen.getByRole('button', { name: 'Get Started' })
      ).toBeInTheDocument();
    });

    it('renders CTA link when ctaButton.href is provided', () => {
      render(
        <SubscriptionTile
          {...defaultProps}
          ctaButton={{ label: 'Get Started', href: '/subscribe' }}
        />
      );

      const link = screen.getByRole('link', { name: 'Get Started' });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/subscribe');
    });

    it('calls ctaButton.onClick when CTA button is clicked', () => {
      const onClick = vi.fn();
      render(
        <SubscriptionTile
          {...defaultProps}
          ctaButton={{ label: 'Get Started', onClick }}
        />
      );

      fireEvent.click(screen.getByRole('button', { name: 'Get Started' }));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onSelect when tile is clicked in CTA mode', () => {
      const onSelect = vi.fn();
      render(
        <SubscriptionTile
          {...defaultProps}
          onSelect={onSelect}
          ctaButton={{ label: 'Get Started', onClick: vi.fn() }}
        />
      );

      fireEvent.click(screen.getByRole('article'));
      expect(onSelect).not.toHaveBeenCalled();
    });

    it('uses article role instead of radio in CTA mode', () => {
      render(
        <SubscriptionTile
          {...defaultProps}
          ctaButton={{ label: 'Get Started', onClick: vi.fn() }}
        />
      );

      expect(screen.queryByRole('radio')).not.toBeInTheDocument();
      expect(screen.getByRole('article')).toBeInTheDocument();
    });

    it('applies correct button styles for selected tile', () => {
      render(
        <SubscriptionTile
          {...defaultProps}
          isSelected
          ctaButton={{ label: 'Get Started', onClick: vi.fn() }}
        />
      );

      const button = screen.getByRole('button', { name: 'Get Started' });
      expect(button).toHaveClass('bg-background');
      expect(button).toHaveClass('text-primary');
    });

    it('applies correct button styles for unselected tile', () => {
      render(
        <SubscriptionTile
          {...defaultProps}
          isSelected={false}
          ctaButton={{ label: 'Get Started', onClick: vi.fn() }}
        />
      );

      const button = screen.getByRole('button', { name: 'Get Started' });
      expect(button).toHaveClass('bg-primary');
      expect(button).toHaveClass('text-primary-foreground');
    });
  });
});
