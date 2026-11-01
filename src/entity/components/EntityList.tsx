/**
 * @fileoverview Entity List Component
 * @description List of entities with selection support
 */

import type { EntityWithRole } from '@sudobility/types';
import { EntityCard, type EntityCardTrackingData } from './EntityCard';
import { cn } from '../lib/utils';

/** Tracking data for EntityList actions */
export interface EntityListTrackingData {
  action: 'select';
  trackingLabel?: string;
  componentName?: string;
}

export interface EntityListProps {
  /** Entities to display */
  entities: EntityWithRole[];
  /** Currently selected entity slug */
  selectedSlug?: string | null;
  /** Selection handler */
  onSelect?: (entity: EntityWithRole) => void;
  /** Whether data is loading */
  isLoading?: boolean;
  /** Empty state message */
  emptyMessage?: string;
  /** Additional class names */
  className?: string;
  /** Optional tracking callback */
  onTrack?: (data: EntityListTrackingData | EntityCardTrackingData) => void;
  /** Optional tracking label */
  trackingLabel?: string;
  /** Optional component name for tracking */
  componentName?: string;
}

/**
 * List component for displaying multiple entities.
 */
export function EntityList({
  entities,
  selectedSlug,
  onSelect,
  isLoading = false,
  emptyMessage = 'No workspaces found',
  className,
  onTrack,
  trackingLabel,
  componentName = 'EntityList',
}: EntityListProps) {
  if (isLoading) {
    return (
      <div className={cn('space-y-3', className)}>
        {[1, 2, 3].map(i => (
          <div
            key={i}
            className='h-24 rounded-lg border border-border bg-muted animate-pulse'
          />
        ))}
      </div>
    );
  }

  if (entities.length === 0) {
    return (
      <div className={cn('text-center py-8 text-muted-foreground', className)}>
        {emptyMessage}
      </div>
    );
  }

  const handleSelect = (entity: EntityWithRole) => {
    onTrack?.({ action: 'select', trackingLabel, componentName });
    onSelect?.(entity);
  };

  return (
    <div className={cn('space-y-3', className)}>
      {entities.map(entity => (
        <EntityCard
          key={entity.id}
          entity={entity}
          isSelected={entity.entitySlug === selectedSlug}
          onClick={onSelect ? () => handleSelect(entity) : undefined}
          onTrack={onTrack}
          trackingLabel={trackingLabel}
        />
      ))}
    </div>
  );
}
