import { cn } from '../index';
import { colors } from '@sudobility/design';

/**
 * InvestmentPortfolio Component
 *
 * Banking component with full dark mode support.
 *
 * @component
 * @example
 * ```tsx
 * <InvestmentPortfolio className="custom-class" />
 * ```
 */
export interface InvestmentPortfolioProps {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const InvestmentPortfolio = ({
  className,
  children,
  disabled,
}: InvestmentPortfolioProps) => {
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
      aria-label='InvestmentPortfolio'
    >
      {children || 'InvestmentPortfolio Component'}
    </div>
  );
};
