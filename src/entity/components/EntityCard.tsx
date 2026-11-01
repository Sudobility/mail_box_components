/**
 * @fileoverview Entity Card Component
 * @description Card displaying entity information
 */

import { BuildingOffice2Icon, UserIcon } from '@heroicons/react/24/outline';
import type { EntityWithRole, EntityRole } from '@sudobility/types';
import { cn } from '../lib/utils';
import { colors } from '@sudobility/design';

/** Tracking data for EntityCard actions */
export interface EntityCardTrackingData {
  action: 'click';
  trackingLabel?: string;
  componentName?: string;
}

export interface EntityCardProps {
  /** Entity to display */
  entity: EntityWithRole;
  /** Whether this is the currently selected entity */
  isSelected?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Additional class names */
  className?: string;
  /** Optional tracking callback */
  onTrack?: (data: EntityCardTrackingData) => void;
  /** Optional tracking label */
  trackingLabel?: string;
  /** Optional component name for tracking */
  componentName?: string;
}

/**
 * Role badge colors
 */
const roleBadgeStyles: Record<EntityRole, string> = {
  owner: `${colors.component.badge.warning.base} ${colors.component.badge.warning.dark}`,
  manager: `${colors.component.badge.primary.base} ${colors.component.badge.primary.dark}`,
  member: `${colors.component.badge.default.base} ${colors.component.badge.default.dark}`,
};

/**
 * Card component for displaying an entity.
 */
export function EntityCard({
  entity,
  isSelected = false,
  onClick,
  className,
  onTrack,
  trackingLabel,
  componentName = 'EntityCard',
}: EntityCardProps) {
  const isPersonal = entity.entityType === 'personal';
  const Icon = isPersonal ? UserIcon : BuildingOffice2Icon;

  const handleClick = () => {
    onTrack?.({ action: 'click', trackingLabel, componentName });
    onClick?.();
  };

  return (
    <div
      onClick={onClick ? handleClick : undefined}
      className={cn(
        'rounded-lg border p-4 transition-all',
        onClick && 'cursor-pointer hover:border-primary',
        isSelected && 'border-primary bg-primary/5',
        !isSelected && 'border-border bg-card',
        className
      )}
    >
      <div className='flex items-start gap-3'>
        {/* Avatar/Icon */}
        <div
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-full',
            isPersonal
              ? `${colors.component.badge.primary.base} ${colors.component.badge.primary.dark}`
              : `${colors.component.badge.warning.base} ${colors.component.badge.warning.dark}`
          )}
        >
          {entity.avatarUrl ? (
            <img
              src={entity.avatarUrl}
              alt={entity.displayName}
              className='h-10 w-10 rounded-full object-cover'
            />
          ) : (
            <Icon
              className={cn(
                'h-5 w-5',
                isPersonal ? 'text-primary' : 'text-accent-foreground'
              )}
            />
          )}
        </div>

        {/* Content */}
        <div className='flex-1 min-w-0'>
          <div className='flex items-center gap-2'>
            <h3 className='font-medium text-foreground truncate'>
              {entity.displayName}
            </h3>
            <span
              className={cn(
                'text-xs px-2 py-0.5 rounded-full font-medium',
                roleBadgeStyles[entity.userRole]
              )}
            >
              {entity.userRole}
            </span>
          </div>
          <p className='text-sm text-muted-foreground'>
            {isPersonal ? 'Personal workspace' : 'Organization'}
          </p>
          {entity.description && (
            <p className='text-sm text-muted-foreground mt-1 line-clamp-2'>
              {entity.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
