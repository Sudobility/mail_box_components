import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../index';

const contentContainerVariants = cva('mx-auto px-4 sm:px-6', {
  variants: {
    size: {
      sm: 'max-w-2xl',
      md: 'max-w-4xl',
      lg: 'max-w-6xl',
      xl: 'max-w-7xl lg:px-8',
      full: 'max-w-full',
      prose: 'max-w-prose',
    },
    spacing: {
      none: '',
      xs: 'py-2', // 8px
      sm: 'py-3', // 12px
      md: 'py-4', // 16px
      lg: 'py-6', // 24px
      xl: 'py-8', // 32px
      '2xl': 'py-12', // 48px
      '3xl': 'py-16', // 64px
    },
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    },
  },
  defaultVariants: {
    size: 'xl',
    spacing: 'md',
    align: 'left',
  },
});

export interface ContentContainerProps extends VariantProps<
  typeof contentContainerVariants
> {
  children: React.ReactNode;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
}

export const ContentContainer: React.FC<ContentContainerProps> = ({
  children,
  size = 'xl',
  spacing = 'md',
  align = 'left',
  className,
  as: Component = 'div',
}) => {
  return React.createElement(
    Component,
    {
      className: cn(
        contentContainerVariants({ size, spacing, align }),
        className
      ),
    },
    children
  );
};
