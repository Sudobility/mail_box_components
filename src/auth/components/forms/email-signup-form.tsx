import { useState, type FormEvent } from 'react';
import { Button, Input, Text } from '../../../index';
import { useAuthStatus } from '../../context/auth-provider';
import type { EmailSignUpFormProps } from '../../types';
import { textVariants } from '@sudobility/design';

/**
 * Email sign-up form component
 */
export function EmailSignUpForm({
  onSwitchToSignIn,
  onSuccess,
  compact,
  onTrack,
  trackingLabel,
  componentName = 'EmailSignUpForm',
}: EmailSignUpFormProps) {
  const { signUpWithEmail, loading, error, clearError, texts } =
    useAuthStatus();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();
    setValidationError(null);
    onTrack?.({ action: 'form_submit', trackingLabel, componentName });

    // Validate password match
    if (password !== confirmPassword) {
      setValidationError(texts.passwordMismatch);
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setValidationError(texts.passwordTooShort);
      return;
    }

    await signUpWithEmail(email, password, displayName || undefined);

    // If no error after sign up, call success callback
    onSuccess?.();
  };

  const handleSwitchToSignIn = () => {
    onTrack?.({ action: 'switch_mode', trackingLabel, componentName });
    onSwitchToSignIn();
  };

  const buttonSize = compact ? 'default' : 'lg';
  const spacing = compact ? 'space-y-3' : 'space-y-4';
  const displayError = validationError || error;

  return (
    <form onSubmit={handleSubmit} className={spacing}>
      <div className={spacing}>
        <div>
          <label
            htmlFor='signup-name'
            className={`block mb-1 ${textVariants.label.default()}`}
          >
            {texts.displayName}
          </label>
          <Input
            id='signup-name'
            type='text'
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
            placeholder={texts.displayNamePlaceholder}
            autoComplete='name'
            disabled={loading}
          />
        </div>

        <div>
          <label
            htmlFor='signup-email'
            className={`block mb-1 ${textVariants.label.default()}`}
          >
            {texts.email}
          </label>
          <Input
            id='signup-email'
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
            htmlFor='signup-password'
            className={`block mb-1 ${textVariants.label.default()}`}
          >
            {texts.password}
          </label>
          <Input
            id='signup-password'
            type='password'
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder={texts.passwordPlaceholder}
            required
            autoComplete='new-password'
            disabled={loading}
          />
        </div>

        <div>
          <label
            htmlFor='signup-confirm'
            className={`block mb-1 ${textVariants.label.default()}`}
          >
            {texts.confirmPassword}
          </label>
          <Input
            id='signup-confirm'
            type='password'
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            placeholder={texts.confirmPasswordPlaceholder}
            required
            autoComplete='new-password'
            disabled={loading}
          />
        </div>
      </div>

      {/* Error message */}
      {displayError && (
        <Text size='sm' className={textVariants.label.error()}>
          {displayError}
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
        {loading ? texts.loading : texts.signUp}
      </Button>

      {/* Sign in link */}
      <div className='text-center'>
        <Text size='sm' color='muted'>
          {texts.haveAccount}{' '}
          <button
            type='button'
            onClick={handleSwitchToSignIn}
            className='text-primary hover:underline font-medium'
          >
            {texts.signIn}
          </button>
        </Text>
      </div>
    </form>
  );
}
