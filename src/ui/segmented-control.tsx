import { cn } from '../lib/utils';

/**
 * A one-of-N picker across the top of a panel — the web twin of
 * `@sudobility/components-rn`'s `SegmentedControl`, same API so a cross-platform
 * app draws the same control on both. On the web this is a simple segmented
 * strip of buttons (the native segmented controls RN draws have no web
 * equivalent); `role="tablist"`/`role="tab"` give it the right semantics, which
 * the macOS RN variant could not use.
 */
export interface SegmentedOption {
  value: string;
  label: string;
}

export interface SegmentedControlProps {
  /** The accessible name of the group. */
  label: string;
  options: readonly SegmentedOption[];
  value: string;
  onChange: (value: string) => void;
  /** Test handle (parity with the RN variants). */
  testID?: string;
  /** Extra classes on the strip wrapper. */
  containerClassName?: string;
  /** Extra classes on each segment. */
  triggerClassName?: string;
}

export function SegmentedControl({
  label,
  options,
  value,
  onChange,
  testID,
  containerClassName,
  triggerClassName,
}: SegmentedControlProps) {
  return (
    <div
      role='tablist'
      aria-label={label}
      data-testid={testID}
      className={cn(
        'bg-muted inline-flex rounded-md p-0.5',
        containerClassName
      )}
    >
      {options.map(option => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type='button'
            role='tab'
            aria-selected={selected}
            onClick={() => onChange(option.value)}
            className={cn(
              'rounded px-2 py-1 text-sm transition-colors',
              selected
                ? 'bg-primary text-primary-foreground font-medium'
                : 'text-muted-foreground hover:text-foreground',
              triggerClassName
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
