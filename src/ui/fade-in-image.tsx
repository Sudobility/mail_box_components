import React, { useEffect, useRef, useState } from 'react';
import { cn } from '../lib/utils';

export interface FadeInImageProps extends Omit<
  React.ImgHTMLAttributes<HTMLImageElement>,
  'src'
> {
  /**
   * Image source. May be `null`/`undefined` while the URL is still being
   * prepared asynchronously (e.g. an authenticated fetch producing an object
   * URL) — the component shows its skeleton until a source is set and decoded.
   */
  src?: string | null;
  /** Alt text (required for accessibility). */
  alt: string;
  /** Fade duration in milliseconds. Default 400. */
  durationMs?: number;
  /** Show a pulsing skeleton behind the image until it has loaded. Default true. */
  showSkeleton?: boolean;
  /** Class for the positioning wrapper (defaults to filling its parent). */
  wrapperClassName?: string;
  /** Class for the skeleton placeholder. */
  skeletonClassName?: string;
  /** Called once the image has decoded and the fade has been triggered. */
  onLoaded?: () => void;
}

/**
 * FadeInImage
 *
 * An `<img>` that fades in once it has decoded, with an optional skeleton
 * placeholder underneath while it loads. Designed for images whose bytes are
 * resolved asynchronously (object URLs from authenticated fetches, lazily
 * mounted tiles, etc.) so the swap from "loading" to "loaded" is smooth rather
 * than a hard pop.
 *
 * Cached images (where the browser fires no `load` event) are detected via the
 * element's `complete` flag so they still fade/appear immediately.
 *
 * @example
 * ```tsx
 * <FadeInImage src={objectUrl} alt="Portrait" className="object-cover" />
 * ```
 */
export const FadeInImage: React.FC<FadeInImageProps> = ({
  src,
  alt,
  durationMs = 400,
  showSkeleton = true,
  wrapperClassName,
  skeletonClassName,
  onLoaded,
  className,
  style,
  ...imgProps
}) => {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Reset the faded-in state whenever the source changes so the next image
  // fades in from scratch rather than appearing instantly.
  useEffect(() => {
    setLoaded(false);
  }, [src]);

  // A cached image can finish loading before React attaches `onLoad`, so the
  // event never fires. Detect that synchronously via `complete`.
  useEffect(() => {
    if (!src) return;
    const el = imgRef.current;
    if (el && el.complete && el.naturalWidth > 0) {
      setLoaded(true);
      onLoaded?.();
    }
  }, [src, onLoaded]);

  const handleLoad = () => {
    setLoaded(true);
    onLoaded?.();
  };

  return (
    <div
      className={cn('relative h-full w-full overflow-hidden', wrapperClassName)}
    >
      {showSkeleton && !loaded && (
        <div
          aria-hidden='true'
          className={cn(
            'absolute inset-0 animate-pulse bg-muted',
            skeletonClassName
          )}
        />
      )}
      {src && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          onLoad={handleLoad}
          className={cn(
            'h-full w-full',
            'transition-opacity ease-out',
            loaded ? 'opacity-100' : 'opacity-0',
            className
          )}
          style={{ transitionDuration: `${durationMs}ms`, ...style }}
          {...imgProps}
        />
      )}
    </div>
  );
};
