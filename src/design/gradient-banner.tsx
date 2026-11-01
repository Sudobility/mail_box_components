import React from 'react';
import { cn } from '../index';

export interface GradientBannerProps {
  /** Main content of the banner */
  children: React.ReactNode;
  /** Gradient color variant */
  variant?:
    'blue-purple' | 'green-blue' | 'orange-red' | 'gray' | 'light' | 'custom';
  /** Custom gradient classes (when variant is 'custom') */
  gradientClasses?: string;
  /** Size/padding variant */
  size?: 'sm' | 'md' | 'lg';
  /** Border radius */
  rounded?: 'md' | 'lg' | 'xl' | '2xl';
  /** Show border */
  bordered?: boolean;
  /** Border color classes (when bordered is true) */
  borderClasses?: string;
  /** Additional className for the container */
  className?: string;
}

/**
 * GradientBanner Component
 *
 * A versatile banner component with gradient backgrounds for highlighting
 * important content, CTAs, or feature sections.
 *
 * @example
 * ```tsx
 * <GradientBanner variant="blue-purple" size="lg">
 *   <h3 className={textVariants.heading.h3()}>Special Offer</h3>
 *   <p>Get started with Web3 Email today!</p>
 * </GradientBanner>
 * ```
 *
 * @example
 * ```tsx
 * // Light variant with border
 * <GradientBanner
 *   variant="light"
 *   bordered
 *   borderClasses="border-2 border-blue-200"
 * >
 *   <Alert variant="info">Important information</Alert>
 * </GradientBanner>
 * ```
 */
export const GradientBanner: React.FC<GradientBannerProps> = ({
  children,
  variant = 'blue-purple',
  gradientClasses,
  size = 'md',
  rounded = '2xl',
  bordered = false,
  borderClasses = 'border border-white/20',
  className,
}) => {
  // Gradient color variants
  // intentional: decorative gradient color options are a feature of this component;
  // the from-*/to-* palette colors and text-white on them are preserved on purpose.
  const gradientVariants = {
    'blue-purple': 'bg-gradient-to-r from-blue-600 to-purple-600 text-white',
    'green-blue': 'bg-gradient-to-r from-green-600 to-blue-600 text-white',
    'orange-red': 'bg-gradient-to-r from-orange-600 to-red-600 text-white',
    gray: 'bg-gradient-to-r from-gray-600 to-gray-800 dark:from-gray-700 dark:to-gray-900 text-white',
    light:
      'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 text-foreground',
    custom:
      gradientClasses ||
      'bg-gradient-to-r from-blue-600 to-purple-600 text-white',
  };

  // Size/padding configurations
  const sizeClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  // Border radius configurations
  const roundedClasses = {
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
  };

  return (
    <div
      className={cn(
        gradientVariants[variant],
        sizeClasses[size],
        roundedClasses[rounded],
        bordered && borderClasses,
        className
      )}
    >
      {children}
    </div>
  );
};
