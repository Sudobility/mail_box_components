import { cn } from './lib/cn';
import { ui } from '@sudobility/design';

export interface SegmentedControlOption<T extends string> {
  /** Value for this option */
  value: T;
  /** Display label */
  label: string;
}

export interface SegmentedControlProps<T extends string> {
  /** Available options */
  options: SegmentedControlOption<T>[];
  /** Currently selected value */
  value: T;
  /** Selection change handler */
  onChange: (value: T) => void;
  /** Additional CSS classes for the container */
  className?: string;
  /** Whether the control is disabled */
  disabled?: boolean;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
}

/**
 * SegmentedControl - A toggle control for switching between options
 *
 * Commonly used for billing period selection (Monthly/Yearly).
 * All labels are passed by the consumer for full localization control.
 *
 * @example
 * ```tsx
 * <SegmentedControl
 *   options={[
 *     { value: 'monthly', label: t('billing.monthly') },
 *     { value: 'yearly', label: t('billing.yearly') },
 *   ]}
 *   value={billingPeriod}
 *   onChange={setBillingPeriod}
 * />
 * ```
 */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className,
  disabled = false,
  size = 'md',
}: SegmentedControlProps<T>) {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <div
      className={cn(
        'inline-flex rounded-lg p-1',
        ui.background.muted,
        disabled && ui.states.disabled,
        className
      )}
      role='radiogroup'
    >
      {options.map(option => {
        const isSelected = value === option.value;
        return (
          <button
            key={option.value}
            type='button'
            role='radio'
            aria-checked={isSelected}
            disabled={disabled}
            onClick={() => !disabled && onChange(option.value)}
            className={cn(
              sizeClasses[size],
              'font-medium rounded-md',
              ui.transition.all,
              ui.states.focus,
              isSelected
                ? `${ui.background.surface} text-foreground shadow-sm`
                : `${ui.text.bodySmall} hover:text-foreground`,
              disabled && 'cursor-not-allowed'
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export default SegmentedControl;
