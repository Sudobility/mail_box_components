import React, { useEffect, useRef, useState } from 'react';
import { cn } from '../lib/utils';

export interface LazyFlatListProps<T> {
  /** The full list of items. All slots are laid out; only near-viewport slots mount their content. */
  items: T[];
  /** Renders the (potentially expensive) content for an item once it nears the viewport. */
  renderItem: (item: T, index: number) => React.ReactNode;
  /** Stable key per item. */
  keyExtractor: (item: T, index: number) => string;
  /** Classes for the container element (apply your grid/flex layout here). */
  className?: string;
  /** Classes applied to every item wrapper. */
  itemClassName?: string;
  /**
   * Classes used to reserve each item's box before its content mounts (e.g.
   * `aspect-[3/4]`). Reserving space is what makes laziness work: without a
   * sized placeholder every slot would sit at the top and all mount at once.
   */
  reserveClassName?: string;
  /** Fallback space reservation (min-height, px) when `reserveClassName` is not given. */
  estimatedItemHeight?: number;
  /** Placeholder shown before an item mounts. Defaults to a pulsing skeleton. */
  renderPlaceholder?: (item: T, index: number) => React.ReactNode;
  /** How far outside the viewport to begin mounting items. Default `'600px'`. */
  rootMargin?: string;
  /** Rendered instead of the list when `items` is empty. */
  empty?: React.ReactNode;
  /** Rendered after the list (e.g. a load-more spinner). */
  footer?: React.ReactNode;
  /** Called once the final item nears the viewport — a hook for cursor pagination. */
  onEndReached?: () => void;
}

/**
 * LazyFlatList
 *
 * A layout-agnostic collection that lazily mounts item content as it scrolls
 * near the viewport, then keeps it mounted. Every slot reserves its space up
 * front (so scroll height is correct), but the expensive part of an item — an
 * authenticated image fetch, a heavy chart — does not run until the item is
 * about to be seen. This avoids the "load every image at once" stall on large
 * galleries without the reflow risk of unmounting offscreen items.
 *
 * You own the layout: pass your grid/flex classes via `className` and the
 * per-item box via `reserveClassName` (e.g. `aspect-[3/4]`).
 *
 * @example
 * ```tsx
 * <LazyFlatList
 *   items={images}
 *   keyExtractor={(img) => img.id}
 *   className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
 *   reserveClassName="aspect-[3/4]"
 *   renderItem={(img) => <ImageTile imageId={img.id} alt={img.alt} />}
 * />
 * ```
 */
export function LazyFlatList<T>({
  items,
  renderItem,
  keyExtractor,
  className,
  itemClassName,
  reserveClassName,
  estimatedItemHeight,
  renderPlaceholder,
  rootMargin = '600px',
  empty,
  footer,
  onEndReached,
}: LazyFlatListProps<T>) {
  if (items.length === 0 && empty !== undefined) {
    return <>{empty}</>;
  }

  return (
    <div className={className}>
      {items.map((item, index) => {
        const key = keyExtractor(item, index);
        return (
          <LazyItem
            key={key}
            rootMargin={rootMargin}
            className={cn(reserveClassName, itemClassName)}
            minHeight={reserveClassName ? undefined : estimatedItemHeight}
            placeholder={
              renderPlaceholder ? (
                renderPlaceholder(item, index)
              ) : (
                <div className='h-full w-full animate-pulse rounded-lg bg-muted' />
              )
            }
            onReveal={
              onEndReached && index === items.length - 1
                ? onEndReached
                : undefined
            }
          >
            {renderItem(item, index)}
          </LazyItem>
        );
      })}
      {footer}
    </div>
  );
}

interface LazyItemProps {
  children: React.ReactNode;
  placeholder: React.ReactNode;
  rootMargin: string;
  className?: string;
  minHeight?: number;
  onReveal?: () => void;
}

/** A single slot that mounts its children once it intersects (and stays mounted). */
function LazyItem({
  children,
  placeholder,
  rootMargin,
  className,
  minHeight,
  onReveal,
}: LazyItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (visible) return;
    const el = ref.current;
    if (!el) return;

    // Without IntersectionObserver (older/test environments), render eagerly.
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
            break;
          }
        }
      },
      { rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin, visible]);

  // Fire the end-reached hook once this (final) slot has been revealed.
  useEffect(() => {
    if (visible) onReveal?.();
  }, [visible, onReveal]);

  return (
    <div
      ref={ref}
      className={className}
      style={minHeight != null ? { minHeight } : undefined}
    >
      {visible ? children : placeholder}
    </div>
  );
}
