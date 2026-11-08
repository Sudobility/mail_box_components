import { cn } from '../lib/utils';

/**
 * A labelled slider — the web twin of `@sudobility/components-rn`'s
 * `LevelSlider`, same API so a cross-platform app draws the same control on
 * both. A native range input (every keyboard/accessibility behaviour for free)
 * over a painted groove; `LevelSlider` fills the groove from the left in the
 * accent (an amount), `PositionSlider` leaves it unfilled (a position, e.g.
 * pan). The accessible name is on the input, since every caller has one.
 */
export type LevelSliderProps = {
  /** The accessible name — what property this controls. */
  label: string;
  value: number;
  min?: number;
  max?: number;
  /** Quantum. 0 means continuous. */
  step?: number;
  disabled?: boolean;
  onChange: (value: number) => void;
  /** Fired once on release, for work too expensive to do per frame. */
  onSlidingComplete?: (value: number) => void;
  className?: string;
};

const THUMB = [
  '[&::-webkit-slider-thumb]:appearance-none',
  '[&::-webkit-slider-thumb]:size-3',
  '[&::-webkit-slider-thumb]:rounded-full',
  '[&::-webkit-slider-thumb]:bg-primary',
  '[&::-webkit-slider-thumb]:border',
  '[&::-webkit-slider-thumb]:border-background',
  '[&::-moz-range-thumb]:size-3',
  '[&::-moz-range-thumb]:rounded-full',
  '[&::-moz-range-thumb]:bg-primary',
  '[&::-moz-range-thumb]:border-0',
].join(' ');

function BaseSlider({
  label,
  value,
  min = 0,
  max = 1,
  step = 0,
  disabled = false,
  onChange,
  onSlidingComplete,
  className,
  filled,
}: LevelSliderProps & { filled: boolean }) {
  const pct = max > min ? ((value - min) / (max - min)) * 100 : 0;
  return (
    <div className={cn('relative h-4 flex-1', className)}>
      {/* Painted groove; the fill (for a level) shows how far the value is. */}
      <div className='bg-border absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full' />
      {filled ? (
        <div
          className='bg-primary absolute left-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full'
          style={{ width: `${pct}%` }}
        />
      ) : null}
      <input
        type='range'
        aria-label={label}
        value={value}
        min={min}
        max={max}
        step={step === 0 ? 'any' : step}
        disabled={disabled}
        onChange={event => onChange(Number(event.target.value))}
        onPointerUp={
          onSlidingComplete
            ? event =>
                onSlidingComplete(
                  Number((event.target as HTMLInputElement).value)
                )
            : undefined
        }
        className={cn(
          'absolute inset-0 w-full cursor-pointer appearance-none bg-transparent',
          disabled && 'opacity-50',
          THUMB
        )}
      />
    </div>
  );
}

/** An amount: the track fills from the left as the value grows. */
export function LevelSlider(props: LevelSliderProps) {
  return <BaseSlider {...props} filled />;
}

/** A position on a range rather than an amount of one (no fill). */
export function PositionSlider(props: LevelSliderProps) {
  return <BaseSlider {...props} filled={false} />;
}
