import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { InvitationList } from '../components/InvitationList';
import type { EntityInvitation } from '@sudobility/types';

describe('InvitationList', () => {
  const futureDate = new Date(
    Date.now() + 7 * 24 * 60 * 60 * 1000
  ).toISOString();
  const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const mockInvitations: EntityInvitation[] = [
    {
      id: 'inv-1',
      email: 'user1@example.com',
      role: 'manager',
      status: 'pending',
      token: 'token-1',
      expiresAt: futureDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      entityId: 'entity-1',
      invitedByUserId: 'user-0',
      acceptedAt: null,
    },
    {
      id: 'inv-2',
      email: 'user2@example.com',
      role: 'member',
      status: 'pending',
      token: 'token-2',
      expiresAt: futureDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      entityId: 'entity-1',
      invitedByUserId: 'user-0',
      acceptedAt: null,
    },
  ];

  describe('admin mode', () => {
    it('renders pending invitations with email', () => {
      render(<InvitationList invitations={mockInvitations} mode='admin' />);

      expect(screen.getByText('user1@example.com')).toBeInTheDocument();
      expect(screen.getByText('user2@example.com')).toBeInTheDocument();
    });

    it('shows cancel button in admin mode', () => {
      const onCancel = vi.fn();
      render(
        <InvitationList
          invitations={mockInvitations}
          mode='admin'
          onCancel={onCancel}
        />
      );

      const cancelButtons = screen.getAllByTitle('Cancel invitation');
      expect(cancelButtons.length).toBe(2);
    });

    it('calls onCancel with invitation id', () => {
      const onCancel = vi.fn();
      render(
        <InvitationList
          invitations={mockInvitations}
          mode='admin'
          onCancel={onCancel}
        />
      );

      const cancelButtons = screen.getAllByTitle('Cancel invitation');
      fireEvent.click(cancelButtons[0]);

      expect(onCancel).toHaveBeenCalledWith('inv-1');
    });
  });

  describe('user mode', () => {
    const invitationsWithEntity: EntityInvitation[] = mockInvitations.map(
      inv => ({
        ...inv,
        entity: {
          id: 'entity-1',
          displayName: 'Acme Corp',
          entityType: 'organization' as const,
        },
      })
    );

    it('renders entity name in user mode', () => {
      render(
        <InvitationList invitations={invitationsWithEntity} mode='user' />
      );

      expect(screen.getAllByText('Acme Corp').length).toBe(2);
    });

    it('shows accept and decline buttons', () => {
      render(
        <InvitationList
          invitations={invitationsWithEntity}
          mode='user'
          onAccept={vi.fn()}
          onDecline={vi.fn()}
        />
      );

      expect(screen.getAllByText('Accept').length).toBe(2);
      expect(screen.getAllByText('Decline').length).toBe(2);
    });

    it('calls onAccept with token', () => {
      const onAccept = vi.fn();
      render(
        <InvitationList
          invitations={invitationsWithEntity}
          mode='user'
          onAccept={onAccept}
          onDecline={vi.fn()}
        />
      );

      const acceptButtons = screen.getAllByText('Accept');
      fireEvent.click(acceptButtons[0]);

      expect(onAccept).toHaveBeenCalledWith('token-1');
    });

    it('calls onDecline with token', () => {
      const onDecline = vi.fn();
      render(
        <InvitationList
          invitations={invitationsWithEntity}
          mode='user'
          onAccept={vi.fn()}
          onDecline={onDecline}
        />
      );

      const declineButtons = screen.getAllByText('Decline');
      fireEvent.click(declineButtons[0]);

      expect(onDecline).toHaveBeenCalledWith('token-1');
    });
  });

  describe('states', () => {
    it('shows loading state', () => {
      const { container } = render(
        <InvitationList invitations={[]} mode='admin' isLoading />
      );

      const skeletons = container.querySelectorAll('.animate-pulse');
      expect(skeletons.length).toBe(2);
    });

    it('shows empty message when no invitations', () => {
      render(<InvitationList invitations={[]} mode='admin' />);

      expect(screen.getByText('No pending invitations')).toBeInTheDocument();
    });

    it('shows custom empty message', () => {
      render(
        <InvitationList
          invitations={[]}
          mode='admin'
          emptyMessage='No invites yet'
        />
      );

      expect(screen.getByText('No invites yet')).toBeInTheDocument();
    });

    it('filters out non-pending invitations', () => {
      const mixedInvitations: EntityInvitation[] = [
        ...mockInvitations,
        {
          id: 'inv-3',
          email: 'user3@example.com',
          role: 'owner',
          status: 'accepted',
          token: 'token-3',
          expiresAt: futureDate,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          entityId: 'entity-1',
          invitedByUserId: 'user-0',
          acceptedAt: new Date().toISOString(),
        },
      ];

      render(<InvitationList invitations={mixedInvitations} mode='admin' />);

      expect(screen.getByText('user1@example.com')).toBeInTheDocument();
      expect(screen.getByText('user2@example.com')).toBeInTheDocument();
      expect(screen.queryByText('user3@example.com')).not.toBeInTheDocument();
    });

    it('shows expired status for expired invitations', () => {
      const expiredInvitation: EntityInvitation[] = [
        {
          ...mockInvitations[0],
          expiresAt: pastDate,
        },
      ];

      render(<InvitationList invitations={expiredInvitation} mode='admin' />);

      expect(screen.getByText('Expired')).toBeInTheDocument();
    });
  });
});
