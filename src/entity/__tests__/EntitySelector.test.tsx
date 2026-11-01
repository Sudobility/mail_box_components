import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EntitySelector } from '../components/EntitySelector';
import type { EntityWithRole } from '@sudobility/types';

describe('EntitySelector', () => {
  const mockEntities: EntityWithRole[] = [
    {
      id: 'personal-1',
      displayName: 'Personal Workspace',
      entityType: 'personal',
      userRole: 'manager',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'org-1',
      displayName: 'Acme Corp',
      entityType: 'organization',
      userRole: 'owner',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  it('renders with placeholder when no entity selected', () => {
    render(
      <EntitySelector
        entities={mockEntities}
        currentEntity={null}
        onSelect={vi.fn()}
      />
    );

    expect(screen.getByText('Select workspace')).toBeInTheDocument();
  });

  it('renders current entity name when selected', () => {
    render(
      <EntitySelector
        entities={mockEntities}
        currentEntity={mockEntities[0]}
        onSelect={vi.fn()}
      />
    );

    expect(screen.getByText('Personal Workspace')).toBeInTheDocument();
  });

  it('opens dropdown on click', () => {
    render(
      <EntitySelector
        entities={mockEntities}
        currentEntity={mockEntities[0]}
        onSelect={vi.fn()}
      />
    );

    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Acme Corp')).toBeInTheDocument();
  });

  it('calls onSelect when entity is selected', () => {
    const onSelect = vi.fn();
    render(
      <EntitySelector
        entities={mockEntities}
        currentEntity={mockEntities[0]}
        onSelect={onSelect}
      />
    );

    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText('Acme Corp'));

    expect(onSelect).toHaveBeenCalledWith(mockEntities[1]);
  });

  it('shows create button when onCreateNew is provided', () => {
    render(
      <EntitySelector
        entities={mockEntities}
        currentEntity={mockEntities[0]}
        onSelect={vi.fn()}
        onCreateNew={vi.fn()}
      />
    );

    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Create organization')).toBeInTheDocument();
  });

  it('calls onCreateNew when create button is clicked', () => {
    const onCreateNew = vi.fn();
    render(
      <EntitySelector
        entities={mockEntities}
        currentEntity={mockEntities[0]}
        onSelect={vi.fn()}
        onCreateNew={onCreateNew}
      />
    );

    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText('Create organization'));

    expect(onCreateNew).toHaveBeenCalled();
  });

  it('is disabled when isLoading is true', () => {
    render(
      <EntitySelector
        entities={mockEntities}
        currentEntity={mockEntities[0]}
        onSelect={vi.fn()}
        isLoading
      />
    );

    expect(screen.getByRole('button')).toBeDisabled();
  });
});
