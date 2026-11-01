import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';
import { cn } from '../lib/cn';
import { colors, ui, textVariants } from '@sudobility/design';
import type { UsageHistoryChartProps, PeriodType } from '../types';

// =============================================================================
// Default Labels
// =============================================================================

const defaultLabels = {
  title: 'Usage History',
  requestsLabel: 'Requests',
  limitLabel: 'Limit',
  periodLabel: 'Period',
  noDataLabel: 'No usage data available',
};

// =============================================================================
// Helper Functions
// =============================================================================

function defaultFormatDate(dateString: string, periodType: PeriodType): string {
  const date = new Date(dateString);

  switch (periodType) {
    case 'hour':
      return date.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
      });
    case 'day':
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      });
    case 'month':
      return date.toLocaleDateString(undefined, {
        month: 'short',
        year: 'numeric',
      });
    default:
      return dateString;
  }
}

// =============================================================================
// Custom Tooltip Component
// =============================================================================

interface TooltipPayload {
  value: number;
  name: string;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
  labels: typeof defaultLabels;
  limit: number | null;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
  labels,
  limit,
}) => {
  if (!active || !payload || payload.length === 0) return null;

  const value = payload[0].value;

  return (
    <div
      className={cn(
        'rounded-lg border p-3 shadow-lg',
        colors.component.card.default.base,
        colors.component.card.default.dark
      )}
    >
      <p className={cn('mb-1 text-sm', ui.text.emphasis)}>{label}</p>
      <p className={cn('text-sm', ui.text.bodySmall)}>
        {labels.requestsLabel}:{' '}
        <span className='font-medium'>{value.toLocaleString()}</span>
      </p>
      {limit !== null && (
        <p className={cn('text-sm', ui.text.bodySmall)}>
          {labels.limitLabel}:{' '}
          <span className='font-medium'>{limit.toLocaleString()}</span>
        </p>
      )}
    </div>
  );
};

// =============================================================================
// UsageHistoryChart Component
// =============================================================================

export const UsageHistoryChart: React.FC<UsageHistoryChartProps> = ({
  entries,
  periodType,
  labels: customLabels,
  height = 300,
  className,
  formatDate = defaultFormatDate,
  barColor = colors.raw.blue[500],
  limitLineColor = colors.raw.red[500],
  showLimitLine = true,
}) => {
  const labels = { ...defaultLabels, ...customLabels };

  // Transform entries for recharts
  const chartData = useMemo(() => {
    return entries.map(entry => ({
      name: formatDate(entry.periodStart, periodType),
      requests: entry.requestCount,
      limit: entry.limit,
    }));
  }, [entries, formatDate, periodType]);

  // Get the limit value (assuming consistent limit across entries)
  const limitValue = useMemo(() => {
    const firstWithLimit = entries.find(e => e.limit !== null);
    return firstWithLimit?.limit ?? null;
  }, [entries]);

  // Calculate Y-axis domain
  const maxValue = useMemo(() => {
    const maxRequests = Math.max(...entries.map(e => e.requestCount), 0);
    const maxLimit = limitValue ?? 0;
    return Math.max(maxRequests, maxLimit) * 1.1; // Add 10% padding
  }, [entries, limitValue]);

  if (entries.length === 0) {
    return (
      <div
        className={cn(
          'flex items-center justify-center rounded-lg border p-6',
          colors.component.card.default.base,
          colors.component.card.default.dark,
          className
        )}
        style={{ height }}
      >
        <p className={ui.text.muted}>{labels.noDataLabel}</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'rounded-lg border p-6',
        colors.component.card.default.base,
        colors.component.card.default.dark,
        className
      )}
    >
      {/* Title */}
      {labels.title && (
        <h3 className={cn(textVariants.heading.h5(), 'mb-4 text-lg')}>
          {labels.title}
        </h3>
      )}

      {/* Chart */}
      <ResponsiveContainer width='100%' height={height}>
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray='3 3' className='stroke-border' />
          <XAxis
            dataKey='name'
            tick={{ fontSize: 12 }}
            className='text-muted-foreground'
          />
          <YAxis
            domain={[0, maxValue]}
            tick={{ fontSize: 12 }}
            className='text-muted-foreground'
            tickFormatter={value => value.toLocaleString()}
          />
          <Tooltip
            content={<CustomTooltip labels={labels} limit={limitValue} />}
          />
          <Line
            type='monotone'
            dataKey='requests'
            stroke={barColor}
            strokeWidth={2}
            dot={{ fill: barColor, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, strokeWidth: 2 }}
            name={labels.requestsLabel}
          />
          {showLimitLine && limitValue !== null && (
            <ReferenceLine
              y={limitValue}
              stroke={limitLineColor}
              strokeDasharray='5 5'
              strokeWidth={2}
              label={{
                value: labels.limitLabel,
                position: 'right',
                fill: limitLineColor,
                fontSize: 12,
              }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className='mt-4 flex items-center justify-center gap-6'>
        <div className='flex items-center gap-2'>
          <div
            className='h-0.5 w-4 rounded'
            style={{ backgroundColor: barColor }}
          />
          <span className={cn('text-sm', ui.text.bodySmall)}>
            {labels.requestsLabel}
          </span>
        </div>
        {showLimitLine && limitValue !== null && (
          <div className='flex items-center gap-2'>
            <div
              className='h-0.5 w-4'
              style={{
                backgroundColor: limitLineColor,
                borderStyle: 'dashed',
              }}
            />
            <span className={cn('text-sm', ui.text.bodySmall)}>
              {labels.limitLabel}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsageHistoryChart;
