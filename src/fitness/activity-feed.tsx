import React from 'react';
import { cn } from '../index';
import { colors, ui } from '@sudobility/design';

export interface ActivityItem {
  id: string;
  user: string;
  action: string;
  target?: string;
  timestamp: string;
  avatar?: string;
  icon?: React.ReactNode;
}

export interface ActivityFeedProps {
  /** Activity items */
  items: ActivityItem[];
  /** Max items to show */
  maxItems?: number;
  /** Show avatars */
  showAvatars?: boolean;
  /** Additional className */
  className?: string;
}

/**
 * ActivityFeed Component
 *
 * Activity feed widget for dashboards.
 * Displays recent user actions and events.
 *
 * @example
 * ```tsx
 * <ActivityFeed
 *   items={[
 *     { id: '1', user: 'John', action: 'created', target: 'new project', timestamp: '2 min ago' },
 *     { id: '2', user: 'Jane', action: 'commented on', target: 'issue #123', timestamp: '5 min ago' }
 *   ]}
 *   maxItems={5}
 *   showAvatars
 * />
 * ```
 */
export const ActivityFeed: React.FC<ActivityFeedProps> = ({
  items,
  maxItems = 10,
  showAvatars = true,
  className,
}) => {
  const displayItems = items.slice(0, maxItems);

  return (
    <div
      className={cn(
        'rounded-lg border p-6',
        colors.component.card.default.base,
        colors.component.card.default.dark,
        className
      )}
    >
      <h3 className={cn(ui.text.h5, 'mb-4')}>Recent Activity</h3>

      <div className='space-y-4'>
        {displayItems.map(item => (
          <div key={item.id} className='flex gap-3'>
            {showAvatars && (
              <div className='flex-shrink-0'>
                {item.avatar ? (
                  <img
                    src={item.avatar}
                    alt={item.user}
                    className='w-10 h-10 rounded-full'
                  />
                ) : (
                  <div
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground font-semibold',
                      ui.background.muted
                    )}
                  >
                    {item.user.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            )}

            <div className='flex-1 min-w-0'>
              <p className={cn('text-sm', ui.text.emphasis)}>
                <span className='font-semibold'>{item.user}</span>{' '}
                <span className={ui.text.muted}>{item.action}</span>{' '}
                {item.target && (
                  <span className='font-medium'>{item.target}</span>
                )}
              </p>
              <p className={cn('text-xs mt-1', ui.text.muted)}>
                {item.timestamp}
              </p>
            </div>

            {item.icon && (
              <div className='flex-shrink-0 text-muted-foreground'>
                {item.icon}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
