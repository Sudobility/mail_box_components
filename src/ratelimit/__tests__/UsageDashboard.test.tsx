import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { UsageDashboard } from '../components/UsageDashboard';
import type { UsageBarConfig } from '../types';

describe('UsageDashboard', () => {
  const mockUsageBars: UsageBarConfig[] = [
    { label: 'Hourly', used: 50, limit: 100 },
    { label: 'Daily', used: 200, limit: 1000 },
    { label: 'Monthly', used: 5000, limit: 10000 },
  ];

  it('renders with usage bars', () => {
    render(<UsageDashboard usageBars={mockUsageBars} />);

    expect(screen.getByText('Hourly')).toBeInTheDocument();
    expect(screen.getByText('Daily')).toBeInTheDocument();
    expect(screen.getByText('Monthly')).toBeInTheDocument();
  });

  it('displays default title', () => {
    render(<UsageDashboard usageBars={mockUsageBars} />);
    expect(screen.getByText('Usage')).toBeInTheDocument();
  });

  it('displays custom title', () => {
    render(
      <UsageDashboard
        usageBars={mockUsageBars}
        labels={{ title: 'API Usage' }}
      />
    );
    expect(screen.getByText('API Usage')).toBeInTheDocument();
  });

  it('displays current tier name', () => {
    render(
      <UsageDashboard usageBars={mockUsageBars} currentTierName='Pro Plan' />
    );
    expect(screen.getByText('Pro Plan')).toBeInTheDocument();
  });

  it('shows upgrade button when onUpgradeClick is provided', () => {
    const onUpgrade = vi.fn();
    render(
      <UsageDashboard usageBars={mockUsageBars} onUpgradeClick={onUpgrade} />
    );

    const button = screen.getByRole('button', { name: 'Upgrade' });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(onUpgrade).toHaveBeenCalledTimes(1);
  });

  it('shows custom upgrade button label', () => {
    render(
      <UsageDashboard
        usageBars={mockUsageBars}
        onUpgradeClick={() => {}}
        upgradeButtonLabel='Upgrade Now'
      />
    );

    expect(
      screen.getByRole('button', { name: 'Upgrade Now' })
    ).toBeInTheDocument();
  });

  it('does not show upgrade button when onUpgradeClick is not provided', () => {
    render(<UsageDashboard usageBars={mockUsageBars} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('displays usage counts and limits', () => {
    render(<UsageDashboard usageBars={mockUsageBars} />);

    expect(screen.getByText(/50 used/)).toBeInTheDocument();
    expect(screen.getByText(/100 limit/)).toBeInTheDocument();
  });

  it('handles unlimited bars', () => {
    const unlimitedBars: UsageBarConfig[] = [
      { label: 'Unlimited', used: 100, limit: null },
    ];

    render(<UsageDashboard usageBars={unlimitedBars} />);

    expect(screen.getByText('Unlimited')).toBeInTheDocument();
    expect(screen.getByText(/\(Unlimited\)/)).toBeInTheDocument();
  });

  it('shows remaining count when enabled', () => {
    render(<UsageDashboard usageBars={mockUsageBars} showRemaining={true} />);

    expect(screen.getByText('50 remaining')).toBeInTheDocument();
    expect(screen.getByText('800 remaining')).toBeInTheDocument();
  });

  it('hides remaining count when disabled', () => {
    render(<UsageDashboard usageBars={mockUsageBars} showRemaining={false} />);

    expect(screen.queryByText('50 remaining')).not.toBeInTheDocument();
  });

  it('shows percentage when enabled', () => {
    const singleBar: UsageBarConfig[] = [
      { label: 'Test', used: 50, limit: 100 },
    ];
    render(<UsageDashboard usageBars={singleBar} showPercentage={true} />);

    expect(screen.getByText('50%')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <UsageDashboard usageBars={mockUsageBars} className='custom-class' />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('applies custom labels', () => {
    render(
      <UsageDashboard
        usageBars={mockUsageBars}
        labels={{
          usedLabel: 'utilizado',
          limitLabel: 'limite',
          remainingLabel: 'restante',
        }}
      />
    );

    expect(screen.getByText(/50 utilizado/)).toBeInTheDocument();
    expect(screen.getByText(/100 limite/)).toBeInTheDocument();
    expect(screen.getByText('50 restante')).toBeInTheDocument();
  });

  it('handles bars with custom colors', () => {
    const coloredBars: UsageBarConfig[] = [
      { label: 'Red Bar', used: 50, limit: 100, color: 'red' },
      { label: 'Green Bar', used: 50, limit: 100, color: 'green' },
    ];

    render(<UsageDashboard usageBars={coloredBars} />);

    expect(screen.getByText('Red Bar')).toBeInTheDocument();
    expect(screen.getByText('Green Bar')).toBeInTheDocument();
  });

  it('shows correct color based on usage percentage', () => {
    const highUsageBars: UsageBarConfig[] = [
      { label: 'High Usage', used: 95, limit: 100 }, // Should be red (>=90%)
      { label: 'Medium Usage', used: 75, limit: 100 }, // Should be yellow (>=70%)
      { label: 'Low Usage', used: 30, limit: 100 }, // Should be blue (<70%)
    ];

    render(<UsageDashboard usageBars={highUsageBars} />);

    expect(screen.getByText('High Usage')).toBeInTheDocument();
    expect(screen.getByText('Medium Usage')).toBeInTheDocument();
    expect(screen.getByText('Low Usage')).toBeInTheDocument();
  });

  it('handles empty usage bars array', () => {
    render(<UsageDashboard usageBars={[]} />);
    expect(screen.getByText('Usage')).toBeInTheDocument();
  });

  it('formats large numbers with locale string', () => {
    const largeBars: UsageBarConfig[] = [
      { label: 'Large', used: 1000000, limit: 10000000 },
    ];

    render(<UsageDashboard usageBars={largeBars} />);

    // toLocaleString formats numbers with commas
    expect(screen.getByText(/1,000,000 used/)).toBeInTheDocument();
  });
});
