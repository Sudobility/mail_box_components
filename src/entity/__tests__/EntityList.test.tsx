import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EntityList } from '../components/EntityList';
import type { EntityWithRole } from '@sudobility/types';

describe('EntityList', () => {
  const mockEntities: EntityWithRole[] = [
    {
      id: 'personal-1',
      displayName: 'Personal Workspace',
      entityType: 'personal',
      entitySlug: 'personal-workspace',
      userRole: 'manager',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'org-1',
      displayName: 'Acme Corp',
      entityType: 'organization',
      entitySlug: 'acme-corp',
      userRole: 'owner',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  it('renders entities correctly', () => {
    render(<EntityList entities={mockEntities} />);

    expect(screen.getByText('Personal Workspace')).toBeInTheDocument();
    expect(screen.getByText('Acme Corp')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    const { container } = render(<EntityList entities={[]} isLoading />);

    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBe(3);
  });

  it('shows empty message when no entities', () => {
    render(<EntityList entities={[]} />);

    expect(screen.getByText('No workspaces found')).toBeInTheDocument();
  });

  it('shows custom empty message', () => {
    render(<EntityList entities={[]} emptyMessage='No entities available' />);

    expect(screen.getByText('No entities available')).toBeInTheDocument();
  });

  it('calls onSelect when entity is clicked', () => {
    const onSelect = vi.fn();
    render(<EntityList entities={mockEntities} onSelect={onSelect} />);

    fireEvent.click(screen.getByText('Acme Corp'));
    expect(onSelect).toHaveBeenCalledWith(mockEntities[1]);
  });

  it('marks selected entity correctly', () => {
    const { container } = render(
      <EntityList entities={mockEntities} selectedSlug='acme-corp' />
    );

    const cards = container.querySelectorAll('[class*="border-primary"]');
    expect(cards.length).toBeGreaterThan(0);
  });

  it('applies custom className', () => {
    const { container } = render(
      <EntityList entities={mockEntities} className='custom-class' />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });
});
