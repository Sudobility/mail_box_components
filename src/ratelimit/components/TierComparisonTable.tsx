import React from 'react';
import { cn } from '../lib/cn';
import type { TierComparisonTableProps } from '../types';

// =============================================================================
// Default Labels
// =============================================================================

const defaultLabels = {
  title: 'Plan Comparison',
  tierHeader: 'Plan',
  hourlyHeader: 'Hourly',
  dailyHeader: 'Daily',
  monthlyHeader: 'Monthly',
  unlimitedLabel: 'Unlimited',
  currentTierBadge: 'Current',
};

// =============================================================================
// Helper Functions
// =============================================================================

function defaultFormatNumber(n: number): string {
  return n.toLocaleString();
}

// =============================================================================
// TierComparisonTable Component
// =============================================================================

export const TierComparisonTable: React.FC<TierComparisonTableProps> = ({
  tiers,
  labels: customLabels,
  onTierSelect,
  className,
  formatNumber = defaultFormatNumber,
  onTrack,
  trackingLabel,
  componentName = 'TierComparisonTable',
}) => {
  const labels = { ...defaultLabels, ...customLabels };

  const handleTierSelect = (tierId: string) => {
    onTrack?.({ action: 'tier_select', trackingLabel, componentName });
    onTierSelect?.(tierId);
  };

  const formatLimit = (limit: number | null): string => {
    if (limit === null)
      return labels.unlimitedLabel ?? defaultLabels.unlimitedLabel;
    return formatNumber(limit);
  };

  const renderLimitCell = (limit: number | null): React.ReactNode => {
    const isUnlimited = limit === null;
    return (
      <span
        className={cn(
          'text-sm',
          isUnlimited ? 'font-medium text-success' : 'text-muted-foreground'
        )}
      >
        {formatLimit(limit)}
      </span>
    );
  };

  return (
    <div className={cn('rounded-lg border border-border bg-card', className)}>
      {/* Title */}
      {labels.title && (
        <div className='border-b border-border px-6 py-4 '>
          <h3 className='text-lg font-semibold text-foreground'>
            {labels.title}
          </h3>
        </div>
      )}

      {/* Table */}
      <div className='overflow-x-auto'>
        <table className='w-full'>
          <thead>
            <tr className='border-b border-border bg-muted'>
              <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground'>
                {labels.tierHeader}
              </th>
              <th className='px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground'>
                {labels.hourlyHeader}
              </th>
              <th className='px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground'>
                {labels.dailyHeader}
              </th>
              <th className='px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground'>
                {labels.monthlyHeader}
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-border'>
            {tiers.map(tier => (
              <tr
                key={tier.id}
                onClick={() => handleTierSelect(tier.id)}
                className={cn(
                  'transition-colors',
                  tier.isHighlighted && 'bg-primary/10',
                  tier.isCurrent && 'bg-success/10',
                  onTierSelect && 'cursor-pointer hover:bg-muted'
                )}
              >
                {/* Tier Name */}
                <td className='whitespace-nowrap px-6 py-4'>
                  <div className='flex items-center gap-2'>
                    <span
                      className={cn(
                        'text-sm font-medium',
                        tier.isCurrent
                          ? 'text-success'
                          : tier.isHighlighted
                            ? 'text-primary'
                            : 'text-foreground'
                      )}
                    >
                      {tier.name}
                    </span>
                    {tier.isCurrent && (
                      <span className='inline-flex items-center rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success'>
                        {labels.currentTierBadge}
                      </span>
                    )}
                  </div>
                </td>

                {/* Hourly Limit */}
                <td className='whitespace-nowrap px-6 py-4 text-right'>
                  {renderLimitCell(tier.hourlyLimit)}
                </td>

                {/* Daily Limit */}
                <td className='whitespace-nowrap px-6 py-4 text-right'>
                  {renderLimitCell(tier.dailyLimit)}
                </td>

                {/* Monthly Limit */}
                <td className='whitespace-nowrap px-6 py-4 text-right'>
                  {renderLimitCell(tier.monthlyLimit)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TierComparisonTable;
