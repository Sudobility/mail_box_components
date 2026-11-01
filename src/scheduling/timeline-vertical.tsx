import React from 'react';
import { cn } from '../index';
import { colors, ui, textVariants } from '@sudobility/design';

export interface TimelineEvent {
  id: string;
  title: string;
  description?: string;
  timestamp?: string;
  icon?: React.ReactNode;
  color?: string;
}

export interface TimelineVerticalProps {
  /** Timeline events */
  events: TimelineEvent[];
  /** Align timeline */
  align?: 'left' | 'center' | 'right';
  /** Show connectors */
  showConnectors?: boolean;
  /** Additional className */
  className?: string;
}

/**
 * TimelineVertical Component
 *
 * Vertical timeline for displaying chronological events.
 * Shows events with connecting lines and optional icons.
 *
 * @example
 * ```tsx
 * <TimelineVertical
 *   events={[
 *     { id: '1', title: 'Order placed', timestamp: '2 hours ago' },
 *     { id: '2', title: 'Processing', timestamp: '1 hour ago' },
 *     { id: '3', title: 'Shipped', timestamp: '30 min ago' }
 *   ]}
 *   align="left"
 * />
 * ```
 */
export const TimelineVertical: React.FC<TimelineVerticalProps> = ({
  events,
  align = 'left',
  showConnectors = true,
  className,
}) => {
  return (
    <div className={cn('relative', className)}>
      {events.map((event, index) => {
        const isLast = index === events.length - 1;
        const color = event.color || colors.raw.blue[500];

        return (
          <div
            key={event.id}
            className={cn(
              'relative flex gap-4 pb-8',
              align === 'center' && 'justify-center',
              align === 'right' && 'justify-end'
            )}
          >
            {/* Connector line */}
            {showConnectors && !isLast && (
              <div
                className='absolute left-4 top-8 w-0.5 h-full bg-muted'
                style={
                  align === 'center'
                    ? { left: '50%' }
                    : align === 'right'
                      ? { right: '2rem' }
                      : undefined
                }
              />
            )}

            {/* Icon/Dot */}
            <div className='relative z-10 flex-shrink-0'>
              {event.icon ? (
                <div
                  // intentional: white icon for contrast on dynamic per-event color
                  className='w-8 h-8 rounded-full flex items-center justify-center text-white'
                  style={{ backgroundColor: color }}
                >
                  {event.icon}
                </div>
              ) : (
                <div
                  className='w-4 h-4 rounded-full border-4 border-background '
                  style={{ backgroundColor: color }}
                />
              )}
            </div>

            {/* Content */}
            <div className='flex-1 min-w-0'>
              <div className='flex items-center gap-3 mb-1'>
                <h4 className={textVariants.heading.h6()}>{event.title}</h4>
                {event.timestamp && (
                  <span className={cn('text-xs', ui.text.bodySmall)}>
                    {event.timestamp}
                  </span>
                )}
              </div>
              {event.description && (
                <p className={cn('text-sm', ui.text.bodySmall)}>
                  {event.description}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
