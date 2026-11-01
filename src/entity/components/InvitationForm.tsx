/**
 * @fileoverview Invitation Form Component
 * @description Form for inviting new members to an entity
 */

import { useState } from 'react';
import {
  EnvelopeIcon,
  PaperAirplaneIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { EntityRole, type InviteMemberRequest } from '@sudobility/types';
import { MemberRoleSelector } from './MemberRoleSelector';
import { cn } from '../lib/utils';

/** Tracking data for InvitationForm actions */
export interface InvitationFormTrackingData {
  action: 'submit';
  trackingLabel?: string;
  componentName?: string;
}

export interface InvitationFormProps {
  /** Submit handler */
  onSubmit: (request: InviteMemberRequest) => Promise<void>;
  /** Whether submission is in progress */
  isSubmitting?: boolean;
  /** Default role for new invitations */
  defaultRole?: EntityRole;
  /** Additional class names */
  className?: string;
  /** Optional tracking callback */
  onTrack?: (data: InvitationFormTrackingData) => void;
  /** Optional tracking label */
  trackingLabel?: string;
  /** Optional component name for tracking */
  componentName?: string;
}

/**
 * Form for inviting new members.
 */
export function InvitationForm({
  onSubmit,
  isSubmitting = false,
  defaultRole = EntityRole.MEMBER,
  className,
  onTrack,
  trackingLabel,
  componentName = 'InvitationForm',
}: InvitationFormProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<EntityRole>(defaultRole);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    onTrack?.({ action: 'submit', trackingLabel, componentName });

    try {
      await onSubmit({ email: email.trim(), role });
      setEmail('');
      setRole(defaultRole);
    } catch (err: any) {
      setError(err.message || 'Failed to send invitation');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-4', className)}>
      <div className='flex gap-2'>
        {/* Email Input */}
        <div className='relative flex-1'>
          <EnvelopeIcon className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
          <input
            type='email'
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder='Enter email address'
            disabled={isSubmitting}
            className={cn(
              'w-full pl-10 pr-3 py-2 rounded-lg border bg-background',
              'text-sm placeholder:text-muted-foreground',
              'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
              error && 'border-destructive focus:ring-destructive',
              isSubmitting && 'opacity-50 cursor-not-allowed'
            )}
          />
        </div>

        {/* Role Selector */}
        <MemberRoleSelector
          value={role}
          onChange={setRole}
          disabled={isSubmitting}
        />

        {/* Submit Button */}
        <button
          type='submit'
          disabled={isSubmitting || !email.trim()}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-lg',
            'bg-primary text-primary-foreground font-medium text-sm',
            'hover:bg-primary/90 transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
            (isSubmitting || !email.trim()) && 'opacity-50 cursor-not-allowed'
          )}
        >
          {isSubmitting ? (
            <ArrowPathIcon className='h-4 w-4 animate-spin' />
          ) : (
            <PaperAirplaneIcon className='h-4 w-4' />
          )}
          <span className='hidden sm:inline'>Invite</span>
        </button>
      </div>

      {/* Error Message */}
      {error && <p className='text-sm text-destructive'>{error}</p>}
    </form>
  );
}

/**
 * Validate email format
 */
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
