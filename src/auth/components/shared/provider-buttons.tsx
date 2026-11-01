import { Button } from '../../../index';
import { useAuthStatus } from '../../context/auth-provider';
import type { ProviderButtonsProps } from '../../types';
import { cn } from '../../lib/cn';
import { ui } from '@sudobility/design';

/**
 * Google icon SVG
 */
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox='0 0 24 24'>
      <path
        fill='currentColor'
        d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
      />
      <path
        fill='currentColor'
        d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
      />
      <path
        fill='currentColor'
        d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
      />
      <path
        fill='currentColor'
        d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
      />
    </svg>
  );
}

/**
 * Apple icon SVG
 */
function AppleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox='0 0 24 24' fill='currentColor'>
      <path d='M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z' />
    </svg>
  );
}

/**
 * Email icon SVG
 */
function EmailIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill='none'
      stroke='currentColor'
      viewBox='0 0 24 24'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
      />
    </svg>
  );
}

/**
 * Provider buttons component - shows available sign-in providers
 */
export function ProviderButtons({
  providers,
  onEmailClick,
  compact,
  onTrack,
  trackingLabel,
  componentName = 'ProviderButtons',
}: ProviderButtonsProps) {
  const { signInWithGoogle, signInWithApple, loading, texts } = useAuthStatus();

  const showGoogle = providers.includes('google');
  const showApple = providers.includes('apple');
  const showEmail = providers.includes('email');

  const buttonSize = compact ? 'default' : 'lg';
  const iconSize = compact ? 'w-4 h-4' : 'w-5 h-5';

  const handleGoogleClick = () => {
    onTrack?.({ action: 'provider_click', trackingLabel, componentName });
    signInWithGoogle();
  };

  const handleAppleClick = () => {
    onTrack?.({ action: 'provider_click', trackingLabel, componentName });
    signInWithApple();
  };

  const handleEmailClick = () => {
    onTrack?.({ action: 'provider_click', trackingLabel, componentName });
    onEmailClick();
  };

  return (
    <div className={cn('space-y-3', compact && 'space-y-2')}>
      {showGoogle && (
        <Button
          variant='secondary'
          size={buttonSize}
          onClick={handleGoogleClick}
          disabled={loading}
          className='w-full'
        >
          <GoogleIcon className={cn(iconSize, 'mr-2')} />
          {texts.continueWithGoogle}
        </Button>
      )}

      {showApple && (
        <Button
          variant='secondary'
          size={buttonSize}
          onClick={handleAppleClick}
          disabled={loading}
          className='w-full'
        >
          <AppleIcon className={cn(iconSize, 'mr-2')} />
          {texts.continueWithApple}
        </Button>
      )}

      {showEmail && (showGoogle || showApple) && (
        <div className='relative'>
          <div className='absolute inset-0 flex items-center'>
            <div className={cn('w-full border-t', ui.border.default)} />
          </div>
          <div className='relative flex justify-center text-sm'>
            <span
              className={cn(
                'px-2 text-muted-foreground',
                ui.background.surface
              )}
            >
              {texts.or}
            </span>
          </div>
        </div>
      )}

      {showEmail && (
        <Button
          variant='secondary'
          size={buttonSize}
          onClick={handleEmailClick}
          className='w-full'
        >
          <EmailIcon className={cn(iconSize, 'mr-2')} />
          {texts.continueWithEmail}
        </Button>
      )}
    </div>
  );
}
