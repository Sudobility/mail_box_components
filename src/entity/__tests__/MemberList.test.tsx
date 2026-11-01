import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemberList } from '../components/MemberList';
import type { EntityMember } from '@sudobility/types';

describe('MemberList', () => {
  const mockMembers: EntityMember[] = [
    {
      id: 'member-1',
      userId: 'user-1',
      entityId: 'entity-1',
      role: 'owner',
      isActive: true,
      joinedAt: new Date().toISOString(),
      user: {
        id: 'user-1',
        displayName: 'John Doe',
        email: 'john@example.com',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'member-2',
      userId: 'user-2',
      entityId: 'entity-1',
      role: 'manager',
      isActive: true,
      joinedAt: new Date().toISOString(),
      user: {
        id: 'user-2',
        displayName: 'Jane Smith',
        email: 'jane@example.com',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  it('renders members correctly', () => {
    render(<MemberList members={mockMembers} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
  });

  it('shows role badges', () => {
    render(<MemberList members={mockMembers} />);

    expect(screen.getByText('owner')).toBeInTheDocument();
    expect(screen.getByText('manager')).toBeInTheDocument();
  });

  it('shows (you) indicator for current user', () => {
    render(<MemberList members={mockMembers} currentUserId='user-1' />);

    expect(screen.getByText('(you)')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    const { container } = render(<MemberList members={[]} isLoading />);

    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBe(3);
  });

  it('shows empty message when no members', () => {
    render(<MemberList members={[]} />);

    expect(screen.getByText('No members found')).toBeInTheDocument();
  });

  it('shows custom empty message', () => {
    render(<MemberList members={[]} emptyMessage='No team members' />);

    expect(screen.getByText('No team members')).toBeInTheDocument();
  });

  describe('management mode', () => {
    it('shows remove button for other members when canManage', () => {
      const onRemove = vi.fn();
      render(
        <MemberList
          members={mockMembers}
          currentUserId='user-1'
          canManage
          onRemove={onRemove}
        />
      );

      // Should only show remove button for non-self members
      const removeButtons = screen.getAllByTitle('Remove member');
      expect(removeButtons.length).toBe(1);
    });

    it('calls onRemove with member userId', () => {
      const onRemove = vi.fn();
      render(
        <MemberList
          members={mockMembers}
          currentUserId='user-1'
          canManage
          onRemove={onRemove}
        />
      );

      const removeButton = screen.getByTitle('Remove member');
      fireEvent.click(removeButton);

      expect(onRemove).toHaveBeenCalledWith('user-2');
    });

    it('does not show remove button for self', () => {
      render(
        <MemberList
          members={mockMembers}
          currentUserId='user-1'
          canManage
          onRemove={vi.fn()}
        />
      );

      // Only one remove button (for user-2, not user-1)
      const removeButtons = screen.getAllByTitle('Remove member');
      expect(removeButtons.length).toBe(1);
    });

    it('shows role selector for other members when canManage', () => {
      const onRoleChange = vi.fn();
      render(
        <MemberList
          members={mockMembers}
          currentUserId='user-1'
          canManage
          onRoleChange={onRoleChange}
        />
      );

      // Should see role selector for user-2
      const managerButton = screen.getByText('Manager');
      expect(managerButton).toBeInTheDocument();
    });
  });

  it('handles member without display name', () => {
    const memberWithoutName: EntityMember[] = [
      {
        id: 'member-1',
        userId: 'user-1',
        entityId: 'entity-1',
        role: 'member',
        isActive: true,
        joinedAt: new Date().toISOString(),
        user: {
          id: 'user-1',
          email: 'noname@example.com',
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    render(<MemberList members={memberWithoutName} />);

    // Email appears twice: once as display name fallback and once as email
    const emailElements = screen.getAllByText('noname@example.com');
    expect(emailElements.length).toBe(2);
  });
});
