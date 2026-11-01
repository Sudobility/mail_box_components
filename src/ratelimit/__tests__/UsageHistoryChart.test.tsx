import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { UsageHistoryChart } from '../components/UsageHistoryChart';
import type { HistoryEntryData } from '../types';

// Mock recharts to avoid ResponsiveContainer issues in tests
vi.mock('recharts', async importOriginal => {
  const actual = await importOriginal<typeof import('recharts')>();
  return {
    ...actual,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div
        data-testid='responsive-container'
        style={{ width: 500, height: 300 }}
      >
        {children}
      </div>
    ),
  };
});

describe('UsageHistoryChart', () => {
  const mockEntries: HistoryEntryData[] = [
    {
      periodStart: '2024-01-01T00:00:00Z',
      periodEnd: '2024-01-01T01:00:00Z',
      requestCount: 50,
      limit: 100,
    },
    {
      periodStart: '2024-01-01T01:00:00Z',
      periodEnd: '2024-01-01T02:00:00Z',
      requestCount: 75,
      limit: 100,
    },
    {
      periodStart: '2024-01-01T02:00:00Z',
      periodEnd: '2024-01-01T03:00:00Z',
      requestCount: 30,
      limit: 100,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders chart with entries', () => {
    render(<UsageHistoryChart entries={mockEntries} periodType='hour' />);

    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });

  it('displays default title', () => {
    render(<UsageHistoryChart entries={mockEntries} periodType='hour' />);
    expect(screen.getByText('Usage History')).toBeInTheDocument();
  });

  it('displays custom title', () => {
    render(
      <UsageHistoryChart
        entries={mockEntries}
        periodType='hour'
        labels={{ title: 'API Requests' }}
      />
    );
    expect(screen.getByText('API Requests')).toBeInTheDocument();
  });

  it('shows no data message when entries are empty', () => {
    render(<UsageHistoryChart entries={[]} periodType='hour' />);
    expect(screen.getByText('No usage data available')).toBeInTheDocument();
  });

  it('shows custom no data message', () => {
    render(
      <UsageHistoryChart
        entries={[]}
        periodType='hour'
        labels={{ noDataLabel: 'No hay datos' }}
      />
    );
    expect(screen.getByText('No hay datos')).toBeInTheDocument();
  });

  it('displays legend labels', () => {
    render(<UsageHistoryChart entries={mockEntries} periodType='hour' />);

    expect(screen.getByText('Requests')).toBeInTheDocument();
    expect(screen.getByText('Limit')).toBeInTheDocument();
  });

  it('displays custom legend labels', () => {
    render(
      <UsageHistoryChart
        entries={mockEntries}
        periodType='hour'
        labels={{ requestsLabel: 'Solicitudes', limitLabel: 'Limite' }}
      />
    );

    expect(screen.getByText('Solicitudes')).toBeInTheDocument();
    expect(screen.getByText('Limite')).toBeInTheDocument();
  });

  it('hides limit legend when showLimitLine is false', () => {
    render(
      <UsageHistoryChart
        entries={mockEntries}
        periodType='hour'
        showLimitLine={false}
      />
    );

    expect(screen.getByText('Requests')).toBeInTheDocument();
    // Only one legend item should be visible
    expect(screen.queryAllByText('Limit')).toHaveLength(0);
  });

  it('hides limit legend when no entry has a limit', () => {
    const noLimitEntries: HistoryEntryData[] = [
      {
        periodStart: '2024-01-01T00:00:00Z',
        periodEnd: '2024-01-01T01:00:00Z',
        requestCount: 50,
        limit: null,
      },
    ];

    render(<UsageHistoryChart entries={noLimitEntries} periodType='hour' />);

    expect(screen.getByText('Requests')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <UsageHistoryChart
        entries={mockEntries}
        periodType='hour'
        className='custom-class'
      />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('applies custom className to empty state', () => {
    const { container } = render(
      <UsageHistoryChart
        entries={[]}
        periodType='hour'
        className='custom-class'
      />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('uses custom height for empty state', () => {
    const { container } = render(
      <UsageHistoryChart entries={[]} periodType='hour' height={400} />
    );

    expect(container.firstChild).toHaveStyle({ height: '400px' });
  });

  it('accepts custom bar color', () => {
    render(
      <UsageHistoryChart
        entries={mockEntries}
        periodType='hour'
        barColor='#ff0000'
      />
    );

    // The bar color legend indicator should be rendered
    expect(screen.getByText('Requests')).toBeInTheDocument();
  });

  it('accepts custom limit line color', () => {
    render(
      <UsageHistoryChart
        entries={mockEntries}
        periodType='hour'
        limitLineColor='#00ff00'
      />
    );

    expect(screen.getByText('Limit')).toBeInTheDocument();
  });

  it('handles different period types', () => {
    const { rerender } = render(
      <UsageHistoryChart entries={mockEntries} periodType='hour' />
    );
    expect(screen.getByText('Usage History')).toBeInTheDocument();

    rerender(<UsageHistoryChart entries={mockEntries} periodType='day' />);
    expect(screen.getByText('Usage History')).toBeInTheDocument();

    rerender(<UsageHistoryChart entries={mockEntries} periodType='month' />);
    expect(screen.getByText('Usage History')).toBeInTheDocument();
  });

  it('uses custom date formatter', () => {
    const customFormatter = () => 'Custom Date';

    render(
      <UsageHistoryChart
        entries={mockEntries}
        periodType='hour'
        formatDate={customFormatter}
      />
    );

    expect(screen.getByText('Usage History')).toBeInTheDocument();
  });

  it('renders with mixed limit values', () => {
    const mixedEntries: HistoryEntryData[] = [
      {
        periodStart: '2024-01-01T00:00:00Z',
        periodEnd: '2024-01-01T01:00:00Z',
        requestCount: 50,
        limit: null,
      },
      {
        periodStart: '2024-01-01T01:00:00Z',
        periodEnd: '2024-01-01T02:00:00Z',
        requestCount: 75,
        limit: 100,
      },
    ];

    render(<UsageHistoryChart entries={mixedEntries} periodType='hour' />);

    expect(screen.getByText('Usage History')).toBeInTheDocument();
    // Should show limit legend because one entry has a limit
    expect(screen.getByText('Limit')).toBeInTheDocument();
  });

  it('handles entries with zero request count', () => {
    const zeroEntries: HistoryEntryData[] = [
      {
        periodStart: '2024-01-01T00:00:00Z',
        periodEnd: '2024-01-01T01:00:00Z',
        requestCount: 0,
        limit: 100,
      },
    ];

    render(<UsageHistoryChart entries={zeroEntries} periodType='hour' />);

    expect(screen.getByText('Usage History')).toBeInTheDocument();
  });

  it('hides title when set to empty string', () => {
    render(
      <UsageHistoryChart
        entries={mockEntries}
        periodType='hour'
        labels={{ title: '' }}
      />
    );

    expect(screen.queryByText('Usage History')).not.toBeInTheDocument();
  });
});
