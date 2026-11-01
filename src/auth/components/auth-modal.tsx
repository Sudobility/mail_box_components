import { useState, useEffect, useCallback } from 'react';
import { useAuthStatus } from '../context/auth-provider';
import type { AuthModalProps, AuthMode } from '../types';
import { AuthContent } from './auth-content';
import { cn } from '../lib/cn';
import { colors, ui } from '@sudobility/design';

/**
 * AuthModal - Modal dialog for authentication
 * Can be used in controlled mode (open/onClose) or context mode (isModalOpen/closeModal)
 */
export function AuthModal({
  open,
  onClose,
  initialMode = 'select',
  className,
  backdropClassName,
  contentClassName,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  headerContent,
  footerContent,
  providers,
  onTrack,
  trackingLabel,
  componentName = 'AuthModal',
}: AuthModalProps) {
  const { isModalOpen, closeModal, texts, isAuthenticated, isAnonymous } =
    useAuthStatus();
  const [mode, setMode] = useState<AuthMode>(initialMode);

  // Determine if modal is open (controlled or context mode)
  const isOpen = open !== undefined ? open : isModalOpen;
  const baseClose = onClose ?? closeModal;

  const handleClose = useCallback(() => {
    onTrack?.({ action: 'modal_close', trackingLabel, componentName });
    baseClose();
  }, [onTrack, trackingLabel, componentName, baseClose]);

  // Reset mode when modal opens
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
    }
  }, [isOpen, initialMode]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, handleClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (closeOnBackdropClick && e.target === e.currentTarget) {
        handleClose();
      }
    },
    [closeOnBackdropClick, handleClose]
  );

  const handleSuccess = useCallback(() => {
    handleClose();
  }, [handleClose]);

  // Don't render if not open
  if (!isOpen) return null;

  // Don't show modal if already authenticated (non-anonymous)
  if (isAuthenticated && !isAnonymous) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center',
        // intentional: modal backdrop scrim (matches ui.background.overlay)
        'bg-black/50 backdrop-blur-sm',
        backdropClassName
      )}
      onClick={handleBackdropClick}
    >
      <div
        className={cn(
          'relative w-full max-w-md mx-4',
          ui.background.surface,
          'rounded-xl shadow-2xl',
          'animate-in fade-in zoom-in-95 duration-200',
          className
        )}
        role='dialog'
        aria-modal='true'
      >
        {/* Close button */}
        <button
          type='button'
          onClick={handleClose}
          className={cn(
            'absolute top-4 right-4 p-1',
            'text-muted-foreground hover:text-foreground',
            colors.component.button.ghost.base,
            colors.component.button.ghost.dark,
            'rounded',
            ui.transition.default
          )}
          aria-label={texts.close}
        >
          <svg
            className='w-5 h-5'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M6 18L18 6M6 6l12 12'
            />
          </svg>
        </button>

        {/* Header content */}
        {headerContent && <div className='px-6 pt-6 pb-0'>{headerContent}</div>}

        {/* Auth content */}
        <div className={cn('p-6', contentClassName)}>
          <AuthContent
            mode={mode}
            onModeChange={setMode}
            providers={providers}
            onSuccess={handleSuccess}
          />
        </div>

        {/* Footer content */}
        {footerContent && <div className='px-6 pb-6 pt-0'>{footerContent}</div>}
      </div>
    </div>
  );
}
