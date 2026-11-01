import React from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { cn } from '../index';
import { textVariants } from '@sudobility/design';

export interface FeatureListItemProps {
  /** Feature title */
  title: string;
  /** Feature description */
  description?: string;
  /** Icon component (defaults to CheckCircleIcon) */
  icon?: React.ComponentType<{ className?: string }>;
  /** Icon background color variant */
  iconVariant?: 'primary' | 'success' | 'warning' | 'info' | 'gradient';
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Additional className for the container */
  className?: string;
}

/**
 * FeatureListItem Component
 *
 * Displays a feature with an icon, title, and optional description.
 * Commonly used in landing pages, marketing sections, and feature showcases.
 *
 * @example
 * ```tsx
 * <FeatureListItem
 *   title="End-to-End Encryption"
 *   description="Your emails are encrypted and only you can read them"
 *   iconVariant="success"
 * />
 * ```
 */
export const FeatureListItem: React.FC<FeatureListItemProps> = ({
  title,
  description,
  icon: Icon = CheckCircleIcon,
  iconVariant = 'success',
  size = 'md',
  className,
}) => {
  const iconBgClasses = {
    primary: 'bg-primary text-primary-foreground',
    success: 'bg-success text-success-foreground',
    warning: 'bg-warning text-warning-foreground',
    info: 'bg-info text-info-foreground',
    // intentional: decorative multi-color gradient variant; text-white is its contrast color
    gradient: 'bg-gradient-to-br from-blue-400 to-purple-500 text-white',
  };

  const sizeClasses = {
    sm: {
      container: 'gap-2',
      icon: 'p-1.5',
      iconSize: 'h-4 w-4',
      title: textVariants.body.md(),
      description: textVariants.body.sm(),
    },
    md: {
      container: 'gap-3',
      icon: 'p-2',
      iconSize: 'h-5 w-5',
      title: textVariants.body.strong.md(),
      description: textVariants.body.md(),
    },
    lg: {
      container: 'gap-4',
      icon: 'p-3',
      iconSize: 'h-6 w-6',
      title: textVariants.heading.h4(),
      description: textVariants.body.md(),
    },
  };

  const sizeConfig = sizeClasses[size];

  return (
    <div className={cn('flex items-start', sizeConfig.container, className)}>
      <div
        className={cn(
          'rounded-full flex-shrink-0',
          sizeConfig.icon,
          iconBgClasses[iconVariant]
        )}
      >
        <Icon className={sizeConfig.iconSize} />
      </div>
      <div className='flex-1 min-w-0'>
        <h4 className={sizeConfig.title}>{title}</h4>
        {description && (
          <p
            className={cn(sizeConfig.description, 'mt-1 text-muted-foreground')}
          >
            {description}
          </p>
        )}
      </div>
    </div>
  );
};
