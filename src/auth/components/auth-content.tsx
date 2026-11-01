import { useAuthStatus } from '../context/auth-provider';
import type { AuthContentProps, AuthMode, AuthTrackingData } from '../types';
import { ProviderButtons } from './shared/provider-buttons';
import { EmailSignInForm } from './forms/email-signin-form';
import { EmailSignUpForm } from './forms/email-signup-form';
import { ForgotPasswordForm } from './forms/forgot-password-form';
import { Text } from '../../index';
import { colors, ui } from '@sudobility/design';

/** Extended props with tracking */
interface AuthContentPropsWithTracking extends AuthContentProps {
  /** Optional tracking callback */
  onTrack?: (data: AuthTrackingData) => void;
  /** Optional tracking label */
  trackingLabel?: string;
  /** Optional component name for tracking */
  componentName?: string;
}

/**
 * Get title for current auth mode
 */
function getTitle(
  mode: AuthMode,
  texts: {
    signInTitle: string;
    signInWithEmail: string;
    createAccount: string;
    resetPassword: string;
  }
): string {
  switch (mode) {
    case 'select':
      return texts.signInTitle;
    case 'email-signin':
      return texts.signInWithEmail;
    case 'email-signup':
      return texts.createAccount;
    case 'forgot-password':
      return texts.resetPassword;
    default:
      return texts.signInTitle;
  }
}

/**
 * AuthContent - shared auth UI logic used by both Modal and Inline components
 */
export function AuthContent({
  mode,
  onModeChange,
  providers,
  onSuccess,
  compact,
  onTrack,
  trackingLabel,
  componentName = 'AuthContent',
}: AuthContentPropsWithTracking) {
  const handleModeChange = (newMode: AuthMode) => {
    onTrack?.({ action: 'switch_mode', trackingLabel, componentName });
    onModeChange(newMode);
  };
  const { providerConfig, texts } = useAuthStatus();

  const activeProviders = providers ?? providerConfig.providers;
  const title = getTitle(mode, texts);

  // Provider selection view
  if (mode === 'select') {
    return (
      <div className={compact ? 'space-y-4' : 'space-y-6'}>
        <Text
          size={compact ? 'lg' : 'xl'}
          weight='semibold'
          className='text-center'
        >
          {title}
        </Text>
        <ProviderButtons
          providers={activeProviders}
          onEmailClick={() => handleModeChange('email-signin')}
          compact={compact}
          onTrack={onTrack}
          trackingLabel={trackingLabel}
          componentName={componentName}
        />
      </div>
    );
  }

  // Email sign-in form
  if (mode === 'email-signin') {
    return (
      <div className={compact ? 'space-y-4' : 'space-y-6'}>
        <div className='flex items-center'>
          <button
            type='button'
            onClick={() => handleModeChange('select')}
            className={`p-1 ${colors.component.button.ghost.base} ${colors.component.button.ghost.dark} rounded ${ui.transition.default}`}
            aria-label='Back'
          >
            <svg
              className='w-5 h-5 text-muted-foreground'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M15 19l-7-7 7-7'
              />
            </svg>
          </button>
          <Text
            size={compact ? 'lg' : 'xl'}
            weight='semibold'
            className='flex-1 text-center mr-6'
          >
            {title}
          </Text>
        </div>
        <EmailSignInForm
          onSwitchToSignUp={() => handleModeChange('email-signup')}
          onSwitchToForgotPassword={() => handleModeChange('forgot-password')}
          onSuccess={onSuccess}
          compact={compact}
          onTrack={onTrack}
          trackingLabel={trackingLabel}
          componentName={componentName}
        />
      </div>
    );
  }

  // Email sign-up form
  if (mode === 'email-signup') {
    return (
      <div className={compact ? 'space-y-4' : 'space-y-6'}>
        <div className='flex items-center'>
          <button
            type='button'
            onClick={() => handleModeChange('email-signin')}
            className={`p-1 ${colors.component.button.ghost.base} ${colors.component.button.ghost.dark} rounded ${ui.transition.default}`}
            aria-label='Back'
          >
            <svg
              className='w-5 h-5 text-muted-foreground'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M15 19l-7-7 7-7'
              />
            </svg>
          </button>
          <Text
            size={compact ? 'lg' : 'xl'}
            weight='semibold'
            className='flex-1 text-center mr-6'
          >
            {title}
          </Text>
        </div>
        <EmailSignUpForm
          onSwitchToSignIn={() => handleModeChange('email-signin')}
          onSuccess={onSuccess}
          compact={compact}
          onTrack={onTrack}
          trackingLabel={trackingLabel}
          componentName={componentName}
        />
      </div>
    );
  }

  // Forgot password form
  if (mode === 'forgot-password') {
    return (
      <div className={compact ? 'space-y-4' : 'space-y-6'}>
        <div className='flex items-center'>
          <button
            type='button'
            onClick={() => handleModeChange('email-signin')}
            className={`p-1 ${colors.component.button.ghost.base} ${colors.component.button.ghost.dark} rounded ${ui.transition.default}`}
            aria-label='Back'
          >
            <svg
              className='w-5 h-5 text-muted-foreground'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M15 19l-7-7 7-7'
              />
            </svg>
          </button>
          <Text
            size={compact ? 'lg' : 'xl'}
            weight='semibold'
            className='flex-1 text-center mr-6'
          >
            {title}
          </Text>
        </div>
        <ForgotPasswordForm
          onSwitchToSignIn={() => handleModeChange('email-signin')}
          compact={compact}
          onTrack={onTrack}
          trackingLabel={trackingLabel}
          componentName={componentName}
        />
      </div>
    );
  }

  return null;
}
