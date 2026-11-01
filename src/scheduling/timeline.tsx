import React from 'react';
import { cn } from '../index';
import { ui, getStatusIndicatorColor } from '@sudobility/design';

export interface TimelineItem {
  /** Item ID */
  id: string;
  /** Item title */
  title: React.ReactNode;
  /** Item description */
  description?: React.ReactNode;
  /** Item timestamp */
  timestamp?: string;
  /** Item icon */
  icon?: React.ReactNode;
  /** Item status */
  status?: 'completed' | 'active' | 'pending' | 'error';
}

export interface TimelineProps {
  /** Timeline items */
  items: TimelineItem[];
  /** Orientation */
  orientation?: 'vertical' | 'horizontal';
  /** Additional className */
  className?: string;
}

/**
 * Timeline Component
 *
 * Chronological timeline for events and activities.
 * Supports vertical and horizontal orientations.
 *
 * @example
 * ```tsx
 * <Timeline
 *   items={[
 *     { id: '1', title: 'Project Started', timestamp: '2024-01-01', status: 'completed' },
 *     { id: '2', title: 'In Progress', description: 'Working on features', status: 'active' },
 *     { id: '3', title: 'Pending Review', status: 'pending' }
 *   ]}
 * />
 * ```
 *
 * @example
 * ```tsx
 * <Timeline
 *   items={events}
 *   orientation="horizontal"
 * />
 * ```
 */
export const Timeline: React.FC<TimelineProps> = ({
  items,
  orientation = 'vertical',
  className,
}) => {
  // Status color configurations using design system
  const statusColors = {
    completed: `${getStatusIndicatorColor('success')} border-success`,
    active: `${getStatusIndicatorColor('info')} border-primary`,
    pending: 'bg-muted dark:bg-muted border-border',
    error: `${getStatusIndicatorColor('error')} border-destructive`,
  };

  const statusIconColors = {
    completed: 'text-success-foreground',
    active: 'text-primary-foreground',
    pending: ui.text.muted,
    error: 'text-destructive-foreground',
  };

  if (orientation === 'horizontal') {
    return (
      <div className={cn('w-full overflow-x-auto', className)}>
        <div className='flex items-start min-w-max px-4'>
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            const status = item.status || 'pending';

            return (
              <React.Fragment key={item.id}>
                {/* Item */}
                <div className='flex flex-col items-center'>
                  {/* Icon/Dot */}
                  <div
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center border-2',
                      statusColors[status]
                    )}
                  >
                    {item.icon ? (
                      <span className={cn('w-5 h-5', statusIconColors[status])}>
                        {item.icon}
                      </span>
                    ) : status === 'completed' ? (
                      <svg
                        className='w-5 h-5 text-success-foreground'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={3}
                          d='M5 13l4 4L19 7'
                        />
                      </svg>
                    ) : null}
                  </div>

                  {/* Content */}
                  <div className='mt-4 text-center max-w-[200px]'>
                    <p className={cn('text-sm', ui.text.emphasis)}>
                      {item.title}
                    </p>
                    {item.description && (
                      <p className={cn('text-xs mt-1', ui.text.bodySmall)}>
                        {item.description}
                      </p>
                    )}
                    {item.timestamp && (
                      <p className={cn('text-xs mt-1', ui.text.muted)}>
                        {item.timestamp}
                      </p>
                    )}
                  </div>
                </div>

                {/* Connector Line */}
                {!isLast && (
                  <div
                    className={cn(
                      'flex-shrink-0 w-16 h-0.5 mt-5 mx-2 relative',
                      ui.background.muted
                    )}
                  >
                    <div
                      className={cn(
                        'absolute left-0 top-0 h-full transition-all duration-300',
                        status === 'completed' ? 'w-full bg-success' : 'w-0'
                      )}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  }

  // Vertical orientation
  return (
    <div className={cn('w-full', className)}>
      <div className='space-y-4'>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const status = item.status || 'pending';

          return (
            <div key={item.id} className='flex gap-4'>
              {/* Icon/Dot column */}
              <div className='flex flex-col items-center'>
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center border-2 flex-shrink-0',
                    statusColors[status]
                  )}
                >
                  {item.icon ? (
                    <span className={cn('w-5 h-5', statusIconColors[status])}>
                      {item.icon}
                    </span>
                  ) : status === 'completed' ? (
                    <svg
                      className='w-5 h-5 text-success-foreground'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={3}
                        d='M5 13l4 4L19 7'
                      />
                    </svg>
                  ) : null}
                </div>

                {/* Connector Line */}
                {!isLast && (
                  <div
                    className={cn(
                      'w-0.5 flex-1 min-h-[32px] relative mt-2',
                      ui.background.muted
                    )}
                  >
                    <div
                      className={cn(
                        'absolute top-0 left-0 w-full transition-all duration-300',
                        status === 'completed' ? 'h-full bg-success' : 'h-0'
                      )}
                    />
                  </div>
                )}
              </div>

              {/* Content column */}
              <div className='flex-1 pb-4'>
                <div className='flex items-start justify-between'>
                  <div className='flex-1'>
                    <p className={cn('text-sm', ui.text.emphasis)}>
                      {item.title}
                    </p>
                    {item.description && (
                      <p className={cn('text-sm mt-1', ui.text.bodySmall)}>
                        {item.description}
                      </p>
                    )}
                  </div>
                  {item.timestamp && (
                    <p
                      className={cn(
                        'text-xs ml-4 flex-shrink-0',
                        ui.text.muted
                      )}
                    >
                      {item.timestamp}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
