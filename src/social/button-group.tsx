import React from 'react';
import { cn } from '../index';

export interface ButtonGroupProps {
  /** Buttons to group */
  children: React.ReactNode;
  /** Orientation */
  orientation?: 'horizontal' | 'vertical';
  /** Spacing between buttons */
  spacing?: 'none' | 'sm' | 'md' | 'lg';
  /** Align buttons */
  align?: 'start' | 'center' | 'end' | 'stretch';
  /** Attached buttons (no spacing, shared borders) */
  attached?: boolean;
  /** Additional className */
  className?: string;
}

/**
 * ButtonGroup Component
 *
 * Groups multiple buttons together with consistent spacing or attached styling.
 * Supports horizontal and vertical layouts.
 *
 * @example
 * ```tsx
 * <ButtonGroup>
 *   <Button variant="primary">Save</Button>
 *   <Button variant="secondary">Cancel</Button>
 * </ButtonGroup>
 * ```
 *
 * @example
 * ```tsx
 * <ButtonGroup attached>
 *   <Button>Option 1</Button>
 *   <Button>Option 2</Button>
 *   <Button>Option 3</Button>
 * </ButtonGroup>
 * ```
 */
export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  orientation = 'horizontal',
  spacing = 'md',
  align = 'start',
  attached = false,
  className,
}) => {
  // Spacing configurations
  const spacingClasses = {
    horizontal: {
      none: '',
      sm: 'gap-1',
      md: 'gap-2',
      lg: 'gap-4',
    },
    vertical: {
      none: '',
      sm: 'gap-1',
      md: 'gap-2',
      lg: 'gap-4',
    },
  };

  // Alignment configurations
  const alignClasses = {
    horizontal: {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      stretch: 'justify-stretch',
    },
    vertical: {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
    },
  };

  const isHorizontal = orientation === 'horizontal';

  // Attached mode styles (buttons share borders)
  if (attached) {
    return (
      <div
        className={cn(
          'inline-flex',
          isHorizontal ? 'flex-row' : 'flex-col',
          alignClasses[orientation][align],
          className
        )}
        role='group'
      >
        {React.Children.map(children, (child, index) => {
          if (!React.isValidElement(child)) return child;

          const isFirst = index === 0;
          const isLast = index === React.Children.count(children) - 1;

          return (
            <div
              className={cn(
                // Remove border radius on connecting sides
                isHorizontal && !isFirst && !isLast && 'rounded-none',
                isHorizontal && isFirst && 'rounded-r-none',
                isHorizontal && isLast && 'rounded-l-none',
                !isHorizontal && !isFirst && !isLast && 'rounded-none',
                !isHorizontal && isFirst && 'rounded-b-none',
                !isHorizontal && isLast && 'rounded-t-none',
                // Remove connecting borders
                !isFirst && (isHorizontal ? '-ml-px' : '-mt-px')
              )}
            >
              {child}
            </div>
          );
        })}
      </div>
    );
  }

  // Regular mode with spacing
  return (
    <div
      className={cn(
        'flex',
        isHorizontal ? 'flex-row' : 'flex-col',
        spacingClasses[orientation][spacing],
        alignClasses[orientation][align],
        className
      )}
      role='group'
    >
      {children}
    </div>
  );
};
