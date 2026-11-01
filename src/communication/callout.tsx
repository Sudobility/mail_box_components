/**
 * Callout Component
 *
 * A simple gradient highlight box for important messages, benefits, or key points.
 * Perfect for drawing attention to specific content with visual emphasis.
 *
 * @example
 * ```tsx
 * import { Callout } from '@/components/ui';
 *
 * <Callout variant="primary">
 *   🔐 Cryptographic security meets user convenience
 * </Callout>
 *
 * <Callout variant="success" icon="✨">
 *   Your changes have been saved successfully
 * </Callout>
 * ```
 */

import React from 'react';
import { cn } from '../index';
import { getCalloutVariantColors } from '@sudobility/design';

export type CalloutVariant =
  'primary' | 'secondary' | 'success' | 'warning' | 'info' | 'purple';

export interface CalloutProps {
  /**
   * Visual variant with different gradient colors
   */
  variant?: CalloutVariant;

  /**
   * Optional icon or emoji to display before text
   */
  icon?: React.ReactNode;

  /**
   * Content to display (can be text or React nodes)
   */
  children: React.ReactNode;

  /**
   * Additional CSS classes
   */
  className?: string;
}

export const Callout: React.FC<CalloutProps> = ({
  variant = 'primary',
  icon,
  children,
  className,
}) => {
  const { background, text } = getCalloutVariantColors(variant);

  // Check if children is a string to apply proper styling
  const isTextContent = typeof children === 'string';

  return (
    <div className={cn('rounded-xl p-6', background, className)}>
      {isTextContent ? (
        <p className={cn('text-lg font-semibold', text)}>
          {icon && <span className='mr-2'>{icon}</span>}
          {children}
        </p>
      ) : (
        <div className={cn('text-lg font-semibold', text)}>
          {icon && <span className='mr-2 inline-block'>{icon}</span>}
          {children}
        </div>
      )}
    </div>
  );
};
