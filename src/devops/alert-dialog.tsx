import React from 'react';
import { colors } from '@sudobility/design';
import { cn, Portal, Overlay } from '../index';

export interface AlertDialogProps {
  /** Whether dialog is open */
  isOpen: boolean;
  /** Close handler */
  onClose: () => void;
  /** Dialog title */
  title: React.ReactNode;
  /** Dialog description */
  description?: React.ReactNode;
  /** Confirm button label */
  confirmLabel?: string;
  /** Cancel button label */
  cancelLabel?: string;
  /** Confirm handler */
  onConfirm: () => void;
  /** Variant type */
  variant?: 'default' | 'danger' | 'warning' | 'success';
  /** Show cancel button */
  showCancel?: boolean;
  /** Disable confirm button */
  confirmDisabled?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Additional className */
  className?: string;
  /** Optional tracking callback */
  onTrack?: (action: string) => void;
}

/**
 * AlertDialog Component
 *
 * Modal dialog for important alerts, confirmations, and destructive actions.
 * Provides clear visual hierarchy and action buttons.
 *
 * @example
 * ```tsx
 * <AlertDialog
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   onConfirm={handleDelete}
 *   title="Delete item?"
 *   description="This action cannot be undone."
 *   variant="danger"
 *   confirmLabel="Delete"
 * />
 * ```
 *
 * @example
 * ```tsx
 * <AlertDialog
 *   isOpen={true}
 *   onClose={handleClose}
 *   onConfirm={handleConfirm}
 *   title="Confirm action"
 *   variant="warning"
 *   loading={isProcessing}
 * />
 * ```
 */
export const AlertDialog: React.FC<AlertDialogProps> = ({
  isOpen,
  onClose,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  variant = 'default',
  showCancel = true,
  confirmDisabled = false,
  loading = false,
  className,
  onTrack,
}) => {
  if (!isOpen) return null;

  // Variant configurations
  const variantClasses = {
    default: {
      icon: 'text-primary',
      iconBg: 'bg-primary/10',
      button: 'bg-primary hover:bg-primary/90 text-primary-foreground',
    },
    danger: {
      icon: 'text-destructive',
      iconBg: 'bg-destructive/10',
      button:
        'bg-destructive hover:bg-destructive/90 text-destructive-foreground',
    },
    warning: {
      icon: 'text-warning',
      iconBg: 'bg-warning/10',
      button: 'bg-warning hover:bg-warning/90 text-warning-foreground',
    },
    success: {
      icon: 'text-success',
      iconBg: 'bg-success/10',
      button: 'bg-success hover:bg-success/90 text-success-foreground',
    },
  };

  const icons = {
    default: (
      <svg
        className='w-6 h-6'
        fill='none'
        stroke='currentColor'
        viewBox='0 0 24 24'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
        />
      </svg>
    ),
    danger: (
      <svg
        className='w-6 h-6'
        fill='none'
        stroke='currentColor'
        viewBox='0 0 24 24'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
        />
      </svg>
    ),
    warning: (
      <svg
        className='w-6 h-6'
        fill='none'
        stroke='currentColor'
        viewBox='0 0 24 24'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
        />
      </svg>
    ),
    success: (
      <svg
        className='w-6 h-6'
        fill='none'
        stroke='currentColor'
        viewBox='0 0 24 24'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
        />
      </svg>
    ),
  };

  const handleConfirm = () => {
    if (!confirmDisabled && !loading) {
      onTrack?.('confirm');
      onConfirm();
    }
  };

  const handleCancel = () => {
    onTrack?.('cancel');
    onClose();
  };

  return (
    <Portal>
      <Overlay isOpen={isOpen} onClose={onClose} opacity='dark' blur />
      <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
        <div
          className={cn(
            'relative w-full max-w-md',
            colors.component.card.default.base,
            colors.component.card.default.dark,
            'rounded-lg shadow-xl',
            'animate-in fade-in zoom-in-95 duration-200',
            className
          )}
          onClick={e => e.stopPropagation()}
        >
          {/* Content */}
          <div className='p-6'>
            {/* Icon */}
            <div className='flex items-start gap-4'>
              <div
                className={cn(
                  'flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center',
                  variantClasses[variant].iconBg
                )}
              >
                <div className={variantClasses[variant].icon}>
                  {icons[variant]}
                </div>
              </div>

              <div className='flex-1 min-w-0'>
                {/* Title */}
                <h2 className='text-lg font-semibold text-foreground mb-2'>
                  {title}
                </h2>

                {/* Description */}
                {description && (
                  <p className='text-sm text-muted-foreground'>{description}</p>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className='flex gap-3 px-6 py-4 bg-card/50 rounded-b-lg'>
            {showCancel && (
              <button
                onClick={handleCancel}
                disabled={loading}
                className='flex-1 px-4 py-2 text-sm font-medium text-muted-foreground bg-card border border-border rounded-md hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {cancelLabel}
              </button>
            )}

            <button
              onClick={handleConfirm}
              disabled={confirmDisabled || loading}
              className={cn(
                'flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
                variantClasses[variant].button
              )}
            >
              {loading ? (
                <span className='flex items-center justify-center gap-2'>
                  <svg
                    className='animate-spin h-4 w-4'
                    fill='none'
                    viewBox='0 0 24 24'
                  >
                    <circle
                      className='opacity-25'
                      cx='12'
                      cy='12'
                      r='10'
                      stroke='currentColor'
                      strokeWidth='4'
                    />
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                    />
                  </svg>
                  Loading...
                </span>
              ) : (
                confirmLabel
              )}
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
};
