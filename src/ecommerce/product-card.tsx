import React from 'react';
import { cn } from '../index';
import { colors, textVariants, ui, designTokens } from '@sudobility/design';

/** Tracking data for ProductCard actions */
export interface ProductCardTrackingData {
  action: 'click' | 'add_to_cart';
  trackingLabel?: string;
  componentName?: string;
}

export interface ProductCardProps {
  /** Product image URL */
  image: string;
  /** Product name */
  name: string;
  /** Product price */
  price: number;
  /** Original price (for discounts) */
  originalPrice?: number;
  /** Product rating (0-5) */
  rating?: number;
  /** Number of reviews */
  reviewCount?: number;
  /** Badge text */
  badge?: string;
  /** Badge variant */
  badgeVariant?: 'sale' | 'new' | 'featured';
  /** Click handler */
  onClick?: () => void;
  /** Add to cart handler */
  onAddToCart?: () => void;
  /** Additional className */
  className?: string;
  /** Optional tracking callback */
  onTrack?: (data: ProductCardTrackingData) => void;
  /** Optional tracking label */
  trackingLabel?: string;
  /** Optional component name for tracking */
  componentName?: string;
}

/**
 * ProductCard Component
 *
 * Product display card for e-commerce.
 * Shows image, name, price, rating, and actions.
 *
 * @example
 * ```tsx
 * <ProductCard
 *   image="/product.jpg"
 *   name="Premium Headphones"
 *   price={99.99}
 *   originalPrice={149.99}
 *   rating={4.5}
 *   reviewCount={128}
 *   badge="Sale"
 *   badgeVariant="sale"
 *   onAddToCart={() => addToCart(product)}
 * />
 * ```
 */
export const ProductCard: React.FC<ProductCardProps> = ({
  image,
  name,
  price,
  originalPrice,
  rating,
  reviewCount,
  badge,
  badgeVariant = 'new',
  onClick,
  onAddToCart,
  className,
  onTrack,
  trackingLabel,
  componentName = 'ProductCard',
}) => {
  const badgeStyles = {
    sale: 'bg-destructive text-destructive-foreground',
    new: 'bg-success text-success-foreground',
    featured: 'bg-primary text-primary-foreground',
  };

  const discount = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const handleClick = () => {
    onTrack?.({ action: 'click', trackingLabel, componentName });
    onClick?.();
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onTrack?.({ action: 'add_to_cart', trackingLabel, componentName });
    onAddToCart?.();
  };

  return (
    <div
      className={cn(
        `group ${colors.component.card.default.base} ${colors.component.card.default.dark} ${designTokens.radius.lg} ${designTokens.shadow.md} overflow-hidden ${colors.component.card.default.hover}`,
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick ? handleClick : undefined}
    >
      {/* Image */}
      <div
        className={`relative aspect-square overflow-hidden ${ui.background.muted}`}
      >
        <img
          src={image}
          alt={name}
          className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
        />

        {/* Badge */}
        {badge && (
          <div
            className={cn(
              'absolute top-2 left-2 px-2 py-1 rounded text-xs font-semibold',
              badgeStyles[badgeVariant]
            )}
          >
            {badge}
          </div>
        )}

        {/* Discount badge */}
        {discount > 0 && (
          <div className='absolute top-2 right-2 px-2 py-1 rounded bg-warning text-warning-foreground text-xs font-semibold'>
            -{discount}%
          </div>
        )}
      </div>

      {/* Content */}
      <div className='p-4'>
        {/* Name */}
        <h3 className={`${textVariants.heading.h6()} mb-2 line-clamp-2`}>
          {name}
        </h3>

        {/* Rating */}
        {rating !== undefined && (
          <div className='flex items-center gap-2 mb-2'>
            <div className='flex items-center'>
              {[1, 2, 3, 4, 5].map(star => (
                <svg
                  key={star}
                  className={cn(
                    'w-4 h-4',
                    star <= rating ? 'text-warning' : 'text-muted-foreground/40'
                  )}
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                </svg>
              ))}
            </div>
            {reviewCount !== undefined && (
              <span className={textVariants.body.sm()}>({reviewCount})</span>
            )}
          </div>
        )}

        {/* Price */}
        <div className='flex items-center gap-2 mb-3'>
          <span className={textVariants.heading.h4()}>${price.toFixed(2)}</span>
          {originalPrice && (
            <span className={`${textVariants.body.muted.sm()} line-through`}>
              ${originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Add to cart button */}
        {onAddToCart && (
          <button
            onClick={handleAddToCart}
            className={`w-full py-2 ${colors.component.button.primary.base} ${colors.component.button.primary.dark} ${designTokens.radius.lg} ${ui.transition.default} font-medium`}
          >
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
};
