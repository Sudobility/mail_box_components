import { cn } from '../index';
import { colors } from '@sudobility/design';

/**
 * TestCase Component
 *
 * Quality assurance component with full dark mode support.
 *
 * @component
 * @example
 * ```tsx
 * <TestCase className="custom-class" />
 * ```
 */
export interface TestCaseProps {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const TestCase = ({ className, children, disabled }: TestCaseProps) => {
  return (
    <div
      className={cn(
        'p-4 rounded-lg border transition-colors',
        colors.component.card.default.base,
        colors.component.card.default.dark,
        'text-foreground',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      role='region'
      aria-label='TestCase'
    >
      {children || 'TestCase Component'}
    </div>
  );
};
