import React from 'react';
import { cn } from '../index';
import { colors, textVariants, designTokens } from '@sudobility/design';

export interface PriceDisplayProps {
  /** Price amount */
  amount: number;
  /** Currency code */
  currency?: string;
  /** Original price for comparison */
  originalPrice?: number;
  /** Display size */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Show currency symbol */
  showCurrency?: boolean;
  /** Show decimals */
  showDecimals?: boolean;
  /** Additional className */
  className?: string;
}

/**
 * PriceDisplay Component
 *
 * Formatted price display with currency support.
 * Supports comparison pricing and multiple sizes.
 *
 * @example
 * ```tsx
 * <PriceDisplay
 *   amount={99.99}
 *   originalPrice={149.99}
 *   currency="USD"
 *   size="lg"
 * />
 * ```
 */
export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  amount,
  currency = 'USD',
  originalPrice,
  size = 'md',
  showCurrency = true,
  showDecimals = true,
  className,
}) => {
  const currencySymbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    CAD: 'C$',
    AUD: 'A$',
    CHF: 'CHF',
    CNY: '¥',
    INR: '₹',
  };

  const symbol = currencySymbols[currency] || currency;

  const formatPrice = (price: number): string => {
    if (showDecimals) {
      return price.toFixed(2);
    }
    return Math.round(price).toString();
  };

  const sizeStyles = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-2xl',
    xl: 'text-4xl',
  };

  const discount = originalPrice
    ? Math.round(((originalPrice - amount) / originalPrice) * 100)
    : 0;

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className={cn(textVariants.body.strong.md(), sizeStyles[size])}>
        {showCurrency && symbol}
        {formatPrice(amount)}
      </span>

      {originalPrice && (
        <>
          <span
            className={cn(
              `line-through ${textVariants.body.muted.sm()}`,
              size === 'xl'
                ? 'text-xl'
                : size === 'lg'
                  ? 'text-base'
                  : 'text-sm'
            )}
          >
            {showCurrency && symbol}
            {formatPrice(originalPrice)}
          </span>

          {discount > 0 && (
            <span
              className={cn(
                `px-2 py-0.5 ${colors.component.badge.error.base} ${colors.component.badge.error.dark} ${designTokens.radius.md} font-semibold`,
                size === 'xl'
                  ? 'text-base'
                  : size === 'lg'
                    ? 'text-sm'
                    : 'text-xs'
              )}
            >
              -{discount}%
            </span>
          )}
        </>
      )}
    </div>
  );
};
