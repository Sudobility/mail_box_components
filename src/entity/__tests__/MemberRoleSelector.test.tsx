import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemberRoleSelector } from '../components/MemberRoleSelector';
import { EntityRole } from '@sudobility/types';

describe('MemberRoleSelector', () => {
  it('renders current role', () => {
    render(
      <MemberRoleSelector value={EntityRole.MANAGER} onChange={vi.fn()} />
    );

    expect(screen.getByText('Manager')).toBeInTheDocument();
  });

  it('opens dropdown on click', () => {
    render(<MemberRoleSelector value={EntityRole.MEMBER} onChange={vi.fn()} />);

    fireEvent.click(screen.getByRole('button'));

    expect(screen.getByText('Owner')).toBeInTheDocument();
    expect(screen.getByText('Manager')).toBeInTheDocument();
    // Member appears twice: in the button and in the dropdown
    expect(screen.getAllByText('Member').length).toBe(2);
  });

  it('shows role descriptions in dropdown', () => {
    render(<MemberRoleSelector value={EntityRole.MEMBER} onChange={vi.fn()} />);

    fireEvent.click(screen.getByRole('button'));

    expect(
      screen.getByText('Full access to all settings and members')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Can manage projects and API keys')
    ).toBeInTheDocument();
    expect(screen.getByText('Read-only access')).toBeInTheDocument();
  });

  it('calls onChange when role is selected', () => {
    const onChange = vi.fn();
    render(
      <MemberRoleSelector value={EntityRole.MEMBER} onChange={onChange} />
    );

    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText('Manager'));

    expect(onChange).toHaveBeenCalledWith(EntityRole.MANAGER);
  });

  it('closes dropdown after selection', () => {
    render(<MemberRoleSelector value={EntityRole.MEMBER} onChange={vi.fn()} />);

    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText('Owner'));

    // Dropdown should close, so descriptions shouldn't be visible
    expect(
      screen.queryByText('Full access to all settings and members')
    ).not.toBeInTheDocument();
  });

  it('is disabled when disabled prop is true', () => {
    render(
      <MemberRoleSelector
        value={EntityRole.MEMBER}
        onChange={vi.fn()}
        disabled
      />
    );

    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('applies custom className', () => {
    const { container } = render(
      <MemberRoleSelector
        value={EntityRole.MEMBER}
        onChange={vi.fn()}
        className='custom-class'
      />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });
});
