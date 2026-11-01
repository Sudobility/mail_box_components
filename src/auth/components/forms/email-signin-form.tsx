import { useState, type FormEvent } from 'react';
import { Button, Input, Text } from '../../../index';
import { useAuthStatus } from '../../context/auth-provider';
import type { EmailSignInFormProps } from '../../types';
import { textVariants } from '@sudobility/design';

/**
 * Email sign-in form component
 */
export function EmailSignInForm({
  onSwitchToSignUp,
  onSwitchToForgotPassword,
  onSuccess,
  compact,
  onTrack,
  trackingLabel,
  componentName = 'EmailSignInForm',
}: EmailSignInFormProps) {
  const { signInWithEmail, loading, error, clearError, texts } =
    useAuthStatus();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();
    onTrack?.({ action: 'form_submit', trackingLabel, componentName });

    await signInWithEmail(email, password);

    // If no error after sign in, call success callback
    // Note: actual auth state change will be handled by the provider
    onSuccess?.();
  };

  const handleSwitchToForgotPassword = () => {
    onTrack?.({ action: 'switch_mode', trackingLabel, componentName });
    onSwitchToForgotPassword();
  };

  const handleSwitchToSignUp = () => {
    onTrack?.({ action: 'switch_mode', trackingLabel, componentName });
    onSwitchToSignUp();
  };

  const buttonSize = compact ? 'default' : 'lg';
  const spacing = compact ? 'space-y-3' : 'space-y-4';

  return (
    <form onSubmit={handleSubmit} className={spacing}>
      <div className={spacing}>
        <div>
          <label
            htmlFor='signin-email'
            className={`block mb-1 ${textVariants.label.default()}`}
          >
            {texts.email}
          </label>
          <Input
            id='signin-email'
            type='email'
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder={texts.emailPlaceholder}
            required
            autoComplete='email'
            disabled={loading}
          />
        </div>

        <div>
          <label
            htmlFor='signin-password'
            className={`block mb-1 ${textVariants.label.default()}`}
          >
            {texts.password}
          </label>
          <Input
            id='signin-password'
            type='password'
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder={texts.passwordPlaceholder}
            required
            autoComplete='current-password'
            disabled={loading}
          />
        </div>
      </div>

      {/* Forgot password link */}
      <div className='flex justify-end'>
        <button
          type='button'
          onClick={handleSwitchToForgotPassword}
          className='text-sm text-primary hover:underline'
        >
          {texts.forgotPassword}
        </button>
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
        {loading ? texts.loading : texts.signIn}
      </Button>

      {/* Sign up link */}
      <div className='text-center'>
        <Text size='sm' color='muted'>
          {texts.noAccount}{' '}
          <button
            type='button'
            onClick={handleSwitchToSignUp}
            className='text-primary hover:underline font-medium'
          >
            {texts.signUp}
          </button>
        </Text>
      </div>
    </form>
  );
}
