import React from 'react';
import { cn } from '../index';
import { colors, ui, textVariants } from '@sudobility/design';

export interface ButtonConfig {
  text: string;
  onClick?: () => void;
  href?: string;
  className?: string;
}

export interface HeroBannerWithBadgeProps {
  badgeIcon?: React.ReactNode;
  badgeText: string;
  badgeColor?: 'blue' | 'green' | 'purple' | 'orange' | 'pink' | 'gray';
  title: string | React.ReactNode;
  subtitle?: string;
  description: string;
  primaryButton?: ButtonConfig;
  secondaryButton?: ButtonConfig;
  className?: string;
  children?: React.ReactNode;
}

export const HeroBannerWithBadge: React.FC<HeroBannerWithBadgeProps> = ({
  badgeIcon,
  badgeText,
  badgeColor = 'blue',
  title,
  subtitle,
  description,
  primaryButton,
  secondaryButton,
  className,
  children,
}) => {
  const containerClass = 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8';

  const badgeColors = colors.component.badge;
  const badgeColorClasses = {
    blue: `${badgeColors.primary.base} ${badgeColors.primary.dark} border-primary/30`,
    green: `${badgeColors.success.base} ${badgeColors.success.dark} border-success/30`,
    purple: 'bg-accent text-accent-foreground border-accent',
    orange: `${badgeColors.warning.base} ${badgeColors.warning.dark} border-warning/30`,
    pink: 'bg-secondary text-secondary-foreground border-secondary',
    gray: `${badgeColors.default.base} ${badgeColors.default.dark} border-border`,
  };

  const badgeClasses = badgeColorClasses[badgeColor];

  return (
    <section className={cn('py-20', className)}>
      <div className={`${containerClass} text-center`}>
        <div
          className={cn(
            'inline-flex items-center border px-6 py-3 rounded-full mb-6',
            badgeClasses
          )}
        >
          {badgeIcon && <span className='mr-3'>{badgeIcon}</span>}
          <span className='font-semibold'>{badgeText}</span>
        </div>

        <h1
          className={cn(textVariants.heading.h1(), 'text-4xl md:text-6xl mb-6')}
        >
          {typeof title === 'string' ? (
            <span dangerouslySetInnerHTML={{ __html: title }} />
          ) : (
            title
          )}
          {subtitle && <span className='text-primary block'>{subtitle}</span>}
        </h1>

        <p
          className={cn(
            textVariants.body.lg(),
            'text-xl mb-8 max-w-4xl mx-auto'
          )}
        >
          {description}
        </p>

        {(primaryButton || secondaryButton) && (
          <div className='flex flex-col sm:flex-row gap-4 justify-center mb-8'>
            {primaryButton &&
              (primaryButton.href ? (
                <a
                  href={primaryButton.href}
                  className={cn(
                    'px-8 py-3 rounded-md inline-block',
                    colors.component.button.primary.base,
                    colors.component.button.primary.dark,
                    ui.transition.default,
                    primaryButton.className
                  )}
                >
                  {primaryButton.text}
                </a>
              ) : (
                <button
                  onClick={primaryButton.onClick}
                  className={cn(
                    'px-8 py-3 rounded-md',
                    colors.component.button.primary.base,
                    colors.component.button.primary.dark,
                    ui.transition.default,
                    primaryButton.className
                  )}
                >
                  {primaryButton.text}
                </button>
              ))}
            {secondaryButton &&
              (secondaryButton.href ? (
                <a
                  href={secondaryButton.href}
                  className={cn(
                    'px-8 py-3 rounded-md border-2 inline-block',
                    colors.component.button.outline.base,
                    colors.component.button.outline.dark,
                    ui.transition.default,
                    secondaryButton.className
                  )}
                >
                  {secondaryButton.text}
                </a>
              ) : (
                <button
                  onClick={secondaryButton.onClick}
                  className={cn(
                    'px-8 py-3 rounded-md border-2',
                    colors.component.button.outline.base,
                    colors.component.button.outline.dark,
                    ui.transition.default,
                    secondaryButton.className
                  )}
                >
                  {secondaryButton.text}
                </button>
              ))}
          </div>
        )}

        {children}
      </div>
    </section>
  );
};
