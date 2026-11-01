import React, { useState } from 'react';
import { cn } from '../index';
import { ui } from '@sudobility/design';

export interface RatingStarsProps {
  /** Current rating value (0-5) */
  value: number;
  /** Rating change handler */
  onChange?: (rating: number) => void;
  /** Max number of stars */
  maxStars?: number;
  /** Star size */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Read-only mode */
  readonly?: boolean;
  /** Show rating number */
  showNumber?: boolean;
  /** Allow half stars */
  allowHalf?: boolean;
  /** Additional className */
  className?: string;
}

/**
 * RatingStars Component
 *
 * Star rating display and input.
 * Supports interactive and read-only modes.
 *
 * @example
 * ```tsx
 * <RatingStars
 *   value={4.5}
 *   onChange={(rating) => setRating(rating)}
 *   size="lg"
 *   showNumber
 *   allowHalf
 * />
 * ```
 *
 * @example
 * ```tsx
 * <RatingStars
 *   value={3}
 *   readonly
 *   size="sm"
 * />
 * ```
 */
export const RatingStars: React.FC<RatingStarsProps> = ({
  value,
  onChange,
  maxStars = 5,
  size = 'md',
  readonly = false,
  showNumber = false,
  allowHalf = false,
  className,
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeStyles = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-10 h-10',
  };

  const handleClick = (starIndex: number) => {
    if (readonly || !onChange) return;
    onChange(starIndex);
  };

  const handleMouseEnter = (starIndex: number) => {
    if (readonly || !onChange) return;
    setHoverRating(starIndex);
  };

  const handleMouseLeave = () => {
    if (readonly || !onChange) return;
    setHoverRating(0);
  };

  const getStarFill = (starIndex: number): 'full' | 'half' | 'empty' => {
    const rating = hoverRating || value;

    if (starIndex <= rating) return 'full';
    if (allowHalf && starIndex - 0.5 <= rating) return 'half';
    return 'empty';
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className='flex items-center gap-0.5'>
        {Array.from({ length: maxStars }, (_, i) => i + 1).map(starIndex => {
          const fill = getStarFill(starIndex);

          return (
            <button
              key={starIndex}
              onClick={() => handleClick(starIndex)}
              onMouseEnter={() => handleMouseEnter(starIndex)}
              onMouseLeave={handleMouseLeave}
              className={cn(
                ui.transition.default,
                !readonly && onChange && 'cursor-pointer hover:scale-110',
                readonly && 'cursor-default'
              )}
              disabled={readonly}
              type='button'
            >
              {fill === 'full' && (
                <svg
                  className={cn(sizeStyles[size], 'text-warning')}
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                </svg>
              )}

              {fill === 'half' && (
                <svg className={cn(sizeStyles[size])} viewBox='0 0 20 20'>
                  <defs>
                    <linearGradient id={`half-${starIndex}`}>
                      <stop
                        offset='50%'
                        stopColor='currentColor'
                        className='text-warning'
                      />
                      <stop
                        offset='50%'
                        stopColor='currentColor'
                        className='text-muted-foreground '
                      />
                    </linearGradient>
                  </defs>
                  <path
                    fill={`url(#half-${starIndex})`}
                    d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'
                  />
                </svg>
              )}

              {fill === 'empty' && (
                <svg
                  className={cn(sizeStyles[size], ui.text.muted)}
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                </svg>
              )}
            </button>
          );
        })}
      </div>

      {showNumber && (
        <span
          className={cn(
            ui.text.strong,
            size === 'sm' && 'text-sm',
            size === 'md' && 'text-base',
            size === 'lg' && 'text-lg',
            size === 'xl' && 'text-xl'
          )}
        >
          {value.toFixed(1)}
        </span>
      )}
    </div>
  );
};
