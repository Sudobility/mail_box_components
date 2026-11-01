/**
 * @fileoverview Entity Selector Component
 * @description Dropdown selector for switching between entities
 */

import { useState } from 'react';
import {
  ChevronDownIcon,
  BuildingOffice2Icon,
  UserIcon,
  PlusIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import type { EntityWithRole } from '@sudobility/types';
import { cn } from '../lib/utils';

/** Tracking data for EntitySelector actions */
export interface EntitySelectorTrackingData {
  action: 'toggle' | 'select' | 'create_new';
  trackingLabel?: string;
  componentName?: string;
}

export interface EntitySelectorProps {
  /** Available entities */
  entities: EntityWithRole[];
  /** Currently selected entity */
  currentEntity: EntityWithRole | null;
  /** Selection handler */
  onSelect: (entity: EntityWithRole) => void;
  /** Handler for creating a new organization */
  onCreateNew?: () => void;
  /** Whether data is loading */
  isLoading?: boolean;
  /** Additional class names */
  className?: string;
  /** Optional tracking callback */
  onTrack?: (data: EntitySelectorTrackingData) => void;
  /** Optional tracking label */
  trackingLabel?: string;
  /** Optional component name for tracking */
  componentName?: string;
}

/**
 * Dropdown selector for switching between entities.
 */
export function EntitySelector({
  entities,
  currentEntity,
  onSelect,
  onCreateNew,
  isLoading = false,
  className,
  onTrack,
  trackingLabel,
  componentName = 'EntitySelector',
}: EntitySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    onTrack?.({ action: 'toggle', trackingLabel, componentName });
    setIsOpen(!isOpen);
  };

  const handleSelect = (entity: EntityWithRole) => {
    onTrack?.({ action: 'select', trackingLabel, componentName });
    onSelect(entity);
    setIsOpen(false);
  };

  const handleCreateNew = () => {
    onTrack?.({ action: 'create_new', trackingLabel, componentName });
    onCreateNew?.();
    setIsOpen(false);
  };

  return (
    <div className={cn('relative', className)}>
      {/* Trigger Button */}
      <button
        type='button'
        onClick={handleToggle}
        disabled={isLoading}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-lg border',
          'bg-background hover:bg-muted transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
          isLoading && 'opacity-50 cursor-not-allowed'
        )}
      >
        {currentEntity ? (
          <>
            {currentEntity.entityType === 'personal' ? (
              <UserIcon className='h-4 w-4 text-primary' />
            ) : (
              <BuildingOffice2Icon className='h-4 w-4 text-accent-foreground' />
            )}
            <span className='font-medium text-sm truncate max-w-[150px]'>
              {currentEntity.displayName}
            </span>
          </>
        ) : (
          <span className='text-sm text-muted-foreground'>
            Select workspace
          </span>
        )}
        <ChevronDownIcon
          className={cn(
            'h-4 w-4 text-muted-foreground transition-transform',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className='fixed inset-0 z-40'
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div
            className={cn(
              'absolute top-full left-0 mt-1 z-50',
              'min-w-[220px] rounded-lg border bg-popover shadow-lg',
              'animate-in fade-in-0 zoom-in-95'
            )}
          >
            <div className='p-1'>
              {/* Personal entities */}
              {entities
                .filter(e => e.entityType === 'personal')
                .map(entity => (
                  <EntityMenuItem
                    key={entity.id}
                    entity={entity}
                    isSelected={entity.id === currentEntity?.id}
                    onClick={() => handleSelect(entity)}
                  />
                ))}

              {/* Divider */}
              {entities.some(e => e.entityType === 'personal') &&
                entities.some(e => e.entityType === 'organization') && (
                  <div className='my-1 h-px bg-border' />
                )}

              {/* Organization entities */}
              {entities
                .filter(e => e.entityType === 'organization')
                .map(entity => (
                  <EntityMenuItem
                    key={entity.id}
                    entity={entity}
                    isSelected={entity.id === currentEntity?.id}
                    onClick={() => handleSelect(entity)}
                  />
                ))}

              {/* Create new */}
              {onCreateNew && (
                <>
                  <div className='my-1 h-px bg-border' />
                  <button
                    type='button'
                    onClick={handleCreateNew}
                    className={cn(
                      'flex items-center gap-2 w-full px-2 py-1.5 rounded',
                      'text-sm text-primary hover:bg-muted transition-colors'
                    )}
                  >
                    <PlusIcon className='h-4 w-4' />
                    <span>Create organization</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

interface EntityMenuItemProps {
  entity: EntityWithRole;
  isSelected: boolean;
  onClick: () => void;
}

function EntityMenuItem({ entity, isSelected, onClick }: EntityMenuItemProps) {
  const isPersonal = entity.entityType === 'personal';
  const Icon = isPersonal ? UserIcon : BuildingOffice2Icon;

  return (
    <button
      type='button'
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 w-full px-2 py-1.5 rounded',
        'text-sm transition-colors',
        isSelected
          ? 'bg-primary/10 text-primary'
          : 'hover:bg-muted text-foreground'
      )}
    >
      <Icon
        className={cn(
          'h-4 w-4',
          isPersonal ? 'text-primary' : 'text-accent-foreground'
        )}
      />
      <span className='flex-1 text-left truncate'>{entity.displayName}</span>
      {isSelected && <CheckIcon className='h-4 w-4' />}
    </button>
  );
}
