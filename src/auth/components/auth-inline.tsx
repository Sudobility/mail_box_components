import { useState, useEffect } from 'react';
import { Text } from '../../index';
import { useAuthStatus } from '../context/auth-provider';
import type { AuthInlineProps, AuthMode } from '../types';
import { AuthContent } from './auth-content';
import { cn } from '../lib/cn';
import { ui, designTokens } from '@sudobility/design';

/**
 * AuthInline - Inline authentication component (non-modal)
 * Can be embedded directly in a page
 */
export function AuthInline({
  initialMode = 'select',
  className,
  providers,
  showTitle = true,
  title,
  compact = false,
  onModeChange,
  onSuccess,
  variant = 'card',
}: AuthInlineProps) {
  const { isAuthenticated, isAnonymous } = useAuthStatus();
  const [mode, setMode] = useState<AuthMode>(initialMode);

  // Sync mode changes to parent
  useEffect(() => {
    onModeChange?.(mode);
  }, [mode, onModeChange]);

  const handleModeChange = (newMode: AuthMode) => {
    setMode(newMode);
  };

  // Don't render if already authenticated (non-anonymous)
  if (isAuthenticated && !isAnonymous) {
    return null;
  }

  const variantStyles = {
    card: `${ui.background.surface} ${designTokens.radius.xl} ${designTokens.shadow.lg}`,
    bordered: `${ui.background.surface} ${designTokens.radius.xl} border ${ui.border.default}`,
    flat: 'bg-transparent',
  };

  const paddingStyles = compact ? 'p-4' : 'p-6';

  return (
    <div
      className={cn(
        'w-full max-w-md',
        variantStyles[variant],
        variant !== 'flat' && paddingStyles,
        className
      )}
    >
      {/* Optional title override */}
      {showTitle && title && mode === 'select' && (
        <Text
          size={compact ? 'lg' : 'xl'}
          weight='semibold'
          className={cn('text-center', compact ? 'mb-4' : 'mb-6')}
        >
          {title}
        </Text>
      )}

      <AuthContent
        mode={mode}
        onModeChange={handleModeChange}
        providers={providers}
        onSuccess={onSuccess}
        compact={compact}
      />
    </div>
  );
}
