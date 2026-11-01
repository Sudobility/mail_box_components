import { cn } from './lib/utils';
import { colors } from '@sudobility/design';

/**
 * CryptoPortfolio Component
 *
 * A reusable CryptoPortfolio component with full dark mode support.
 * Optimized for accessibility and AI-assisted development.
 *
 * @component
 * @example
 * ```tsx
 * <CryptoPortfolio className="custom-class" />
 * ```
 *
 * @remarks
 * This component supports:
 * - Light and dark themes automatically
 * - Responsive design
 * - Accessibility features
 * - TypeScript type safety
 *
 * @see {@link https://docs.example.com/components/crypto-portfolio}
 */

export interface CryptoPortfolioProps {
  /** Additional CSS classes */
  className?: string;
  /** Component children */
  children?: React.ReactNode;
  /** Disabled state */
  disabled?: boolean;
  /** Callback when component is interacted with */
  onClick?: () => void;
}

export const CryptoPortfolio = ({
  className,
  children,
  disabled = false,
  onClick,
}: CryptoPortfolioProps) => {
  return (
    <div
      className={cn(
        'p-4 rounded-lg border transition-colors',
        colors.component.card.default.base,
        colors.component.card.default.dark,
        'text-foreground',
        disabled && 'opacity-50 cursor-not-allowed',
        'hover:bg-muted',
        className
      )}
      onClick={disabled ? undefined : onClick}
      role='region'
      aria-label='CryptoPortfolio'
    >
      {children || 'CryptoPortfolio Component'}
    </div>
  );
};
