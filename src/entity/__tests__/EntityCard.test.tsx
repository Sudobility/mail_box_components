import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EntityCard } from '../components/EntityCard';
import type { EntityWithRole } from '@sudobility/types';

describe('EntityCard', () => {
  const mockPersonalEntity: EntityWithRole = {
    id: 'personal-1',
    displayName: 'Personal Workspace',
    entityType: 'personal',
    userRole: 'manager',
    description: 'My personal workspace',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const mockOrgEntity: EntityWithRole = {
    id: 'org-1',
    displayName: 'Acme Corp',
    entityType: 'organization',
    userRole: 'owner',
    description: 'Our organization',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  it('renders personal entity correctly', () => {
    render(<EntityCard entity={mockPersonalEntity} />);

    expect(screen.getByText('Personal Workspace')).toBeInTheDocument();
    expect(screen.getByText('manager')).toBeInTheDocument();
    expect(screen.getByText('Personal workspace')).toBeInTheDocument();
  });

  it('renders organization entity correctly', () => {
    render(<EntityCard entity={mockOrgEntity} />);

    expect(screen.getByText('Acme Corp')).toBeInTheDocument();
    expect(screen.getByText('owner')).toBeInTheDocument();
    expect(screen.getByText('Organization')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(<EntityCard entity={mockPersonalEntity} />);

    expect(screen.getByText('My personal workspace')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const onClick = vi.fn();
    render(<EntityCard entity={mockPersonalEntity} onClick={onClick} />);

    fireEvent.click(screen.getByText('Personal Workspace').closest('div')!);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('applies selected styles when isSelected is true', () => {
    const { container } = render(
      <EntityCard entity={mockPersonalEntity} isSelected />
    );

    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('border-primary');
  });

  it('applies custom className', () => {
    const { container } = render(
      <EntityCard entity={mockPersonalEntity} className='custom-class' />
    );

    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('custom-class');
  });
});
