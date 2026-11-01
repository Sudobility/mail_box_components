import React from 'react';
import { cn } from '../index';
import { ui } from '@sudobility/design';

export interface TrendIndicatorProps {
  /** Current value */
  value: number;
  /** Previous value for comparison */
  previousValue: number;
  /** Display format */
  format?: 'percentage' | 'number' | 'currency';
  /** Currency symbol */
  currency?: string;
  /** Show arrow icon */
  showArrow?: boolean;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Additional className */
  className?: string;
}

/**
 * TrendIndicator Component
 *
 * Trend indicator showing increase/decrease.
 * Displays change with color coding and optional arrow.
 *
 * @example
 * ```tsx
 * <TrendIndicator
 *   value={125}
 *   previousValue={100}
 *   format="percentage"
 *   showArrow
 *   size="md"
 * />
 * ```
 *
 * @example
 * ```tsx
 * <TrendIndicator
 *   value={45231}
 *   previousValue={38500}
 *   format="currency"
 *   currency="$"
 * />
 * ```
 */
export const TrendIndicator: React.FC<TrendIndicatorProps> = ({
  value,
  previousValue,
  format = 'percentage',
  currency = '$',
  showArrow = true,
  size = 'md',
  className,
}) => {
  const change = value - previousValue;
  const percentChange =
    previousValue !== 0 ? (change / previousValue) * 100 : 0;
  const isPositive = change >= 0;

  const formatValue = (): string => {
    switch (format) {
      case 'percentage':
        return `${Math.abs(percentChange).toFixed(1)}%`;
      case 'currency':
        return `${currency}${Math.abs(change).toFixed(2)}`;
      case 'number':
        return Math.abs(change).toFixed(0);
      default:
        return '';
    }
  };

  const sizeStyles = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 font-semibold',
        isPositive ? ui.text.success : ui.text.error,
        sizeStyles[size],
        className
      )}
    >
      {showArrow && (
        <svg
          className={cn(iconSizes[size])}
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          {isPositive ? (
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M5 10l7-7m0 0l7 7m-7-7v18'
            />
          ) : (
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M19 14l-7 7m0 0l-7-7m7 7V3'
            />
          )}
        </svg>
      )}
      <span>
        {isPositive ? '+' : '-'}
        {formatValue()}
      </span>
    </div>
  );
};
