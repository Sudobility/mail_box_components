import React from 'react';
import { cn } from '../index';
import { colors, textVariants, ui, designTokens } from '@sudobility/design';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

/** Tracking data for CartSummary actions */
export interface CartSummaryTrackingData {
  action: 'checkout';
  trackingLabel?: string;
  componentName?: string;
}

export interface CartSummaryProps {
  /** Cart items */
  items: CartItem[];
  /** Shipping cost */
  shipping?: number;
  /** Tax amount */
  tax?: number;
  /** Discount amount */
  discount?: number;
  /** Currency symbol */
  currency?: string;
  /** Checkout handler */
  onCheckout?: () => void;
  /** Additional className */
  className?: string;
  /** Optional tracking callback */
  onTrack?: (data: CartSummaryTrackingData) => void;
  /** Optional tracking label */
  trackingLabel?: string;
  /** Optional component name for tracking */
  componentName?: string;
}

/**
 * CartSummary Component
 *
 * Shopping cart summary with totals.
 * Shows items, subtotal, shipping, tax, and final total.
 *
 * @example
 * ```tsx
 * <CartSummary
 *   items={[
 *     { id: '1', name: 'Product A', price: 29.99, quantity: 2 },
 *     { id: '2', name: 'Product B', price: 49.99, quantity: 1 }
 *   ]}
 *   shipping={5.99}
 *   tax={8.50}
 *   discount={10.00}
 *   onCheckout={() => proceedToCheckout()}
 * />
 * ```
 */
export const CartSummary: React.FC<CartSummaryProps> = ({
  items,
  shipping = 0,
  tax = 0,
  discount = 0,
  currency = '$',
  onCheckout,
  className,
  onTrack,
  trackingLabel,
  componentName = 'CartSummary',
}) => {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const total = subtotal + shipping + tax - discount;

  const handleCheckout = () => {
    onTrack?.({ action: 'checkout', trackingLabel, componentName });
    onCheckout?.();
  };

  return (
    <div
      className={cn(
        `${colors.component.card.default.base} ${colors.component.card.default.dark} ${designTokens.radius.lg} border p-6`,
        className
      )}
    >
      <h2 className={`${textVariants.heading.h4()} mb-4`}>Order Summary</h2>

      {/* Items */}
      <div className='space-y-3 mb-4 max-h-64 overflow-y-auto'>
        {items.map(item => (
          <div key={item.id} className='flex gap-3'>
            {item.image && (
              <div
                className={`w-16 h-16 ${designTokens.radius.md} ${ui.background.muted} overflow-hidden flex-shrink-0`}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className='w-full h-full object-cover'
                />
              </div>
            )}
            <div className='flex-1 min-w-0'>
              <p className={`${textVariants.label.default()} truncate`}>
                {item.name}
              </p>
              <p className={textVariants.body.sm()}>Qty: {item.quantity}</p>
            </div>
            <div className='text-right'>
              <p className={textVariants.body.strong.md()}>
                {currency}
                {(item.price * item.quantity).toFixed(2)}
              </p>
              <p className={textVariants.body.sm()}>
                {currency}
                {item.price.toFixed(2)} each
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className={`border-t ${ui.border.default} my-4`} />

      {/* Summary lines */}
      <div className='space-y-2 mb-4'>
        <div className={`flex justify-between ${textVariants.body.md()}`}>
          <span>Subtotal</span>
          <span>
            {currency}
            {subtotal.toFixed(2)}
          </span>
        </div>

        {shipping > 0 && (
          <div className={`flex justify-between ${textVariants.body.md()}`}>
            <span>Shipping</span>
            <span>
              {currency}
              {shipping.toFixed(2)}
            </span>
          </div>
        )}

        {tax > 0 && (
          <div className={`flex justify-between ${textVariants.body.md()}`}>
            <span>Tax</span>
            <span>
              {currency}
              {tax.toFixed(2)}
            </span>
          </div>
        )}

        {discount > 0 && (
          <div
            className={`flex justify-between ${colors.component.alert.success.icon}`}
          >
            <span>Discount</span>
            <span>
              -{currency}
              {discount.toFixed(2)}
            </span>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className={`border-t ${ui.border.default} my-4`} />

      {/* Total */}
      <div className='flex justify-between items-center mb-4'>
        <span className={textVariants.heading.h5()}>Total</span>
        <span className={textVariants.heading.h3()}>
          {currency}
          {total.toFixed(2)}
        </span>
      </div>

      {/* Checkout button */}
      {onCheckout && (
        <button
          onClick={handleCheckout}
          className={`w-full py-3 ${colors.component.button.primary.base} ${colors.component.button.primary.dark} ${designTokens.radius.lg} ${ui.transition.default} font-semibold`}
        >
          Proceed to Checkout
        </button>
      )}
    </div>
  );
};
