import React from 'react';
import { cn, useCopyToClipboard } from '../index';
import { ui } from '@sudobility/design';
import { ClipboardDocumentIcon, CheckIcon } from '@heroicons/react/24/outline';

export interface CopyButtonProps {
  /** Text to copy to clipboard */
  text: string;
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
  /** Button variant */
  variant?: 'icon' | 'text' | 'outline';
  /** Custom label (for text/outline variants) */
  label?: string;
  /** Custom success label (for text/outline variants) */
  successLabel?: string;
  /** Icon position (for text/outline variants) */
  iconPosition?: 'left' | 'right';
  /** Additional className */
  className?: string;
  /** Custom tooltip text */
  title?: string;
  /** Callback after successful copy */
  onCopySuccess?: () => void;
  /** Callback after copy error */
  onCopyError?: (error: Error) => void;
}

/**
 * CopyButton Component
 *
 * A button that copies text to the clipboard with visual feedback.
 * Commonly used for copying IDs, addresses, code snippets, or URLs.
 *
 * @example
 * ```tsx
 * // Icon button (default)
 * <CopyButton text="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb" />
 *
 * // Text button with label
 * <CopyButton
 *   text="https://example.com?referral=abc123"
 *   variant="text"
 *   label="Copy Link"
 *   successLabel="Copied!"
 * />
 *
 * // Outline button
 * <CopyButton
 *   text={templateId}
 *   variant="outline"
 *   label="Copy ID"
 * />
 * ```
 */
export const CopyButton: React.FC<CopyButtonProps> = ({
  text,
  size = 'md',
  variant = 'icon',
  label = 'Copy',
  successLabel = 'Copied!',
  iconPosition = 'left',
  className,
  title,
  onCopySuccess,
  onCopyError,
}) => {
  const { copyToClipboard, isCopied } = useCopyToClipboard({
    successDuration: 2000,
    onSuccess: onCopySuccess,
    onError: onCopyError,
  });

  const copied = isCopied(text);

  const handleClick = () => {
    copyToClipboard(text);
  };

  // Size configurations
  const sizeClasses = {
    sm: {
      icon: 'h-3.5 w-3.5',
      button: 'p-1',
      text: 'text-xs px-2 py-1',
    },
    md: {
      icon: 'h-4 w-4',
      button: 'p-1.5',
      text: 'text-sm px-3 py-1.5',
    },
    lg: {
      icon: 'h-5 w-5',
      button: 'p-2',
      text: 'text-base px-4 py-2',
    },
  };

  const sizeConfig = sizeClasses[size];
  const Icon = copied ? CheckIcon : ClipboardDocumentIcon;

  // Icon-only button
  if (variant === 'icon') {
    return (
      <button
        onClick={handleClick}
        className={cn(
          'inline-flex items-center justify-center rounded',
          ui.transition.default,
          copied
            ? ui.text.success
            : 'text-muted-foreground hover:text-foreground',
          sizeConfig.button,
          className
        )}
        title={title || (copied ? 'Copied!' : 'Copy to clipboard')}
        type='button'
      >
        <Icon className={sizeConfig.icon} />
      </button>
    );
  }

  // Text or outline button
  const baseTextClasses = cn(
    'inline-flex items-center gap-2 rounded font-medium',
    ui.transition.default,
    sizeConfig.text
  );

  const variantClasses = {
    text: cn(copied ? ui.text.success : ui.text.linkSubtle),
    outline: cn(
      'border',
      copied
        ? 'border-success text-success'
        : `${ui.border.default} text-foreground hover:border-border`
    ),
  };

  const displayLabel = copied ? successLabel : label;

  return (
    <button
      onClick={handleClick}
      className={cn(baseTextClasses, variantClasses[variant], className)}
      title={title || (copied ? 'Copied!' : 'Copy to clipboard')}
      type='button'
    >
      {iconPosition === 'left' && <Icon className={sizeConfig.icon} />}
      <span>{displayLabel}</span>
      {iconPosition === 'right' && <Icon className={sizeConfig.icon} />}
    </button>
  );
};
