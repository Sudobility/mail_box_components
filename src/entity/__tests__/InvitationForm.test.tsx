import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { InvitationForm } from '../components/InvitationForm';
import { EntityRole } from '@sudobility/types';

describe('InvitationForm', () => {
  it('renders email input and submit button', () => {
    render(<InvitationForm onSubmit={vi.fn()} />);

    expect(
      screen.getByPlaceholderText('Enter email address')
    ).toBeInTheDocument();
    expect(screen.getByText('Invite')).toBeInTheDocument();
  });

  it('validates empty email', async () => {
    const onSubmit = vi.fn();
    render(<InvitationForm onSubmit={onSubmit} />);

    const form = screen
      .getByRole('button', { name: /invite/i })
      .closest('form');
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument();
    });

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('validates invalid email format', async () => {
    render(<InvitationForm onSubmit={vi.fn()} />);

    const input = screen.getByPlaceholderText('Enter email address');
    fireEvent.change(input, { target: { value: 'invalid-email' } });

    const form = screen
      .getByRole('button', { name: /invite/i })
      .closest('form');
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(
        screen.getByText('Please enter a valid email address')
      ).toBeInTheDocument();
    });
  });

  it('submits with valid email', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<InvitationForm onSubmit={onSubmit} />);

    const input = screen.getByPlaceholderText('Enter email address');
    fireEvent.change(input, { target: { value: 'test@example.com' } });

    const form = screen
      .getByRole('button', { name: /invite/i })
      .closest('form');
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        role: EntityRole.MEMBER,
      });
    });
  });

  it('uses custom default role', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(
      <InvitationForm onSubmit={onSubmit} defaultRole={EntityRole.MANAGER} />
    );

    const input = screen.getByPlaceholderText('Enter email address');
    fireEvent.change(input, { target: { value: 'test@example.com' } });

    const form = screen
      .getByRole('button', { name: /invite/i })
      .closest('form');
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        role: EntityRole.MANAGER,
      });
    });
  });

  it('clears form after successful submission', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<InvitationForm onSubmit={onSubmit} />);

    const input = screen.getByPlaceholderText(
      'Enter email address'
    ) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'test@example.com' } });

    const form = screen
      .getByRole('button', { name: /invite/i })
      .closest('form');
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(input.value).toBe('');
    });
  });

  it('shows error when submission fails', async () => {
    const onSubmit = vi.fn().mockRejectedValue(new Error('Network error'));
    render(<InvitationForm onSubmit={onSubmit} />);

    const input = screen.getByPlaceholderText('Enter email address');
    fireEvent.change(input, { target: { value: 'test@example.com' } });

    const form = screen
      .getByRole('button', { name: /invite/i })
      .closest('form');
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });
  });

  it('disables form when isSubmitting', () => {
    render(<InvitationForm onSubmit={vi.fn()} isSubmitting />);

    expect(screen.getByPlaceholderText('Enter email address')).toBeDisabled();
  });
});
