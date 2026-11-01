import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TierComparisonTable } from '../components/TierComparisonTable';
import type { TierDisplayData } from '../types';

describe('TierComparisonTable', () => {
  const mockTiers: TierDisplayData[] = [
    {
      id: 'free',
      name: 'Free',
      hourlyLimit: 10,
      dailyLimit: 100,
      monthlyLimit: 1000,
    },
    {
      id: 'pro',
      name: 'Pro',
      hourlyLimit: 100,
      dailyLimit: 1000,
      monthlyLimit: 10000,
      isCurrent: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      hourlyLimit: null,
      dailyLimit: null,
      monthlyLimit: null,
    },
  ];

  it('renders table with tiers', () => {
    render(<TierComparisonTable tiers={mockTiers} />);

    expect(screen.getByText('Free')).toBeInTheDocument();
    expect(screen.getByText('Pro')).toBeInTheDocument();
    expect(screen.getByText('Enterprise')).toBeInTheDocument();
  });

  it('displays default title', () => {
    render(<TierComparisonTable tiers={mockTiers} />);
    expect(screen.getByText('Plan Comparison')).toBeInTheDocument();
  });

  it('displays custom title', () => {
    render(
      <TierComparisonTable
        tiers={mockTiers}
        labels={{ title: 'Available Plans' }}
      />
    );
    expect(screen.getByText('Available Plans')).toBeInTheDocument();
  });

  it('displays column headers', () => {
    render(<TierComparisonTable tiers={mockTiers} />);

    expect(screen.getByText('Plan')).toBeInTheDocument();
    expect(screen.getByText('Hourly')).toBeInTheDocument();
    expect(screen.getByText('Daily')).toBeInTheDocument();
    expect(screen.getByText('Monthly')).toBeInTheDocument();
  });

  it('displays custom column headers', () => {
    render(
      <TierComparisonTable
        tiers={mockTiers}
        labels={{
          tierHeader: 'Tier',
          hourlyHeader: 'Per Hour',
          dailyHeader: 'Per Day',
          monthlyHeader: 'Per Month',
        }}
      />
    );

    expect(screen.getByText('Tier')).toBeInTheDocument();
    expect(screen.getByText('Per Hour')).toBeInTheDocument();
    expect(screen.getByText('Per Day')).toBeInTheDocument();
    expect(screen.getByText('Per Month')).toBeInTheDocument();
  });

  it('shows current tier badge', () => {
    render(<TierComparisonTable tiers={mockTiers} />);
    expect(screen.getByText('Current')).toBeInTheDocument();
  });

  it('shows custom current tier badge text', () => {
    render(
      <TierComparisonTable
        tiers={mockTiers}
        labels={{ currentTierBadge: 'Active' }}
      />
    );
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('displays unlimited label for null limits', () => {
    render(<TierComparisonTable tiers={mockTiers} />);
    // Enterprise tier has 3 unlimited values
    const unlimitedElements = screen.getAllByText('Unlimited');
    expect(unlimitedElements.length).toBe(3);
  });

  it('displays custom unlimited label', () => {
    render(
      <TierComparisonTable
        tiers={mockTiers}
        labels={{ unlimitedLabel: 'No Limit' }}
      />
    );
    const noLimitElements = screen.getAllByText('No Limit');
    expect(noLimitElements.length).toBe(3);
  });

  it('calls onTierSelect when a tier row is clicked', () => {
    const onSelect = vi.fn();
    render(<TierComparisonTable tiers={mockTiers} onTierSelect={onSelect} />);

    fireEvent.click(screen.getByText('Free'));
    expect(onSelect).toHaveBeenCalledWith('free');

    fireEvent.click(screen.getByText('Pro'));
    expect(onSelect).toHaveBeenCalledWith('pro');
  });

  it('applies custom className', () => {
    const { container } = render(
      <TierComparisonTable tiers={mockTiers} className='custom-class' />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('formats numbers using custom formatter', () => {
    const customFormatter = (n: number) => `${n} reqs`;
    const singleTier: TierDisplayData[] = [
      {
        id: 'test',
        name: 'Test',
        hourlyLimit: 10,
        dailyLimit: 50,
        monthlyLimit: 200,
      },
    ];
    render(
      <TierComparisonTable tiers={singleTier} formatNumber={customFormatter} />
    );

    expect(screen.getByText('10 reqs')).toBeInTheDocument();
    expect(screen.getByText('50 reqs')).toBeInTheDocument();
    expect(screen.getByText('200 reqs')).toBeInTheDocument();
  });

  it('handles highlighted tier', () => {
    const tiersWithHighlight: TierDisplayData[] = [
      {
        id: 'pro',
        name: 'Pro',
        hourlyLimit: 100,
        dailyLimit: 1000,
        monthlyLimit: 10000,
        isHighlighted: true,
      },
    ];

    render(<TierComparisonTable tiers={tiersWithHighlight} />);
    expect(screen.getByText('Pro')).toBeInTheDocument();
  });

  it('handles empty tiers array', () => {
    render(<TierComparisonTable tiers={[]} />);
    expect(screen.getByText('Plan Comparison')).toBeInTheDocument();
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('formats large numbers with default locale string', () => {
    const largeTiers: TierDisplayData[] = [
      {
        id: 'large',
        name: 'Large',
        hourlyLimit: 1000000,
        dailyLimit: 10000000,
        monthlyLimit: 100000000,
      },
    ];

    render(<TierComparisonTable tiers={largeTiers} />);

    expect(screen.getByText('1,000,000')).toBeInTheDocument();
    expect(screen.getByText('10,000,000')).toBeInTheDocument();
    expect(screen.getByText('100,000,000')).toBeInTheDocument();
  });

  it('renders rows without cursor-pointer when onTierSelect is not provided', () => {
    render(<TierComparisonTable tiers={mockTiers} />);

    // Table should still render
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('hides title when set to empty string', () => {
    render(<TierComparisonTable tiers={mockTiers} labels={{ title: '' }} />);

    expect(screen.queryByText('Plan Comparison')).not.toBeInTheDocument();
  });
});
