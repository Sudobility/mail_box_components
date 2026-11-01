import React, { useState, KeyboardEvent } from 'react';
import { cn } from '../index';
import { ui } from '@sudobility/design';

export interface RatingProps {
  /** Rating value */
  value: number;
  /** Change handler */
  onChange?: (value: number) => void;
  /** Maximum rating */
  max?: number;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Read-only mode */
  readOnly?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Allow half ratings */
  allowHalf?: boolean;
  /** Allow clearing rating by clicking same star */
  allowClear?: boolean;
  /** Custom icon (ReactNode or icon type) */
  icon?: React.ReactNode | 'star' | 'heart' | 'thumbs';
  /** Empty icon color (color name like 'gray' or Tailwind class) */
  emptyColor?: string;
  /** Filled icon color (color name like 'yellow' or Tailwind class) */
  filledColor?: string;
  /** Show count label */
  showCount?: boolean;
  /** Count value to display */
  count?: number;
  /** Additional className */
  className?: string;
}

/**
 * Rating Component
 *
 * Star rating with customizable icons and precision.
 * Supports full and half ratings.
 *
 * @example
 * ```tsx
 * <Rating value={4.5} onChange={setRating} allowHalf />
 * ```
 */
export const Rating: React.FC<RatingProps> = ({
  value,
  onChange,
  max = 5,
  size = 'md',
  readOnly = false,
  disabled = false,
  allowHalf = false,
  allowClear = true,
  icon = 'star',
  emptyColor,
  filledColor,
  showCount = false,
  count,
  className,
}) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const isInteractive = !readOnly && !disabled && onChange;

  // Convert color names to Tailwind classes
  const getColorClass = (color: string | undefined, defaultClass: string) => {
    if (!color) return defaultClass;
    if (color.includes('text-')) return color;
    return `text-${color}-400`;
  };

  const handleClick = (index: number, isHalf: boolean) => {
    if (!isInteractive) return;
    const newValue = index + (isHalf && allowHalf ? 0.5 : 1);

    // Allow clearing rating by clicking the same star
    if (allowClear && newValue === value) {
      onChange(0);
    } else {
      onChange(newValue);
    }
  };

  const handleMouseEnter = (index: number, isHalf: boolean) => {
    if (!isInteractive) return;
    const newValue = index + (isHalf && allowHalf ? 0.5 : 1);
    setHoverValue(newValue);
  };

  const handleMouseLeave = () => {
    setHoverValue(null);
  };

  const handleContainerKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!isInteractive) return;

    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const newValue = Math.min(value + 1, max);
      onChange(newValue);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const newValue = Math.max(value - 1, 0);
      onChange(newValue);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const newValue = Math.min(value + 1, max);
      onChange(newValue);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const newValue = Math.max(value - 1, 0);
      onChange(newValue);
    }
  };

  // Size configurations
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const defaultIcons = {
    star: (filled: boolean) => (
      <svg
        className='w-full h-full'
        fill={filled ? 'currentColor' : 'none'}
        stroke='currentColor'
        strokeWidth={filled ? 0 : 2}
        viewBox='0 0 24 24'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z'
        />
      </svg>
    ),
    heart: (filled: boolean) => (
      <svg
        className='w-full h-full'
        fill={filled ? 'currentColor' : 'none'}
        stroke='currentColor'
        strokeWidth={filled ? 0 : 2}
        viewBox='0 0 24 24'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
        />
      </svg>
    ),
    thumbs: (filled: boolean) => (
      <svg
        className='w-full h-full'
        fill={filled ? 'currentColor' : 'none'}
        stroke='currentColor'
        strokeWidth={filled ? 0 : 2}
        viewBox='0 0 24 24'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5'
        />
      </svg>
    ),
  };

  const displayValue = hoverValue !== null ? hoverValue : value;

  const emptyColorClass = getColorClass(emptyColor, ui.text.muted);
  const filledColorClass = getColorClass(filledColor, 'text-warning');

  const renderIcon = (index: number) => {
    const isFilled = index < Math.floor(displayValue);
    const isHalf = index === Math.floor(displayValue) && displayValue % 1 !== 0;

    // Custom icon (ReactNode)
    const customIcon = typeof icon !== 'string' ? icon : null;
    const iconType = (typeof icon === 'string' ? icon : 'star') as
      'star' | 'heart' | 'thumbs';

    const StarContent = (
      <div
        data-star
        className={cn(
          'relative',
          !readOnly &&
            !disabled &&
            'cursor-pointer transition-transform hover:scale-110',
          sizeClasses[size]
        )}
      >
        {/* Full/empty icon */}
        <div className={cn(isFilled ? filledColorClass : emptyColorClass)}>
          {customIcon || defaultIcons[iconType](isFilled)}
        </div>

        {/* Half icon overlay */}
        {isHalf && allowHalf && (
          <div className='absolute inset-0 flex' style={{ overflow: 'hidden' }}>
            <div className={cn('w-1/2 h-full', filledColorClass)}>
              {customIcon || defaultIcons[iconType](true)}
            </div>
          </div>
        )}

        {/* Click areas for half ratings */}
        {isInteractive && (
          <div className='absolute inset-0 flex'>
            {allowHalf ? (
              <>
                <div
                  className='w-1/2 h-full'
                  onClick={() => handleClick(index, true)}
                  onMouseEnter={() => handleMouseEnter(index, true)}
                  onMouseLeave={handleMouseLeave}
                />
                <div
                  className='w-1/2 h-full'
                  onClick={() => handleClick(index, false)}
                  onMouseEnter={() => handleMouseEnter(index, false)}
                  onMouseLeave={handleMouseLeave}
                />
              </>
            ) : (
              <div
                className='w-full h-full'
                onClick={() => handleClick(index, false)}
                onMouseEnter={() => handleMouseEnter(index, false)}
                onMouseLeave={handleMouseLeave}
              />
            )}
          </div>
        )}
      </div>
    );

    if (readOnly) {
      return <div key={index}>{StarContent}</div>;
    }

    return (
      <button
        key={index}
        type='button'
        role='button'
        disabled={disabled}
        onClick={() => handleClick(index, false)}
        className={cn(ui.states.focus, 'rounded')}
        aria-label={`Rate ${index + 1} out of ${max}`}
        tabIndex={-1}
      >
        {StarContent}
      </button>
    );
  };

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2',
        disabled && ui.states.disabled,
        className
      )}
      role='slider'
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-disabled={disabled}
      aria-readonly={readOnly}
      tabIndex={isInteractive ? 0 : -1}
      onKeyDown={handleContainerKeyDown}
    >
      <div className='flex items-center gap-1'>
        {Array.from({ length: max }, (_, i) => renderIcon(i))}
      </div>
      {showCount && count !== undefined && (
        <span className={cn('text-sm', ui.text.bodySmall)}>({count})</span>
      )}
    </div>
  );
};
