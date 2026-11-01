/**
 * @fileoverview Invitation List Component
 * @description List of pending invitations
 */

import {
  EnvelopeIcon,
  ClockIcon,
  XMarkIcon,
  CheckIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import type { EntityInvitation, EntityRole } from '@sudobility/types';
import { cn } from '../lib/utils';
import { colors } from '@sudobility/design';

/** Tracking data for InvitationList actions */
export interface InvitationListTrackingData {
  action: 'cancel' | 'accept' | 'decline';
  trackingLabel?: string;
  componentName?: string;
}

export interface InvitationListProps {
  /** Invitations to display */
  invitations: EntityInvitation[];
  /** Whether this is for entity admin (can cancel) or user (can accept/decline) */
  mode: 'admin' | 'user';
  /** Cancel invitation handler (admin mode) */
  onCancel?: (invitationId: string) => void;
  /** Accept invitation handler (user mode) */
  onAccept?: (token: string) => void;
  /** Decline invitation handler (user mode) */
  onDecline?: (token: string) => void;
  /** Whether data is loading */
  isLoading?: boolean;
  /** Empty state message */
  emptyMessage?: string;
  /** Additional class names */
  className?: string;
  /** Optional tracking callback */
  onTrack?: (data: InvitationListTrackingData) => void;
  /** Optional tracking label */
  trackingLabel?: string;
  /** Optional component name for tracking */
  componentName?: string;
}

/**
 * Role badge styles
 */
const roleBadgeStyles: Record<EntityRole, string> = {
  owner: `${colors.component.badge.warning.base} ${colors.component.badge.warning.dark}`,
  manager: `${colors.component.badge.primary.base} ${colors.component.badge.primary.dark}`,
  member: `${colors.component.badge.default.base} ${colors.component.badge.default.dark}`,
};

/**
 * List component for displaying invitations.
 */
export function InvitationList({
  invitations,
  mode,
  onCancel,
  onAccept,
  onDecline,
  isLoading = false,
  emptyMessage = 'No pending invitations',
  className,
  onTrack,
  trackingLabel,
  componentName = 'InvitationList',
}: InvitationListProps) {
  // Filter to only pending invitations
  const pendingInvitations = invitations.filter(
    inv => inv.status === 'pending'
  );

  if (isLoading) {
    return (
      <div className={cn('space-y-2', className)}>
        {[1, 2].map(i => (
          <div
            key={i}
            className='h-16 rounded-lg border border-border bg-muted animate-pulse'
          />
        ))}
      </div>
    );
  }

  if (pendingInvitations.length === 0) {
    return (
      <div className={cn('text-center py-8 text-muted-foreground', className)}>
        {emptyMessage}
      </div>
    );
  }

  const handleCancel = (invitationId: string) => {
    onTrack?.({ action: 'cancel', trackingLabel, componentName });
    onCancel?.(invitationId);
  };

  const handleAccept = (token: string) => {
    onTrack?.({ action: 'accept', trackingLabel, componentName });
    onAccept?.(token);
  };

  const handleDecline = (token: string) => {
    onTrack?.({ action: 'decline', trackingLabel, componentName });
    onDecline?.(token);
  };

  return (
    <div className={cn('divide-y divide-border rounded-lg border', className)}>
      {pendingInvitations.map(invitation => (
        <InvitationRow
          key={invitation.id}
          invitation={invitation}
          mode={mode}
          onCancel={onCancel ? handleCancel : undefined}
          onAccept={onAccept ? handleAccept : undefined}
          onDecline={onDecline ? handleDecline : undefined}
        />
      ))}
    </div>
  );
}

interface InvitationRowProps {
  invitation: EntityInvitation;
  mode: 'admin' | 'user';
  onCancel?: (invitationId: string) => void;
  onAccept?: (token: string) => void;
  onDecline?: (token: string) => void;
}

function InvitationRow({
  invitation,
  mode,
  onCancel,
  onAccept,
  onDecline,
}: InvitationRowProps) {
  const expiresAt = new Date(invitation.expiresAt);
  const isExpired = expiresAt < new Date();
  const daysUntilExpiry = Math.ceil(
    (expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className='flex items-center gap-3 p-3'>
      {/* Icon */}
      <div className='flex h-10 w-10 items-center justify-center rounded-full bg-muted'>
        <EnvelopeIcon className='h-5 w-5 text-muted-foreground' />
      </div>

      {/* Info */}
      <div className='flex-1 min-w-0'>
        <div className='flex items-center gap-2'>
          {mode === 'user' && invitation.entity ? (
            <p className='font-medium text-foreground truncate'>
              {invitation.entity.displayName}
            </p>
          ) : (
            <p className='font-medium text-foreground truncate'>
              {invitation.email}
            </p>
          )}
          <span
            className={cn(
              'text-xs px-2 py-0.5 rounded-full font-medium',
              roleBadgeStyles[invitation.role]
            )}
          >
            {invitation.role}
          </span>
        </div>
        <div className='flex items-center gap-1.5 text-sm text-muted-foreground'>
          <ClockIcon className='h-3.5 w-3.5' />
          {isExpired ? (
            <span className='text-destructive'>Expired</span>
          ) : (
            <span>Expires in {daysUntilExpiry} days</span>
          )}
        </div>
      </div>

      {/* Actions */}
      {mode === 'admin' && onCancel && (
        <button
          type='button'
          onClick={() => onCancel(invitation.id)}
          className={cn(
            'p-1.5 rounded hover:bg-destructive/10 text-muted-foreground',
            'hover:text-destructive transition-colors'
          )}
          title='Cancel invitation'
        >
          <XCircleIcon className='h-4 w-4' />
        </button>
      )}

      {mode === 'user' && (
        <div className='flex items-center gap-2'>
          {onDecline && (
            <button
              type='button'
              onClick={() => onDecline(invitation.token)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm',
                'border hover:bg-muted transition-colors'
              )}
            >
              <XMarkIcon className='h-4 w-4' />
              <span>Decline</span>
            </button>
          )}
          {onAccept && (
            <button
              type='button'
              onClick={() => onAccept(invitation.token)}
              disabled={isExpired}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm',
                'bg-primary text-primary-foreground',
                'hover:bg-primary/90 transition-colors',
                isExpired && 'opacity-50 cursor-not-allowed'
              )}
            >
              <CheckIcon className='h-4 w-4' />
              <span>Accept</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
