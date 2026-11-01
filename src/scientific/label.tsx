import * as React from 'react';
import { Root } from '@radix-ui/react-label';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../index';
import { textVariants } from '@sudobility/design';

const labelVariants = cva(
  `${textVariants.label.default()} peer-disabled:cursor-not-allowed peer-disabled:opacity-70`
);

const Label = React.forwardRef<
  React.ElementRef<typeof Root>,
  React.ComponentPropsWithoutRef<typeof Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <Root ref={ref} className={cn(labelVariants(), className)} {...props} />
));
Label.displayName = Root.displayName;
