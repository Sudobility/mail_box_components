import { useState, type FormEvent } from 'react';
import { Button, Input, Text } from '../../../index';
import { useAuthStatus } from '../../context/auth-provider';
import type { ForgotPasswordFormProps } from '../../types';
import { textVariants, colors } from '@sudobility/design';

/**
 * Forgot password form component
 */
export function ForgotPasswordForm({
  onSwitchToSignIn,
  compact,
  onTrack,
  trackingLabel,
  componentName = 'ForgotPasswordForm',
}: ForgotPasswordFormProps) {
  const { resetPassword, loading, error, clearError, texts } = useAuthStatus();
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();
    onTrack?.({ action: 'form_submit', trackingLabel, componentName });

    try {
      await resetPassword(email);
      setEmailSent(true);
    } catch {
      // Error is handled by the context
    }
  };

  const handleSwitchToSignIn = () => {
    onTrack?.({ action: 'switch_mode', trackingLabel, componentName });
    onSwitchToSignIn();
  };

  const buttonSize = compact ? 'default' : 'lg';
  const spacing = compact ? 'space-y-3' : 'space-y-4';

  // Success state
  if (emailSent) {
    return (
      <div className={spacing}>
        <div className='text-center'>
          <div
            className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4 ${colors.component.alert.success.base} ${colors.component.alert.success.dark}`}
          >
            <svg
              className={`w-6 h-6 ${colors.component.alert.success.icon}`}
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M5 13l4 4L19 7'
              />
            </svg>
          </div>
          <Text weight='medium' className='mb-2'>
            {texts.resetEmailSent}
          </Text>
          <Text size='sm' color='muted'>
            {texts.resetEmailSentDesc.replace('{{email}}', email)}
          </Text>
        </div>

        <Button
          type='button'
          variant='secondary'
          size={buttonSize}
          onClick={handleSwitchToSignIn}
          className='w-full'
        >
          {texts.backToSignIn}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={spacing}>
      <Text size='sm' color='muted' className='text-center'>
        {texts.resetPassword}
      </Text>

      <div>
        <label
          htmlFor='reset-email'
          className={`block mb-1 ${textVariants.label.default()}`}
        >
          {texts.email}
        </label>
        <Input
          id='reset-email'
          type='email'
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder={texts.emailPlaceholder}
          required
          autoComplete='email'
          disabled={loading}
        />
      </div>

      {/* Error message */}
      {error && (
        <Text size='sm' className={textVariants.label.error()}>
          {error}
        </Text>
      )}

      {/* Submit button */}
      <Button
        type='submit'
        variant='primary'
        size={buttonSize}
        disabled={loading}
        className='w-full'
      >
        {loading ? texts.loading : texts.sendResetLink}
      </Button>

      {/* Back to sign in link */}
      <div className='text-center'>
        <button
          type='button'
          onClick={handleSwitchToSignIn}
          className='text-sm text-primary hover:underline'
        >
          {texts.backToSignIn}
        </button>
      </div>
    </form>
  );
}
