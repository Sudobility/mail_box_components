import React from 'react';
import { Link } from 'react-router-dom';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../index';

const bannerVariants = cva('border-b transition-all duration-200', {
  variants: {
    variant: {
      default:
        'bg-gradient-to-r from-success/10 to-primary/10 border-success/20',
      compact: 'bg-success/10 border-success/20',
      minimal: 'bg-muted/50 border-border',
      // intentional: decorative brand gradient variant (blue→purple has no semantic token)
      vibrant: 'bg-gradient-to-r from-blue-600 to-purple-600 border-primary',
    },
    size: {
      default: 'py-4',
      compact: 'py-3',
      large: 'py-6',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

const textVariants = cva('font-semibold', {
  variants: {
    variant: {
      default: 'text-success',
      compact: 'text-success',
      minimal: 'text-muted-foreground',
      vibrant: 'text-white', // intentional: on preserved decorative brand gradient
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const buttonVariants = cva(
  'inline-flex items-center justify-center px-6 py-2 rounded-lg font-medium transition-all duration-200 hover:transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-r from-success to-primary hover:from-success/90 hover:to-primary/90 text-primary-foreground focus:ring-success',
        compact:
          'bg-success hover:bg-success/90 text-success-foreground focus:ring-success',
        minimal:
          'bg-primary hover:bg-primary/90 text-primary-foreground focus:ring-ring',
        vibrant:
          'bg-card hover:bg-muted text-primary hover:text-primary focus:ring-ring',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface FreeEmailBannerProps extends VariantProps<
  typeof bannerVariants
> {
  className?: string;
  message?: string;
  ctaText?: string;
  ctaLink?: string;
  showBadge?: boolean;
  badgeText?: string;
  onDismiss?: () => void;
  isDismissible?: boolean;
  dismissAriaLabel?: string;
  /** Optional tracking callback */
  onTrack?: (action: string) => void;
}

export const FreeEmailBanner: React.FC<FreeEmailBannerProps> = ({
  className,
  variant = 'default',
  size = 'default',
  message = 'Get Your Free Email Address - Start Using Web3 Email Today',
  ctaText = 'Get Free Email',
  ctaLink = '/connect',
  showBadge = true,
  badgeText = 'FREE',
  onDismiss,
  isDismissible = false,
  dismissAriaLabel = 'Dismiss banner',
  onTrack,
}) => {
  const containerClass = 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8';

  return (
    <div className={cn(bannerVariants({ variant, size }), className)}>
      <div className={containerClass}>
        <div className='flex flex-col sm:flex-row items-center justify-center gap-4 text-center relative'>
          {isDismissible && onDismiss && (
            <button
              onClick={() => {
                onTrack?.('dismiss');
                onDismiss();
              }}
              className='absolute right-0 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-foreground/10 transition-colors'
              aria-label={dismissAriaLabel}
            >
              <svg
                className='w-4 h-4 text-current opacity-60'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </button>
          )}

          <div className='flex items-center'>
            {showBadge && (
              <div
                className={cn(
                  'text-xs font-bold px-3 py-1 rounded-full mr-3 transition-colors',
                  variant === 'vibrant'
                    ? 'bg-card text-primary'
                    : 'bg-success text-success-foreground'
                )}
              >
                {badgeText}
              </div>
            )}
            <span className={cn(textVariants({ variant }))}>{message}</span>
          </div>

          <Link
            to={ctaLink}
            className={cn(buttonVariants({ variant }))}
            onClick={() => onTrack?.('cta_click')}
          >
            {ctaText}
          </Link>
        </div>
      </div>
    </div>
  );
};
