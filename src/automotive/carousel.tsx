import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '../index';
import { ui } from '@sudobility/design';

export interface CarouselProps {
  /** Carousel items */
  children: React.ReactNode[];
  /** Auto-play interval (ms) */
  autoPlay?: number;
  /** Show navigation arrows */
  showArrows?: boolean;
  /** Show indicators */
  showIndicators?: boolean;
  /** Loop slides */
  loop?: boolean;
  /** Additional className */
  className?: string;
  /** Optional tracking callback for navigation actions */
  onTrack?: (action: string) => void;
}

/**
 * Carousel Component
 *
 * Image/content carousel with auto-play and navigation.
 * Supports arrows, indicators, and looping.
 *
 * @example
 * ```tsx
 * <Carousel autoPlay={3000} loop>
 *   <img src="slide1.jpg" alt="Slide 1" />
 *   <img src="slide2.jpg" alt="Slide 2" />
 *   <img src="slide3.jpg" alt="Slide 3" />
 * </Carousel>
 * ```
 *
 * @example
 * ```tsx
 * <Carousel showArrows showIndicators>
 *   {slides.map(slide => (
 *     <div key={slide.id}>{slide.content}</div>
 *   ))}
 * </Carousel>
 * ```
 */
export const Carousel: React.FC<CarouselProps> = ({
  children,
  autoPlay,
  showArrows = true,
  showIndicators = true,
  loop = true,
  className,
  onTrack,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slides = React.Children.toArray(children);
  const totalSlides = slides.length;

  const goToPrevious = useCallback(() => {
    setCurrentIndex(prev => {
      if (prev === 0) {
        return loop ? totalSlides - 1 : prev;
      }
      return prev - 1;
    });
  }, [loop, totalSlides]);

  const goToNext = useCallback(() => {
    setCurrentIndex(prev => {
      if (prev === totalSlides - 1) {
        return loop ? 0 : prev;
      }
      return prev + 1;
    });
  }, [loop, totalSlides]);

  // Auto-play
  useEffect(() => {
    if (!autoPlay || totalSlides <= 1) return;

    const interval = setInterval(() => {
      goToNext();
    }, autoPlay);

    return () => clearInterval(interval);
  }, [autoPlay, totalSlides, goToNext]);

  const goToSlide = (index: number) => {
    onTrack?.('slide_select');
    setCurrentIndex(index);
  };

  const handlePrevious = () => {
    onTrack?.('previous_slide');
    goToPrevious();
  };

  const handleNext = () => {
    onTrack?.('next_slide');
    goToNext();
  };

  if (totalSlides === 0) {
    return null;
  }

  return (
    <div
      className={cn('relative overflow-hidden', ui.border.radius, className)}
    >
      {/* Slides */}
      <div
        className='flex transition-transform duration-500 ease-in-out'
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div key={index} className='min-w-full flex-shrink-0'>
            {slide}
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {showArrows && totalSlides > 1 && (
        <>
          <button
            onClick={handlePrevious}
            disabled={!loop && currentIndex === 0}
            className={cn(
              'absolute left-4 top-1/2 -translate-y-1/2',
              'w-10 h-10 rounded-full',
              'bg-background/80',
              'hover:bg-background',
              ui.states.disabled,
              'flex items-center justify-center',
              ui.transition.all,
              ui.shadow.lg
            )}
            aria-label='Previous slide'
          >
            <svg
              className='w-5 h-5 text-foreground'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M15 19l-7-7 7-7'
              />
            </svg>
          </button>

          <button
            onClick={handleNext}
            disabled={!loop && currentIndex === totalSlides - 1}
            className={cn(
              'absolute right-4 top-1/2 -translate-y-1/2',
              'w-10 h-10 rounded-full',
              'bg-background/80',
              'hover:bg-background',
              ui.states.disabled,
              'flex items-center justify-center',
              ui.transition.all,
              ui.shadow.lg
            )}
            aria-label='Next slide'
          >
            <svg
              className='w-5 h-5 text-foreground'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M9 5l7 7-7 7'
              />
            </svg>
          </button>
        </>
      )}

      {/* Indicators */}
      {showIndicators && totalSlides > 1 && (
        <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2'>
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                'w-2 h-2 rounded-full transition-all',
                index === currentIndex
                  ? 'w-8 bg-foreground'
                  : 'bg-foreground/50 hover:bg-foreground/75'
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
